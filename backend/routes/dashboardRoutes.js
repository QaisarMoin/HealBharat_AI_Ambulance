const express = require("express");
const DashboardService = require("../services/dashboardService");
const { validateDashboardParams } = require("../middleware/validation");
const mockDataService = require("../services/mockDataService");

const router = express.Router();

/**
 * GET /api/dashboard/summary
 * Get dashboard summary data
 */
router.get("/summary", async (req, res) => {
  try {
    const summary = await DashboardService.getDashboardSummary();

    res.json({
      success: true,
      data: summary,
      message: "Dashboard summary retrieved successfully",
    });
  } catch (error) {
    console.warn(
      "Falling back to mock data for dashboard summary:",
      error.message,
    );
    try {
      const summary = await mockDataService.getDashboardSummary();
      res.json({
        success: true,
        data: summary,
        fallback: true,
        message: "Dashboard summary retrieved from mock data",
      });
    } catch (mockError) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard summary",
        error: mockError.message,
      });
    }
  }
});

/**
 * GET /api/dashboard/zones
 * Get zone-wise data for dashboard
 */
router.get("/zones", async (req, res) => {
  try {
    const zonesData = await DashboardService.getZonesData();

    res.json({
      success: true,
      data: zonesData,
      message: "Zone data retrieved successfully",
    });
  } catch (error) {
    console.warn("Falling back to mock data for zones:", error.message);
    try {
      const zonesData = await mockDataService.getZonesData();
      res.json({
        success: true,
        data: zonesData,
        fallback: true,
        message: "Zone data retrieved from mock data",
      });
    } catch (mockError) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch zone data",
        error: mockError.message,
      });
    }
  }
});

/**
 * GET /api/dashboard/hospitals
 * Get hospital-wise data for dashboard
 */
router.get("/hospitals", async (req, res) => {
  try {
    const hospitalsData = await DashboardService.getHospitalsData();

    res.json({
      success: true,
      data: hospitalsData,
      message: "Hospital data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hospital data",
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard/trends
 * Get trend data for dashboard charts
 */
router.get("/trends", validateDashboardParams, async (req, res) => {
  try {
    const {
      timeRange = "24h",
      zone,
      hospitalId,
      metric = "pressure",
    } = req.query;

    const trends = await DashboardService.getTrends({
      timeRange,
      zone,
      hospitalId,
      metric,
    });

    res.json({
      success: true,
      data: trends,
      parameters: { timeRange, zone, hospitalId, metric },
      message: "Trend data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching trend data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trend data",
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard/realtime
 * Get real-time data for dashboard
 */
router.get("/realtime", async (req, res) => {
  try {
    const realtimeData = await DashboardService.getRealtimeData();

    res.json({
      success: true,
      data: realtimeData,
      timestamp: new Date().toISOString(),
      message: "Real-time data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch real-time data",
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard/stats
 * Get key statistics for dashboard
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await DashboardService.getStats();

    res.json({
      success: true,
      data: stats,
      message: "Statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard/map
 * Get map data for dashboard
 */
router.get("/map", async (req, res) => {
  try {
    const mapData = await DashboardService.getMapData();

    res.json({
      success: true,
      data: mapData,
      message: "Map data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching map data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch map data",
      error: error.message,
    });
  }
});

module.exports = router;
