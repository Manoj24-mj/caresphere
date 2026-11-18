const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

/**
 * Get City Bed Availability
 * GET /api/beds?city=bengaluru&type=ICU
 */
async function getBedAvailability(req, res, next) {
  try {
    const { city = "bengaluru", type = "All", availability = "All" } = req.query;

    const hospitals = store.hospitals.filter(h => h.cityId.toLowerCase() === String(city).toLowerCase());

    const bedRecords = [];

    hospitals.forEach(h => {
      Object.entries(h.beds || {}).forEach(([cat, [avail, total]]) => {
        if (type !== "All" && cat.toLowerCase() !== type.toLowerCase()) return;

        const occupancyPercent = total > 0 ? Math.round(((total - avail) / total) * 100) : 100;
        const status = avail === 0 ? "Unavailable" : avail <= 3 ? "Limited" : "Available";

        if (availability !== "All" && status.toLowerCase() !== availability.toLowerCase()) return;

        bedRecords.push({
          hospitalId: h.id,
          hospitalName: h.name,
          category: cat,
          available: avail,
          total,
          occupied: total - avail,
          occupancyPercent,
          status,
          distanceKm: h.distanceKm,
          phone: h.phone,
          lastUpdated: h.updated
        });
      });
    });

    return success(res, bedRecords, `Retrieved ${bedRecords.length} bed category listings for ${city}.`);
  } catch (err) {
    next(err);
  }
}

/**
 * Update Hospital Bed Availability (Staff Only)
 * PATCH /api/beds/update
 */
async function updateBedAvailability(req, res, next) {
  try {
    const { hospitalId, beds } = req.body; // beds: { General: [available, total], ICU: [...] }

    if (!hospitalId || !beds) {
      return error(res, "hospitalId and beds object are required.", 400);
    }

    const hospital = store.hospitals.find(h => h.id.toLowerCase() === hospitalId.toLowerCase());
    if (!hospital) {
      return error(res, `Hospital '${hospitalId}' not found.`, 404);
    }

    Object.entries(beds).forEach(([cat, counts]) => {
      if (Array.isArray(counts) && counts.length >= 2) {
        hospital.beds[cat] = [Number(counts[0]), Number(counts[1])];
      }
    });

    hospital.updated = "Just now (Staff verified)";

    await recordAudit(req.user?.id, "UPDATE_BED_AVAILABILITY", "HOSPITAL_BEDS", hospitalId, req, beds);

    return success(res, {
      hospitalId: hospital.id,
      name: hospital.name,
      beds: hospital.beds,
      updated: hospital.updated
    }, "Hospital bed availability updated successfully.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBedAvailability,
  updateBedAvailability
};
