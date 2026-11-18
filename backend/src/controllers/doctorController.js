const { success, error } = require("../utils/response");
const store = require("../services/store");

/**
 * List Doctors with Specialty and City Filtering
 * GET /api/doctors?city=bengaluru&specialty=Cardiology
 */
async function getDoctors(req, res, next) {
  try {
    const { city = "bengaluru", specialty = "All", query } = req.query;

    let doctors = store.doctors.filter(d => d.cityId.toLowerCase() === String(city).toLowerCase());

    if (specialty && specialty !== "All") {
      doctors = doctors.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }

    if (query) {
      const q = query.toLowerCase();
      doctors = doctors.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
      );
    }

    return success(res, doctors, `Found ${doctors.length} doctors in ${city}.`);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Doctor Details
 * GET /api/doctors/:id
 */
async function getDoctorById(req, res, next) {
  try {
    const { id } = req.params;
    const doctor = store.doctors.find(d => d.id.toLowerCase() === id.toLowerCase());
    if (!doctor) {
      return error(res, `Doctor '${id}' not found.`, 404);
    }

    const hospital = store.hospitals.find(h => h.id === doctor.hospitalId);

    return success(res, {
      ...doctor,
      hospital: hospital ? { id: hospital.id, name: hospital.name, address: hospital.address, phone: hospital.phone } : null
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDoctors,
  getDoctorById
};
