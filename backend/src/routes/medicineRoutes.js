const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/", medicineController.getMedicines);
router.get("/inventory", medicineController.getMedicines);
router.patch("/inventory/update", authenticate, authorizeRoles("SUPPLIER", "HOSPITAL_STAFF", "ADMINISTRATOR"), medicineController.updateMedicineInventory);

module.exports = router;
