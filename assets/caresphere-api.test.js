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

  test("GET /api/doctors successfully retrieves and parses doctor records", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/doctors?city=bengaluru"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 3 doctors in bengaluru.",
          data: [
            {
              id: "dr-priya",
              cityId: "bengaluru",
              hospitalId: "district-general",
              name: "Dr. Priya Sharma",
              specialty: "Cardiology",
              qualification: "MBBS, MD (Med), DM (Cardiology)",
              department: "Cardiology & Cardiac Care",
              workingHours: "09:00 AM – 01:30 PM",
              distanceKm: 2.4,
              status: "Appointments available"
            }
          ]
        })
      };
    };

    const res = await api.getDoctors("bengaluru");
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].id, "dr-priya");
    assert.equal(res.data[0].name, "Dr. Priya Sharma");
    assert.equal(res.data[0].specialty, "Cardiology");
  });

  test("GET /api/doctors supports specialty filtering and query search parameters", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/doctors?city=bengaluru&specialty=Cardiology&query=Priya"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 1 doctors in bengaluru.",
          data: [
            {
              id: "dr-priya",
              cityId: "bengaluru",
              hospitalId: "district-general",
              name: "Dr. Priya Sharma",
              specialty: "Cardiology",
              qualification: "MBBS, MD (Med), DM (Cardiology)",
              department: "Cardiology & Cardiac Care",
              workingHours: "09:00 AM – 01:30 PM",
              distanceKm: 2.4,
              status: "Appointments available"
            }
          ]
        })
      };
    };

    const res = await api.getDoctors("bengaluru", { specialty: "Cardiology", query: "Priya" });
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].specialty, "Cardiology");
  });

  test("GET /api/doctors handles empty results for unonboarded cities", async () => {
    global.fetch = async (url) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 0 doctors in hubballi.",
          data: []
        })
      };
    };

    const res = await api.getDoctors("hubballi");
    assert.equal(res.success, true);
    assert.deepEqual(res.data, []);
  });

  test("GET /api/doctors handles backend offline network failure gracefully", async () => {
    global.fetch = async () => {
      throw new Error("connect ECONNREFUSED 127.0.0.1:5000");
    };

    const res = await api.getDoctors("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.offline, true);
    assert.ok(res.error.includes("ECONNREFUSED"));
  });

  test("GET /api/doctors handles 500 server error cleanly", async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: "Doctor directory service temporary failure"
        })
      };
    };

    const res = await api.getDoctors("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.status, 500);
    assert.equal(res.error, "Doctor directory service temporary failure");
  });

  test("GET /api/blood-inventory successfully retrieves and parses blood stock listings", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/blood-inventory?city=bengaluru"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 5 blood stock listings in bengaluru.",
          data: [
            {
              id: "bld-1",
              group: "O+",
              cityId: "bengaluru",
              facility: "District General Hospital Blood Bank",
              location: "Central District, Bengaluru",
              phone: "+91 80 5550 0105",
              units: 14,
              status: "Available",
              updated: "12 minutes ago",
              compatible: ["O+", "A+", "B+", "AB+"]
            }
          ]
        })
      };
    };

    const res = await api.getBloodInventory("bengaluru");
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].group, "O+");
    assert.equal(res.data[0].units, 14);
    assert.equal(res.data[0].facility, "District General Hospital Blood Bank");
  });

  test("GET /api/blood-inventory filters by blood group", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("group=A%2B") || url.includes("group=A+"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 1 blood stock listings in bengaluru.",
          data: [
            {
              id: "bld-2",
              group: "A+",
              cityId: "bengaluru",
              facility: "City Medical Centre Blood Bank",
              location: "North District, Bengaluru",
              phone: "+91 80 5550 0205",
              units: 3,
              status: "Limited",
              updated: "25 minutes ago",
              compatible: ["A+", "AB+"]
            }
          ]
        })
      };
    };

    const res = await api.getBloodInventory("bengaluru", "A+");
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].group, "A+");
    assert.equal(res.data[0].units, 3);
  });

  test("GET /api/blood-inventory handles empty results for unonboarded cities", async () => {
    global.fetch = async (url) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 0 blood stock listings in mangaluru.",
          data: []
        })
      };
    };

    const res = await api.getBloodInventory("mangaluru");
    assert.equal(res.success, true);
    assert.deepEqual(res.data, []);
  });

  test("GET /api/blood-inventory handles backend offline network failure gracefully", async () => {
    global.fetch = async () => {
      throw new Error("connect ECONNREFUSED 127.0.0.1:5000");
    };

    const res = await api.getBloodInventory("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.offline, true);
    assert.ok(res.error.includes("ECONNREFUSED"));
  });

  test("GET /api/blood-inventory handles 500 server error cleanly", async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: "Blood inventory service temporary failure"
        })
      };
    };

    const res = await api.getBloodInventory("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.status, 500);
    assert.equal(res.error, "Blood inventory service temporary failure");
  });

  test("GET /api/medicines successfully retrieves and parses medicine inventory", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/medicines?city=bengaluru"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 4 medicines in bengaluru.",
          data: [
            {
              id: "med-paracetamol",
              cityId: "bengaluru",
              name: "Paracetamol",
              strength: "650 mg",
              dosageForm: "Tablet",
              availability: "Available",
              quantity: "140 strips",
              provider: "District General Hospital Pharmacy",
              providerType: "Hospital pharmacy",
              location: "District General Hospital, Central Wing",
              distanceKm: 2.4,
              updated: "10 mins ago"
            }
          ]
        })
      };
    };

    const res = await api.getMedicines("bengaluru");
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].id, "med-paracetamol");
    assert.equal(res.data[0].name, "Paracetamol");
    assert.equal(res.data[0].strength, "650 mg");
    assert.equal(res.data[0].availability, "Available");
    assert.equal(res.data[0].provider, "District General Hospital Pharmacy");
  });

  test("GET /api/medicines supports query search and provider filtering", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("query=Amoxicillin"));
      assert.ok(url.includes("providerType=Retail+pharmacy") || url.includes("providerType=Retail%20pharmacy"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 1 medicines in bengaluru.",
          data: [
            {
              id: "med-amoxicillin",
              cityId: "bengaluru",
              name: "Amoxicillin",
              strength: "500 mg",
              dosageForm: "Capsule",
              availability: "Available",
              quantity: "60 strips",
              provider: "Jan Aushadhi Kendra - Indiranagar",
              providerType: "Retail pharmacy",
              location: "Indiranagar 100ft Road, Bengaluru",
              distanceKm: 3.8,
              updated: "25 mins ago"
            }
          ]
        })
      };
    };

    const res = await api.getMedicines("bengaluru", { query: "Amoxicillin", providerType: "Retail pharmacy" });
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].name, "Amoxicillin");
    assert.equal(res.data[0].providerType, "Retail pharmacy");
  });

  test("GET /api/medicines handles empty results for unonboarded cities", async () => {
    global.fetch = async (url) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Found 0 medicines in mangaluru.",
          data: []
        })
      };
    };

    const res = await api.getMedicines("mangaluru");
    assert.equal(res.success, true);
    assert.deepEqual(res.data, []);
  });

  test("GET /api/medicines handles backend offline network failure gracefully", async () => {
    global.fetch = async () => {
      throw new Error("connect ECONNREFUSED 127.0.0.1:5000");
    };

    const res = await api.getMedicines("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.offline, true);
    assert.ok(res.error.includes("ECONNREFUSED"));
  });

  test("GET /api/medicines handles 500 server error cleanly", async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: "Medicine inventory service temporary failure"
        })
      };
    };

    const res = await api.getMedicines("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.status, 500);
    assert.equal(res.error, "Medicine inventory service temporary failure");
  });

  /* =================================================================
   * 6. AMBULANCE SERVICES & EMERGENCY DISPATCH TESTS (PHASE 7)
   * ================================================================= */
  test("GET /api/ambulances successfully retrieves and parses ambulance fleet records", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/ambulances?city=bengaluru"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 3 ambulance units in bengaluru.",
          data: [
            {
              id: "KA-01-AB-1234",
              cityId: "bengaluru",
              provider: "Karnataka 108 Emergency Network",
              phone: "+91 80 2200 1080",
              type: "ADVANCED_LIFE_SUPPORT",
              distanceKm: 1.8,
              etaMinutes: 6,
              status: "AVAILABLE"
            }
          ]
        })
      };
    };

    const res = await api.getAmbulances("bengaluru");
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].id, "KA-01-AB-1234");
    assert.equal(res.data[0].provider, "Karnataka 108 Emergency Network");
    assert.equal(res.data[0].type, "ADVANCED_LIFE_SUPPORT");
    assert.equal(res.data[0].distanceKm, 1.8);
    assert.equal(res.data[0].etaMinutes, 6);
    assert.equal(res.data[0].status, "AVAILABLE");
  });

  test("GET /api/ambulances supports city and type filtering", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("city=bengaluru"));
      assert.ok(url.includes("type=ADVANCED_LIFE_SUPPORT"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 1 ambulance units in bengaluru.",
          data: [
            {
              id: "KA-01-AB-1234",
              cityId: "bengaluru",
              provider: "Karnataka 108 Emergency Network",
              phone: "+91 80 2200 1080",
              type: "ADVANCED_LIFE_SUPPORT",
              distanceKm: 1.8,
              etaMinutes: 6,
              status: "AVAILABLE"
            }
          ]
        })
      };
    };

    const res = await api.getAmbulances("bengaluru", { type: "ADVANCED_LIFE_SUPPORT" });
    assert.equal(res.success, true);
    assert.equal(res.data.length, 1);
    assert.equal(res.data[0].type, "ADVANCED_LIFE_SUPPORT");
  });

  test("GET /api/ambulances supports availability status filtering", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("status=AVAILABLE"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 1 available ambulance units.",
          data: [
            {
              id: "KA-01-AB-1234",
              cityId: "bengaluru",
              provider: "Karnataka 108 Emergency Network",
              phone: "+91 80 2200 1080",
              type: "ADVANCED_LIFE_SUPPORT",
              distanceKm: 1.8,
              etaMinutes: 6,
              status: "AVAILABLE"
            }
          ]
        })
      };
    };

    const res = await api.getAmbulances("bengaluru", { status: "AVAILABLE" });
    assert.equal(res.success, true);
    assert.equal(res.data[0].status, "AVAILABLE");
  });

  test("GET /api/ambulances handles empty fleet response for unonboarded cities", async () => {
    global.fetch = async (url) => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Retrieved 0 ambulance units in shivamogga.",
          data: []
        })
      };
    };

    const res = await api.getAmbulances("shivamogga");
    assert.equal(res.success, true);
    assert.deepEqual(res.data, []);
  });

  test("GET /api/ambulances handles backend offline network failure gracefully", async () => {
    global.fetch = async () => {
      throw new Error("connect ECONNREFUSED 127.0.0.1:5000");
    };

    const res = await api.getAmbulances("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.offline, true);
    assert.ok(res.error.includes("ECONNREFUSED"));
  });

  test("GET /api/ambulances handles 500 server error cleanly", async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: "Ambulance dispatch fleet registry failure"
        })
      };
    };

    const res = await api.getAmbulances("bengaluru");
    assert.equal(res.success, false);
    assert.equal(res.status, 500);
    assert.equal(res.error, "Ambulance dispatch fleet registry failure");
  });

  test("POST /api/ambulance-requests successfully submits emergency dispatch request", async () => {
    let capturedBody = null;
    let capturedMethod = null;

    global.fetch = async (url, options) => {
      assert.ok(url.includes("/api/ambulance-requests"));
      capturedMethod = options.method;
      capturedBody = JSON.parse(options.body);

      return {
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          message: "Emergency ambulance dispatch order transmitted to response fleet.",
          data: {
            id: "disp-1795098988235",
            patientName: capturedBody.patientName,
            pickup: capturedBody.pickup,
            emergencyType: capturedBody.emergencyType,
            contact: capturedBody.contact,
            destination: capturedBody.destination,
            ambulance: {
              id: "KA-01-AB-1234",
              provider: "Karnataka 108 Emergency Network",
              phone: "+91 80 2200 1080",
              type: "ADVANCED_LIFE_SUPPORT",
              etaMinutes: 6
            },
            status: "DISPATCHED",
            requestedAt: new Date().toISOString()
          }
        })
      };
    };

    const dispatchPayload = {
      pickup: "Indiranagar 100ft Road, Bengaluru",
      emergencyType: "Cardiac / chest pain",
      destination: "District General Hospital",
      patientName: "Rahul Verma",
      contact: "+91 98450 12345",
      notes: "Severe chest pressure, conscious"
    };

    const res = await api.requestAmbulance(dispatchPayload);
    assert.equal(capturedMethod, "POST");
    assert.equal(capturedBody.pickup, "Indiranagar 100ft Road, Bengaluru");
    assert.equal(res.success, true);
    assert.equal(res.status, 201);
    assert.equal(res.data.id, "disp-1795098988235");
    assert.equal(res.data.status, "DISPATCHED");
    assert.equal(res.data.ambulance.id, "KA-01-AB-1234");
    assert.equal(res.data.ambulance.etaMinutes, 6);
  });

  test("POST /api/ambulance-requests handles validation failure (400) for missing required fields", async () => {
    global.fetch = async () => {
      return {
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: "pickup address and contact phone number are required."
        })
      };
    };

    const res = await api.requestAmbulance({ pickup: "", contact: "" });
    assert.equal(res.success, false);
    assert.equal(res.status, 400);
    assert.equal(res.error, "pickup address and contact phone number are required.");
  });

  test("POST /api/ambulance-requests handles network offline failure without false confirmation", async () => {
    global.fetch = async () => {
      throw new Error("connect ECONNREFUSED 127.0.0.1:5000");
    };

    const res = await api.requestAmbulance({
      pickup: "Central Bengaluru",
      contact: "+91 98450 00000"
    });

    assert.equal(res.success, false);
    assert.equal(res.offline, true);
    assert.ok(res.error.includes("ECONNREFUSED"));
  });

  test("GET /api/ambulance-requests/:id/tracking retrieves active dispatch tracking status", async () => {
    global.fetch = async (url) => {
      assert.ok(url.includes("/api/ambulance-requests/disp-1795098988235/tracking"));
      return {
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Active dispatch tracking status retrieved.",
          data: {
            id: "disp-1795098988235",
            status: "DISPATCHED",
            ambulance: {
              id: "KA-01-AB-1234",
              provider: "Karnataka 108 Emergency Network",
              etaMinutes: 4
            }
          }
        })
      };
    };

    const res = await api.getAmbulanceTracking("disp-1795098988235");
    assert.equal(res.success, true);
    assert.equal(res.data.id, "disp-1795098988235");
    assert.equal(res.data.status, "DISPATCHED");
    assert.equal(res.data.ambulance.etaMinutes, 4);
  });
});
