/**
 * CareSphere API Client Service
 * Bridges the CareSphere Frontend to the Express.js / PostgreSQL REST Backend.
 * Supports automatic online health detection, Bearer JWT session management,
 * and seamless fallback to verified baseline data when running offline.
 */
(() => {
  "use strict";

  const DEFAULT_API_URL = "http://localhost:5000/api";
  const TOKEN_KEY = "caresphere_jwt_token";
  const USER_KEY = "caresphere_user_session";

  class CareSphereAPIClient {
    constructor() {
      this.baseURL = window.CARESPHERE_API_URL || sessionStorage.getItem("caresphere_api_url") || DEFAULT_API_URL;
      this.isOnline = false;
      this.lastHealthCheck = null;
      this.activeNode = "bengaluru";
      this.listeners = new Set();
    }

    /**
     * Subscribe to API online/offline status changes
     */
    onStatusChange(fn) {
      if (typeof fn === "function") {
        this.listeners.add(fn);
        fn(this.isOnline, this.lastHealthCheck);
      }
      return () => this.listeners.delete(fn);
    }

    _notify(online, details) {
      this.isOnline = online;
      this.lastHealthCheck = details;
      this.listeners.forEach(fn => {
        try { fn(online, details); } catch (e) { console.error("API listener error:", e); }
      });
      window.dispatchEvent(new CustomEvent("caresphere:api-status", {
        detail: { online, details }
      }));
    }

    /**
     * Token & Session Management
     */
    getToken() {
      try {
        return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
      } catch {
        return null;
      }
    }

    setToken(token, persist = false) {
      try {
        if (persist) {
          localStorage.setItem(TOKEN_KEY, token);
        } else {
          sessionStorage.setItem(TOKEN_KEY, token);
        }
      } catch (err) {
        console.warn("Storage warning:", err);
      }
    }

    clearSession() {
      try {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } catch (err) {
        console.warn("Storage warning:", err);
      }
    }

    /**
     * Check Backend Health with fast timeout
     */
    async checkHealth(timeoutMs = 1500) {
      const start = Date.now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const res = await fetch(`${this.baseURL}/health`, {
          method: "GET",
          headers: { "Accept": "application/json" },
          signal: controller.signal
        });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          const latency = Date.now() - start;
          this.activeNode = data.activeNode || "bengaluru";
          this._notify(true, { latency, data });
          return { online: true, latency, data };
        }
        this._notify(false, { error: `HTTP ${res.status}` });
        return { online: false, error: `HTTP ${res.status}` };
      } catch (err) {
        clearTimeout(timer);
        this._notify(false, { error: err.message });
        return { online: false, error: err.message };
      }
    }

    /**
     * Standard Fetch Wrapper with Error Handling & Auth Injection
     */
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
      const token = this.getToken();

      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options.headers || {})
      };

      try {
        const res = await fetch(url, {
          ...options,
          headers
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const errMsg = json?.error || json?.message || `Request failed with status ${res.status}`;
          return {
            success: false,
            status: res.status,
            error: errMsg,
            data: json?.data || null
          };
        }

        return {
          success: true,
          status: res.status,
          data: json?.data !== undefined ? json.data : json,
          message: json?.message || "Success"
        };
      } catch (err) {
        return {
          success: false,
          offline: true,
          error: `Network connection failed: ${err.message}`,
          data: null
        };
      }
    }

    /* =================================================================
     * 1. HOSPITAL AVAILABILITY
     * ================================================================= */
    async getHospitals(city = "bengaluru", params = {}) {
      const q = new URLSearchParams({ city, ...params }).toString();
      return this.request(`/hospitals?${q}`);
    }

    async getHospitalById(id) {
      return this.request(`/hospitals/${encodeURIComponent(id)}`);
    }

    /* =================================================================
     * 2. BED AVAILABILITY
     * ================================================================= */
    async getBeds(city = "bengaluru", params = {}) {
      const q = new URLSearchParams({ city, ...params }).toString();
      return this.request(`/beds?${q}`);
    }

    async updateBeds(hospitalId, beds) {
      return this.request("/beds/update", {
        method: "PATCH",
        body: JSON.stringify({ hospitalId, beds })
      });
    }

    /* =================================================================
     * 3. DOCTOR AVAILABILITY
     * ================================================================= */
    async getDoctors(city = "bengaluru", params = {}) {
      const q = new URLSearchParams({ city, ...params }).toString();
      return this.request(`/doctors?${q}`);
    }

    /* =================================================================
     * 4. BLOOD AVAILABILITY
     * ================================================================= */
    async getBloodInventory(city = "bengaluru", params = "All") {
      const queryParams = typeof params === "string" ? { city, group: params } : { city, ...params };
      const q = new URLSearchParams(queryParams).toString();
      return this.request(`/blood-inventory?${q}`);
    }

    async updateBloodStock(id, units, status) {
      return this.request("/blood-inventory/update", {
        method: "PATCH",
        body: JSON.stringify({ id, units, status })
      });
    }

    /* =================================================================
     * 5. MEDICINE AVAILABILITY
     * ================================================================= */
    async getMedicines(city = "bengaluru", params = {}) {
      const queryParams = typeof params === "string" ? { city, query: params } : { city, ...params };
      const q = new URLSearchParams(queryParams).toString();
      return this.request(`/medicines?${q}`);
    }

    async updateMedicineStock(id, availability, quantity) {
      return this.request("/medicine-inventory/update", {
        method: "PATCH",
        body: JSON.stringify({ id, availability, quantity })
      });
    }

    /* =================================================================
     * 6. AMBULANCE SERVICES
     * ================================================================= */
    async getAmbulances(city = "bengaluru", params = {}) {
      const q = new URLSearchParams({ city, ...params }).toString();
      return this.request(`/ambulances?${q}`);
    }

    async requestAmbulance(dispatchData) {
      return this.request("/ambulance-requests", {
        method: "POST",
        body: JSON.stringify(dispatchData)
      });
    }

    async getAmbulanceTracking(requestId) {
      return this.request(`/ambulance-requests/${encodeURIComponent(requestId)}/tracking`);
    }

    /* =================================================================
     * 7. MEDICAL RECORDS MANAGEMENT (PRIVATE HEALTH VAULT)
     * ================================================================= */
    async getMyMedicalRecords() {
      return this.request("/medical-records/me");
    }

    async generateDoctorAccessPass() {
      return this.request("/medical-records/access-pass/generate", {
        method: "POST"
      });
    }

    async revokeDoctorAccessPass(passId) {
      return this.request("/medical-records/access-pass/revoke", {
        method: "POST",
        body: JSON.stringify({ passId })
      });
    }

    async uploadMedicalDocument(title, category = "Lab Report") {
      return this.request("/medical-records/documents", {
        method: "POST",
        body: JSON.stringify({ title, category })
      });
    }

    /* =================================================================
     * 8. AUTHENTICATION & REGISTRATION
     * ================================================================= */
    async login(mobile, password) {
      const res = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ mobile, password })
      });
      if (res.success && res.data?.token) {
        this.setToken(res.data.token);
      }
      return res;
    }

    async register(userData) {
      const res = await this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      if (res.success && res.data?.token) {
        this.setToken(res.data.token);
      }
      return res;
    }

    async getCities() {
      return this.request("/cities");
    }
  }

  // Export singleton to global window scope
  window.CareSphereAPI = new CareSphereAPIClient();

  // Perform background health check on load
  if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
      window.CareSphereAPI.checkHealth(1200).catch(() => {});
    });
  }
})();
