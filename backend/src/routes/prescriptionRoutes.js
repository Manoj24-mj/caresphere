const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const { authenticate } = require("../middleware/auth");

router.get("/my", authenticate, prescriptionController.getMyPrescriptions);
router.get("/", authenticate, prescriptionController.getMyPrescriptions);

module.exports = router;
