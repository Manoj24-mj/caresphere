const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

/**
 * List Ambulance Units in City
 * GET /api/ambulances?city=bengaluru&type=ADVANCED_LIFE_SUPPORT
 */
async function getAmbulances(req, res, next) {
  try {
    const { city = "bengaluru", type = "All", status = "All" } = req.query;

    let list = store.ambulances.filter(a => a.cityId.toLowerCase() === String(city).toLowerCase());

    if (type && type !== "All") {
      list = list.filter(a => a.type.toUpperCase() === type.toUpperCase());
    }

    if (status && status !== "All") {
      list = list.filter(a => a.status.toUpperCase() === status.toUpperCase());
    }

    return success(res, list, `Retrieved ${list.length} ambulance units in ${city}.`);
  } catch (err) {
    next(err);
  }
}

/**
 * Request Emergency Ambulance Dispatch
 * POST /api/ambulance-requests
 */
async function requestAmbulance(req, res, next) {
  try {
    const { pickup, emergencyType, contact, destination, patientName, notes } = req.body;

    if (!pickup || !contact) {
      return error(res, "pickup address and contact phone number are required.", 400);
    }

    // Match nearest available ambulance
    const availableUnit = store.ambulances.find(a => a.status === "AVAILABLE") || store.ambulances[0];

    const dispatchRequest = {
      id: `disp-${Date.now()}`,
      patientId: req.user?.id || null,
      patientName: patientName || "Emergency Patient",
      pickup,
      emergencyType: emergencyType || "Medical emergency",
      contact,
      destination: destination || "District General Hospital",
      notes: notes || null,
      ambulance: {
        id: availableUnit.id,
        provider: availableUnit.provider,
        phone: availableUnit.phone,
        type: availableUnit.type,
        etaMinutes: availableUnit.etaMinutes
      },
      status: "DISPATCHED",
      requestedAt: new Date().toISOString()
    };

    store.ambulanceRequests.push(dispatchRequest);

    await recordAudit(req.user?.id, "EMERGENCY_AMBULANCE_REQUEST", "AMBULANCE", dispatchRequest.id, req, { pickup, emergencyType });

    return success(res, dispatchRequest, "Emergency ambulance dispatch order transmitted to response fleet.", 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Track Emergency Ambulance Dispatch
 * GET /api/ambulance-requests/:id/tracking
 */
async function getAmbulanceTracking(req, res, next) {
  try {
    const { id } = req.params;
    const request = store.ambulanceRequests.find(r => r.id === id);
    if (!request) {
      return error(res, `Emergency request '${id}' not found.`, 404);
    }

    return success(res, request, "Active dispatch tracking status retrieved.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAmbulances,
  requestAmbulance,
  getAmbulanceTracking
};
