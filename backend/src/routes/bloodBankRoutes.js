const express = require("express");
const router = express.Router();
const bloodBankController = require("../controllers/bloodBankController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/inventory", bloodBankController.getBloodInventory);
router.get("/", bloodBankController.getBloodInventory);
router.patch("/inventory/update", authenticate, authorizeRoles("BLOOD_BANK_STAFF", "HOSPITAL_STAFF", "ADMINISTRATOR"), bloodBankController.updateBloodInventory);

module.exports = router;
