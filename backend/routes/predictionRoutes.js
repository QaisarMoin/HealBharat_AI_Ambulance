const express = require("express");
const PredictionService = require("../services/predictionService");
const mockDataService = require("../services/mockDataService");

const router = express.Router();

/**
 * GET /api/predictions
 * Get risk predictions for all zones
 */
router.get("/", async (req, res) => {
  try {
    const predictions = await PredictionService.getRiskPredictions();

    res.json({
      success: true,
      data: predictions,
      message: "Risk predictions retrieved successfully",
    });
  } catch (error) {
    console.warn("Falling back to mock data for predictions:", error.message);
    try {
      // Generate mock predictions
      const predictions = [
        {
          zone: "North",
          overallRisk: "Low",
          factors: ["Low patient load", "Good weather"],
          confidence: 0.85,
          timestamp: new Date().toISOString(),
        },
        {
          zone: "South",
          overallRisk: "High",
          factors: ["High patient load", "Traffic congestion"],
          confidence: 0.92,
          timestamp: new Date().toISOString(),
        },
        {
          zone: "East",
          overallRisk: "Medium",
          factors: ["Moderate patient load", "Rush hour"],
          confidence: 0.78,
          timestamp: new Date().toISOString(),
        },
      ];
      res.json({
        success: true,
        data: predictions,
        fallback: true,
        message: "Risk predictions retrieved from mock data",
      });
    } catch (mockError) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch predictions",
        error: mockError.message,
      });
    }
  }
});

/**
 * GET /api/alerts
 * Get early alerts for high-risk situations
 */
router.get("/", async (req, res) => {
  try {
    const alerts = await PredictionService.getEarlyAlerts();

    res.json({
      success: true,
      data: alerts,
      message: "Early alerts retrieved successfully",
    });
  } catch (error) {
    console.warn("Falling back to mock data for alerts:", error.message);
    try {
      // Generate mock alerts
      const alerts = [
        {
          id: "alert-1",
          type: "High Risk Zone",
          severity: "High",
          zone: "South",
          description: "High patient load detected in South zone hospitals",
          confidence: 0.88,
          timestamp: new Date().toISOString(),
          status: "active",
        },
        {
          id: "alert-2",
          type: "Traffic Congestion",
          severity: "Medium",
          zone: "East",
          description: "Traffic congestion may affect ambulance response times",
          confidence: 0.75,
          timestamp: new Date().toISOString(),
          status: "active",
        },
      ];
      res.json({
        success: true,
        data: alerts,
        fallback: true,
        message: "Early alerts retrieved from mock data",
      });
    } catch (mockError) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch alerts",
        error: mockError.message,
      });
    }
  }
});

module.exports = router;
