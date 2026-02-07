const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const { sanitizeInput, rateLimit } = require("./middleware/validation");

// Import mock data service for testing when MongoDB is not available
const mockDataService = require("./services/mockDataService");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:3000"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  }),
);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

// Rate limiting
app.use(rateLimit(100, 60000)); // 100 requests per minute

// Input sanitization
app.use(sanitizeInput);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Routes
app.use("/api/predictions", require("./routes/predictionRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/data", require("./routes/dataRoutes"));
app.use("/api/hospitals", require("./routes/hospitalRoutes"));
app.use("/api/ambulances", require("./routes/ambulanceRoutes"));
app.use("/api/incidents", require("./routes/incidentRoutes"));

// Test route
app.post("/api/test", (req, res) => {
  res.json({ success: true, message: "Test POST route working" });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Emergency Prediction System is running",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "AI Emergency Pressure & Ambulance Load Prediction System - Phase 2",
    version: "2.0.0",
    features: [
      "Modular Architecture",
      "Geospatial Awareness",
      "Time-Series Logic",
      "Real-time Alerts",
      "Emergency Dashboard",
    ],
    endpoints: {
      predictions: "/api/predictions",
      alerts: "/api/alerts",
      dashboard: "/api/dashboard",
      data: "/api/data",
      health: "/health",
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    availableEndpoints: [
      "/api/predictions",
      "/api/alerts",
      "/api/dashboard",
      "/api/data",
      "/health",
    ],
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API endpoints: http://localhost:${PORT}/api/`);
  logger.info(`Dashboard: http://localhost:${PORT}/dashboard`);
});
