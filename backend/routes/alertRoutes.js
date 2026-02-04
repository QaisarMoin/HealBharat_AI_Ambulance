const express = require("express");
const PredictionService = require("../services/predictionService");
const AlertService = require("../services/alertService");
const { validateAlertParams } = require("../middleware/validation");

const router = express.Router();

/**
 * GET /api/alerts
 * Get current alerts for all zones
 */
router.get("/", async (req, res) => {
  try {
    const alerts = await AlertService.getCurrentAlerts();

    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      message: "Current alerts retrieved successfully",
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

/**
 * GET /api/alerts/active
 * Get only active alerts
 */
router.get("/active", async (req, res) => {
  try {
    const alerts = await AlertService.getActiveAlerts();

    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
      message: "Active alerts retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching active alerts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active alerts",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/zone/:zone
 * Get alerts for a specific zone
 */
router.get("/zone/:zone", validateAlertParams, async (req, res) => {
  try {
    const { zone } = req.params;
    const alerts = await AlertService.getAlertsByZone(zone);

    res.json({
      success: true,
      data: alerts,
      zone: zone,
      count: alerts.length,
      message: `Alerts for ${zone} zone retrieved successfully`,
    });
  } catch (error) {
    console.error("Error fetching zone alerts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch zone alerts",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/types
 * Get all alert types and their counts
 */
router.get("/types", async (req, res) => {
  try {
    const alertTypes = await AlertService.getAlertTypes();

    res.json({
      success: true,
      data: alertTypes,
      message: "Alert types retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching alert types:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert types",
      error: error.message,
    });
  }
});

/**
 * POST /api/alerts/acknowledge
 * Acknowledge an alert
 */
router.post("/acknowledge", async (req, res) => {
  try {
    const { alertId, acknowledgedBy } = req.body;

    if (!alertId) {
      return res.status(400).json({
        success: false,
        message: "Alert ID is required",
      });
    }

    const result = await AlertService.acknowledgeAlert(alertId, acknowledgedBy);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      data: result,
      message: "Alert acknowledged successfully",
    });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    res.status(500).json({
      success: false,
      message: "Failed to acknowledge alert",
      error: error.message,
    });
  }
});

/**
 * GET /api/alerts/history
 * Get alert history with optional filters
 */
router.get("/history", async (req, res) => {
  try {
    const { startDate, endDate, zone, type, severity, limit = 100 } = req.query;

    const filters = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      zone,
      type,
      severity,
      limit: parseInt(limit),
    };

    const history = await AlertService.getAlertHistory(filters);

    res.json({
      success: true,
      data: history,
      filters,
      message: "Alert history retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching alert history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert history",
      error: error.message,
    });
  }
});

module.exports = router;
