const { success } = require("../utils/response");
const store = require("../services/store");

/**
 * Get Patient Active Prescriptions
 * GET /api/prescriptions
 */
async function getMyPrescriptions(req, res, next) {
  try {
    const userId = req.user.id;
    const userVault = store.medicalRecords[userId];
    const prescriptions = userVault?.prescriptions || [];
    return success(res, prescriptions, `Retrieved ${prescriptions.length} prescriptions.`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyPrescriptions
};
