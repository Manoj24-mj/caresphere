const { success, error } = require("../utils/response");
const { recordAudit } = require("../middleware/audit");
const store = require("../services/store");

/**
 * Get Patient Private Medical Vault (Private by default)
 * GET /api/medical-records/me
 */
async function getMyRecords(req, res, next) {
  try {
    const userId = req.user.id;
    let records = store.medicalRecords[userId];

    if (!records) {
      // Initialize empty private vault for new user
      records = {
        profile: {
          bloodGroup: "O+",
          allergies: "None reported",
          chronicConditions: "None reported",
          emergencyContactName: "Not assigned",
          emergencyContactPhone: req.user.mobile
        },
        diagnoses: [],
        prescriptions: [],
        labReports: [],
        documents: [],
        accessPass: { code: null, expiresAt: null, active: false }
      };
      store.medicalRecords[userId] = records;
    }

    await recordAudit(userId, "VIEW_OWN_MEDICAL_RECORDS", "MEDICAL_VAULT", userId, req);

    return success(res, records, "Medical records vault retrieved.");
  } catch (err) {
    next(err);
  }
}

/**
 * Upload Medical Document Metadata
 * POST /api/medical-records/documents
 */
async function uploadDocument(req, res, next) {
  try {
    const userId = req.user.id;
    const { title, category = "Lab Report", fileSize = "350 KB" } = req.body;

    if (!title) {
      return error(res, "title is required.", 400);
    }

    if (!store.medicalRecords[userId]) {
      store.medicalRecords[userId] = { documents: [] };
    }

    const doc = {
      id: `doc-${Date.now()}`,
      name: title,
      category,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      size: fileSize,
      access: "Protected"
    };

    if (!store.medicalRecords[userId].documents) {
      store.medicalRecords[userId].documents = [];
    }
    store.medicalRecords[userId].documents.unshift(doc);

    await recordAudit(userId, "UPLOAD_MEDICAL_DOCUMENT", "DOCUMENT", doc.id, req, { title, category });

    return success(res, doc, "Document registered in encrypted health vault.", 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Generate 6-Digit Temporary Clinician Access Pass
 * POST /api/medical-records/access-pass/generate
 */
async function generateAccessPass(req, res, next) {
  try {
    const userId = req.user.id;
    const code = `CS-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    if (!store.medicalRecords[userId]) {
      store.medicalRecords[userId] = {};
    }

    store.medicalRecords[userId].accessPass = {
      code,
      expiresAt,
      active: true
    };

    await recordAudit(userId, "GENERATE_DOCTOR_ACCESS_PASS", "ACCESS_PASS", code, req, { expiresAt });

    return success(res, {
      passCode: code,
      expiresAt,
      durationMinutes: 15
    }, "Temporary clinician access pass generated. Share this code with your doctor.");
  } catch (err) {
    next(err);
  }
}

/**
 * Doctor Verifies Access Pass to Access Patient Records
 * POST /api/medical-records/access-pass/verify
 */
async function verifyAccessPass(req, res, next) {
  try {
    const { passCode } = req.body;

    if (!passCode) {
      return error(res, "passCode is required.", 400);
    }

    // Find the patient whose access pass matches
    let matchedPatientId = null;
    let matchedRecords = null;

    Object.entries(store.medicalRecords).forEach(([patientId, recs]) => {
      if (recs.accessPass && recs.accessPass.code === passCode && recs.accessPass.active) {
        if (new Date(recs.accessPass.expiresAt) > new Date()) {
          matchedPatientId = patientId;
          matchedRecords = recs;
        }
      }
    });

    if (!matchedPatientId) {
      return error(res, "Invalid or expired clinician access pass.", 403);
    }

    const patientUser = store.users.find(u => u.id === matchedPatientId);

    await recordAudit(req.user?.id, "DOCTOR_REDEEM_ACCESS_PASS", "MEDICAL_VAULT", matchedPatientId, req, { passCode });

    return success(res, {
      patient: {
        id: matchedPatientId,
        name: patientUser?.profile?.fullName || "Verified Patient",
        gender: patientUser?.profile?.gender,
        age: patientUser?.profile?.dateOfBirth
      },
      records: matchedRecords
    }, "Clinician access pass verified. Patient health vault unlocked.");
  } catch (err) {
    next(err);
  }
}

/**
 * Revoke Clinician Access Pass
 * POST /api/medical-records/access-pass/revoke
 */
async function revokeAccessPass(req, res, next) {
  try {
    const userId = req.user.id;

    if (store.medicalRecords[userId]?.accessPass) {
      store.medicalRecords[userId].accessPass.active = false;
      store.medicalRecords[userId].accessPass.code = null;
    }

    await recordAudit(userId, "REVOKE_DOCTOR_ACCESS_PASS", "ACCESS_PASS", userId, req);

    return success(res, null, "Doctor access pass revoked. Vault secured.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyRecords,
  uploadDocument,
  generateAccessPass,
  verifyAccessPass,
  revokeAccessPass
};
