const { success, error } = require("../utils/response");
const store = require("../services/store");

/**
 * List all cities
 * GET /api/cities
 */
async function getCities(req, res, next) {
  try {
    const { status } = req.query;
    let list = store.cities;
    if (status) {
      list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    // Attach real-time resource summary counts
    const enriched = list.map(city => {
      const hospitalCount = store.hospitals.filter(h => h.cityId === city.id).length;
      const bedCount = store.hospitals
        .filter(h => h.cityId === city.id)
        .reduce((sum, h) => sum + Object.values(h.beds || {}).reduce((bSum, b) => bSum + (b[0] || 0), 0), 0);
      const doctorCount = store.doctors.filter(d => d.cityId === city.id).length;
      const ambulanceCount = store.ambulances.filter(a => a.cityId === city.id).length;

      return {
        ...city,
        hospitalCount,
        bedCount,
        doctorCount,
        ambulanceCount
      };
    });

    return success(res, enriched, "Cities retrieved successfully.");
  } catch (err) {
    next(err);
  }
}

/**
 * Get City by ID with Resource Summary
 * GET /api/cities/:cityId
 */
async function getCityById(req, res, next) {
  try {
    const { cityId } = req.params;
    const city = store.cities.find(c => c.id.toLowerCase() === cityId.toLowerCase());
    if (!city) {
      return error(res, `City with ID '${cityId}' is not registered in CareSphere.`, 404);
    }

    const hospitalCount = store.hospitals.filter(h => h.cityId === city.id).length;
    const doctorCount = store.doctors.filter(d => d.cityId === city.id).length;
    const ambulanceCount = store.ambulances.filter(a => a.cityId === city.id).length;

    return success(res, {
      ...city,
      summary: {
        hospitalCount,
        doctorCount,
        ambulanceCount,
        activeNode: city.status === "active"
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCities,
  getCityById
};
