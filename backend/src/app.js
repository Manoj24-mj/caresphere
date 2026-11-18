const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false // Allows frontend SPA embedding and dev tools
}));

// Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root welcome
app.get("/", (req, res) => {
  res.json({
    platform: "CareSphere",
    tagline: "AI-Powered, City-Based Integrated Government Healthcare Resource Management and Assistance Platform",
    docs: "/api/health",
    activeNode: "Bengaluru",
    version: "1.0.0"
  });
});

// API Routes
app.use("/api", routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
