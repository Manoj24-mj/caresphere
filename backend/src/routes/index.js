const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const cityRoutes = require("./cityRoutes");
const hospitalRoutes = require("./hospitalRoutes");
const bedRoutes = require("./bedRoutes");
const doctorRoutes = require("./doctorRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const bloodBankRoutes = require("./bloodBankRoutes");
const medicineRoutes = require("./medicineRoutes");
const ambulanceRoutes = require("./ambulanceRoutes");
const medicalRecordRoutes = require("./medicalRecordRoutes");
const prescriptionRoutes = require("./prescriptionRoutes");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "CareSphere Government Healthcare Resource Management API",
    version: "1.0.0",
    activeNode: "bengaluru",
    timestamp: new Date().toISOString()
  });
});

// Mount domain routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cities", cityRoutes);
router.use("/hospitals", hospitalRoutes);
router.use("/beds", bedRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/blood-banks", bloodBankRoutes);
router.use("/blood-inventory", bloodBankRoutes);
router.use("/medicines", medicineRoutes);
router.use("/medicine-inventory", medicineRoutes);
router.use("/ambulances", ambulanceRoutes);
router.use("/ambulance-requests", ambulanceRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/prescriptions", prescriptionRoutes);

module.exports = router;
