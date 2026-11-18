/**
 * CareSphere Database Connection Configuration
 * Handles Prisma Client connection with resilient fallback and status diagnostics.
 */

let prismaInstance = null;
let isConnected = false;

try {
  const { PrismaClient } = require("@prisma/client");
  prismaInstance = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });
} catch (err) {
  console.warn("⚠️ [CareSphere Database] PrismaClient could not be initialized directly:", err.message);
}

/**
 * Verifies active database connection
 */
async function connectDatabase() {
  if (!prismaInstance) {
    console.warn("⚠️ [CareSphere Database] Prisma Client is not yet generated or installed.");
    return false;
  }

  try {
    // Attempt a lightweight probe query
    await prismaInstance.$queryRaw`SELECT 1`;
    isConnected = true;
    console.log("✅ [CareSphere Database] Successfully connected to PostgreSQL via Prisma ORM.");
    return true;
  } catch (error) {
    isConnected = false;
    console.warn("⚠️ [CareSphere Database] PostgreSQL database connection unavailable.");
    console.warn("   Details:", error.message.split("\n")[0]);
    console.warn("   CareSphere will run in API fallback mode. Configure DATABASE_URL in .env to enable persistence.");
    return false;
  }
}

/**
 * Disconnects from database gracefully
 */
async function disconnectDatabase() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    isConnected = false;
    console.log("🔌 [CareSphere Database] Disconnected from database.");
  }
}

function getPrisma() {
  return prismaInstance;
}

function isDbConnected() {
  return isConnected;
}

module.exports = {
  prisma: prismaInstance,
  getPrisma,
  connectDatabase,
  disconnectDatabase,
  isDbConnected
};
