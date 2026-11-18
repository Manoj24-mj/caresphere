const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate, optionalAuth } = require("../middleware/auth");

router.post("/", optionalAuth, appointmentController.requestAppointment);
router.get("/my", authenticate, appointmentController.getMyAppointments);

module.exports = router;
