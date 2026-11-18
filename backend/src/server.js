require("dotenv").config();
const app = require("./app");
const { connectDatabase, disconnectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log("==================================================");
  console.log("  🏥 CARESPHERE HEALTHCARE PLATFORM BACKEND");
  console.log("  AI-Powered, City-Based Government Healthcare Resource System");
  console.log("==================================================");

  // Attempt database connection
  await connectDatabase();

  const server = app.listen(PORT, () => {
    console.log(`🚀 [CareSphere Server] Running on http://localhost:${PORT}`);
    console.log(`📌 [Health Check]      http://localhost:${PORT}/api/health`);
    console.log(`🏙️  [Active City]       Bengaluru (Target Node)`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n🛑 [CareSphere Server] Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log("✅ [CareSphere Server] Shutdown complete.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  return server;
}

if (require.main === module) {
  startServer().catch(err => {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  });
}

module.exports = { startServer };
