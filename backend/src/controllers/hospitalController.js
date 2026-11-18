const { success, error } = require("../utils/response");
const store = require("../services/store");

/**
 * List Hospitals with City Filtering
 * GET /api/hospitals?city=bengaluru&facility=ICU&query=victoria
 */
async function getHospitals(req, res, next) {
  try {
    const { city = "bengaluru", facility, status, query } = req.query;

    let hospitals = store.hospitals.filter(h => h.cityId.toLowerCase() === String(city).toLowerCase());

    if (facility && facility !== "All") {
      hospitals = hospitals.filter(h => h.facilities.some(f => f.toLowerCase().includes(facility.toLowerCase())));
    }

    if (status && status !== "All") {
      hospitals = hospitals.filter(h => h.status.toLowerCase() === status.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase();
      hospitals = hospitals.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.locationArea.toLowerCase().includes(q)
      );
    }

    return success(res, hospitals, `Found ${hospitals.length} hospitals in ${city}.`);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Hospital Details
 * GET /api/hospitals/:id
 */
async function getHospitalById(req, res, next) {
  try {
    const { id } = req.params;
    const hospital = store.hospitals.find(h => h.id.toLowerCase() === id.toLowerCase());
    if (!hospital) {
      return error(res, `Hospital with ID '${id}' not found.`, 404);
    }

    // Attach connected doctors
    const doctors = store.doctors.filter(d => d.hospitalId === hospital.id);

    return success(res, {
      ...hospital,
      doctors
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHospitals,
  getHospitalById
};
