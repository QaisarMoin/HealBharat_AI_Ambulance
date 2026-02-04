const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

// Import mock data service for testing when MongoDB is not available
const mockDataService = require("./services/mockDataService");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/predictions", require("./routes/predictionRoutes"));
app.use("/api/alerts", require("./routes/alertRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/data", require("./routes/dataRoutes"));

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
