const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

/**
 * Get City Blood Bank Stock
 * GET /api/blood-inventory?city=bengaluru&group=O+
 */
async function getBloodInventory(req, res, next) {
  try {
    const { city = "bengaluru", group = "All" } = req.query;

    let items = store.bloodStock.filter(b => b.cityId.toLowerCase() === String(city).toLowerCase());

    if (group && group !== "All") {
      const targetGroup = String(group).replace(/\s+/g, "+").trim().toUpperCase();
      items = items.filter(b => b.group.toUpperCase() === targetGroup || b.group.toUpperCase().startsWith(targetGroup));
    }

    return success(res, items, `Retrieved ${items.length} blood stock listings in ${city}.`);
  } catch (err) {
    next(err);
  }
}

/**
 * Update Blood Stock Units (Blood Bank Staff Only)
 * PATCH /api/blood-inventory/update
 */
async function updateBloodInventory(req, res, next) {
  try {
    const { id, units, status } = req.body;

    if (!id || units === undefined) {
      return error(res, "id and units are required.", 400);
    }

    const item = store.bloodStock.find(b => b.id === id || b.group === id);
    if (!item) {
      return error(res, `Blood inventory entry '${id}' not found.`, 404);
    }

    item.units = Number(units);
    item.status = status || (item.units === 0 ? "Unavailable" : item.units <= 3 ? "Limited" : "Available");
    item.updated = "Just now (Staff verified)";

    await recordAudit(req.user?.id, "UPDATE_BLOOD_STOCK", "BLOOD_INVENTORY", item.id, req, { units, status: item.status });

    return success(res, item, "Blood inventory stock updated successfully.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBloodInventory,
  updateBloodInventory
};
