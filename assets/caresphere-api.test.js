const { test, describe } = require("node:test");
const assert = require("node:assert/strict");

describe("CareSphere Frontend API Client", () => {
  // Mock browser window environment
  const mockStorage = new Map();
  global.window = {};
  global.sessionStorage = {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k)
  };
  global.localStorage = {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k)
  };
  global.CustomEvent = class {
    constructor(name, opts) {
      this.name = name;
      this.detail = opts?.detail;
    }
  };
  global.window.dispatchEvent = () => true;
  global.window.addEventListener = () => {};

  // Load module
  require("./caresphere-api.js");
  const api = global.window.CareSphereAPI;

  test("API client exports as a global window.CareSphereAPI object", () => {
    assert.ok(api);
    assert.equal(typeof api.checkHealth, "function");
    assert.equal(typeof api.request, "function");
  });

  test("Exposes methods for all 7 Core Healthcare Services", () => {
    // 1. Hospital Availability
    assert.equal(typeof api.getHospitals, "function");
    assert.equal(typeof api.getHospitalById, "function");

    // 2. Bed Availability
    assert.equal(typeof api.getBeds, "function");
    assert.equal(typeof api.updateBeds, "function");

    // 3. Doctor Availability
    assert.equal(typeof api.getDoctors, "function");

    // 4. Blood Availability
    assert.equal(typeof api.getBloodInventory, "function");
    assert.equal(typeof api.updateBloodStock, "function");

    // 5. Medicine Availability
    assert.equal(typeof api.getMedicines, "function");
    assert.equal(typeof api.updateMedicineStock, "function");

    // 6. Ambulance Services
    assert.equal(typeof api.getAmbulances, "function");
    assert.equal(typeof api.requestAmbulance, "function");
    assert.equal(typeof api.getAmbulanceTracking, "function");

    // 7. Medical Records Management
    assert.equal(typeof api.getMyMedicalRecords, "function");
    assert.equal(typeof api.generateDoctorAccessPass, "function");
    assert.equal(typeof api.revokeDoctorAccessPass, "function");
    assert.equal(typeof api.uploadMedicalDocument, "function");
  });

  test("Token session storage management functions correctly", () => {
    api.clearSession();
    assert.equal(api.getToken(), null);

    api.setToken("mock-jwt-token-12345");
    assert.equal(api.getToken(), "mock-jwt-token-12345");

    api.clearSession();
    assert.equal(api.getToken(), null);
  });

  test("Gracefully handles offline network failures without throwing uncaught exceptions", async () => {
    // Mock fetch to simulate server connection refused
    global.fetch = async () => {
      throw new Error("ECONNREFUSED 127.0.0.1:5000");
    };

    const res = await api.getHospitals("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.offline, true);
    assert.ok(res.error.includes("ECONNREFUSED"));
  });

  test("GET /api/hospitals successfully retrieves and parses hospital records", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/hospitals?city=bengaluru&query=Victoria"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 1 hospital in bengaluru.",
          data: [
            {
              id: "district-general",
              cityId: "bengaluru",
              name: "District General Hospital",
              hospitalType: "Government hospital",
              address: "Victoria Hospital Campus, Fort Road, Bengaluru - 560002",
              locationArea: "Central District, Bengaluru",
              distanceKm: 2.4,
              status: "Available",
              facilities: ["24x7 Emergency", "ICU"],
              beds: { General: [18, 50], ICU: [3, 12] }
            }
          ]
        })
      };
    };

    const res = await api.getHospitals("bengaluru", { query: "Victoria" });
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].id, "district-general");
    assert.equal(res.data[0].name, "District General Hospital");
  });

  test("GET /api/beds successfully retrieves categorized bed inventory", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/beds?city=bengaluru&type=ICU"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved bed records",
          data: [
            {
              hospitalId: "district-general",
              hospitalName: "District General Hospital",
              category: "ICU",
              available: 3,
              total: 12,
              status: "Available"
            }
          ]
        })
      };
    };

    const res = await api.getBeds("bengaluru", { type: "ICU" });
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].category, "ICU");
    assert.equal(res.data[0].available, 3);
  });

  test("Handles empty API responses for upcoming or unonboarded cities", async () => {
    global.fetch = async (url) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 0 hospitals in mysuru.",
          data: []
        })
      };
    };

    const res = await api.getHospitals("mysuru");
    assert.equal(res.success, true);
    assert.deepEqual(res.data, []);
  });

  test("Handles non-200 server errors cleanly with error description", async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: "Internal database query failure"
        })
      };
    };

    const res = await api.getHospitals("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.status, 500);
    assert.equal(res.error, "Internal database query failure");
  });
});
