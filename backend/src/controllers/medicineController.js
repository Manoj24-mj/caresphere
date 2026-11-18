const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

/**
 * Search Essential Medicines
 * GET /api/medicines?city=bengaluru&query=Paracetamol
 */
async function getMedicines(req, res, next) {
  try {
    const { city = "bengaluru", query, availability, providerType } = req.query;

    let items = store.medicines.filter(m => m.cityId.toLowerCase() === String(city).toLowerCase());

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.strength.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q)
      );
    }

    if (availability && availability !== "All") {
      items = items.filter(m => m.availability.toLowerCase() === availability.toLowerCase());
    }

    if (providerType && providerType !== "All") {
      items = items.filter(m => m.providerType.toLowerCase() === providerType.toLowerCase());
    }

    return success(res, items, `Retrieved ${items.length} medicines in ${city}.`);
  } catch (err) {
    next(err);
  }
}

/**
 * Update Medicine Inventory Stock (Pharmacy / Supplier Staff Only)
 * PATCH /api/medicine-inventory/update
 */
async function updateMedicineInventory(req, res, next) {
  try {
    const { id, availability, quantity } = req.body;

    if (!id) {
      return error(res, "id is required.", 400);
    }

    const item = store.medicines.find(m => m.id === id);
    if (!item) {
      return error(res, `Medicine inventory '${id}' not found.`, 404);
    }

    if (availability) item.availability = availability;
    if (quantity) item.quantity = quantity;
    item.updated = "Just now (Pharmacy verified)";

    await recordAudit(req.user?.id, "UPDATE_MEDICINE_STOCK", "MEDICINE_INVENTORY", item.id, req, { availability, quantity });

    return success(res, item, "Medicine inventory updated successfully.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMedicines,
  updateMedicineInventory
};
