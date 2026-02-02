const express = require("express");
const PredictionService = require("../services/predictionService");

const router = express.Router();

/**
 * GET /api/predictions
 * Get risk predictions for all zones
 */
router.get("/predictions", async (req, res) => {
  try {
    const predictions = await PredictionService.getRiskPredictions();

    res.json({
      success: true,
      data: predictions,
      message: "Risk predictions retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch predictions",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts
 * Get early alerts for high-risk situations
 */
router.get("/alerts", async (req, res) => {
  try {
    const alerts = await PredictionService.getEarlyAlerts();

    res.json({
      success: true,
      data: alerts,
      message: "Early alerts retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
});

module.exports = router;
