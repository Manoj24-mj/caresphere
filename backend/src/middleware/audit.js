const { prisma, isDbConnected } = require("../config/database");

/**
 * Logs sensitive operations to database audit table or console fallback
 */
async function recordAudit(userId, action, resourceType, resourceId, req, details = null) {
  const auditData = {
    userId: userId || null,
    action,
    resourceType,
    resourceId: String(resourceId || ""),
    ipAddress: req?.ip || req?.socket?.remoteAddress || "127.0.0.1",
    userAgent: req?.headers ? req.headers["user-agent"] : "CareSphere Client",
    details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : null
  };

  if (isDbConnected() && prisma?.auditLog) {
    try {
      await prisma.auditLog.create({ data: auditData });
      return;
    } catch (err) {
      console.warn("⚠️ [Audit Log DB Write Failed]:", err.message);
    }
  }

  // Fallback console log for audit trail
  console.log(`📋 [AUDIT LOG] [${new Date().toISOString()}] Action: ${action} | User: ${userId || "ANONYMOUS"} | Resource: ${resourceType}:${resourceId}`);
}

module.exports = {
  recordAudit
};
