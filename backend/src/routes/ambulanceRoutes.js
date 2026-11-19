const express = require("express");
const router = express.Router();
const ambulanceController = require("../controllers/ambulanceController");
const { optionalAuth } = require("../middleware/auth");

router.get("/", ambulanceController.getAmbulances);
router.post("/requests", optionalAuth, ambulanceController.requestAmbulance);
router.post("/", optionalAuth, ambulanceController.requestAmbulance);
router.get("/requests/:id/tracking", ambulanceController.getAmbulanceTracking);
router.get("/:id/tracking", ambulanceController.getAmbulanceTracking);

module.exports = router;
