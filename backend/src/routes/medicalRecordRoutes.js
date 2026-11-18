const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecordController");
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Private Patient Health Vault (Patient Only)
router.get("/me", authenticate, authorizeRoles("PATIENT", "ADMINISTRATOR"), medicalRecordController.getMyRecords);

// Document Upload
router.post("/documents", authenticate, authorizeRoles("PATIENT", "ADMINISTRATOR"), medicalRecordController.uploadDocument);

// Clinician 6-Digit Access Pass Flow
router.post("/access-pass/generate", authenticate, authorizeRoles("PATIENT", "ADMINISTRATOR"), medicalRecordController.generateAccessPass);
router.post("/access-pass/verify", authenticate, authorizeRoles("DOCTOR", "HOSPITAL_STAFF", "ADMINISTRATOR"), medicalRecordController.verifyAccessPass);
router.post("/access-pass/revoke", authenticate, authorizeRoles("PATIENT", "ADMINISTRATOR"), medicalRecordController.revokeAccessPass);

module.exports = router;
