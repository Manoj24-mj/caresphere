const express = require("express");
const router = express.Router();
const bloodBankController = require("../controllers/bloodBankController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/inventory", bloodBankController.getBloodInventory);
router.get("/", bloodBankController.getBloodInventory);
router.patch("/inventory/update", authenticate, authorizeRoles("BLOOD_BANK_ADMIN", "BLOOD_BANK_STAFF", "HOSPITAL_ADMIN", "HOSPITAL_STAFF", "SYSTEM_ADMIN", "ADMINISTRATOR"), bloodBankController.updateBloodInventory);
router.patch("/update", authenticate, authorizeRoles("BLOOD_BANK_ADMIN", "BLOOD_BANK_STAFF", "HOSPITAL_ADMIN", "HOSPITAL_STAFF", "SYSTEM_ADMIN", "ADMINISTRATOR"), bloodBankController.updateBloodInventory);

module.exports = router;
