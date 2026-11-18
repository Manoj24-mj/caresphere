const express = require("express");
const router = express.Router();
const bedController = require("../controllers/bedController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

router.get("/availability", bedController.getBedAvailability);
router.get("/", bedController.getBedAvailability);
router.patch("/update", authenticate, authorizeRoles("HOSPITAL_STAFF", "ADMINISTRATOR"), bedController.updateBedAvailability);

module.exports = router;
