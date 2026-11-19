const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/", medicineController.getMedicines);
router.get("/inventory", medicineController.getMedicines);
router.patch("/inventory/update", authenticate, authorizeRoles("PHARMACY_ADMIN", "SUPPLIER", "HOSPITAL_ADMIN", "HOSPITAL_STAFF", "SYSTEM_ADMIN", "ADMINISTRATOR"), medicineController.updateMedicineInventory);
router.patch("/update", authenticate, authorizeRoles("PHARMACY_ADMIN", "SUPPLIER", "HOSPITAL_ADMIN", "HOSPITAL_STAFF", "SYSTEM_ADMIN", "ADMINISTRATOR"), medicineController.updateMedicineInventory);

module.exports = router;
