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
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
      return callback(null, true);
    }
    // Permissive for local dev workflows
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
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
