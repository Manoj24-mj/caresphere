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
});
