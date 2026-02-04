const express = require("express");
const DataImportService = require("../services/dataImportService");
const { validateDataImport } = require("../middleware/validation");

const router = express.Router();

/**
 * POST /api/data/import/hospitals
 * Import hospital data
 */
router.post("/hospitals", validateDataImport, async (req, res) => {
  try {
    const { hospitals } = req.body;

    if (!Array.isArray(hospitals)) {
      return res.status(400).json({
        success: false,
        message: "Hospitals data must be an array",
      });
    }

    const result = await DataImportService.importHospitals(hospitals);

    res.json({
      success: true,
      data: result,
      message: `${result.imported} hospitals imported successfully`,
    });
  } catch (error) {
    console.error("Error importing hospitals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import hospitals",
      error: error.message,
    });
  }
});

/**
 * POST /api/data/import/ambulance-logs
 * Import ambulance log data
 */
router.post("/ambulance-logs", validateDataImport, async (req, res) => {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs)) {
      return res.status(400).json({
        success: false,
        message: "Ambulance logs data must be an array",
      });
    }

    const result = await DataImportService.importAmbulanceLogs(logs);

    res.json({
      success: true,
      data: result,
      message: `${result.imported} ambulance logs imported successfully`,
    });
  } catch (error) {
    console.error("Error importing ambulance logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import ambulance logs",
      error: error.message,
    });
  }
});

/**
 * POST /api/data/import/accidents
 * Import accident/incident data
 */
router.post("/accidents", validateDataImport, async (req, res) => {
  try {
    const { accidents } = req.body;

    if (!Array.isArray(accidents)) {
      return res.status(400).json({
        success: false,
        message: "Accident data must be an array",
      });
    }

    const result = await DataImportService.importAccidents(accidents);

    res.json({
      success: true,
      data: result,
      message: `${result.imported} accidents imported successfully`,
    });
  } catch (error) {
    console.error("Error importing accidents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import accidents",
      error: error.message,
    });
  }
});

/**
 * POST /api/data/import/weather
 * Import weather context data
 */
router.post("/weather", validateDataImport, async (req, res) => {
  try {
    const { weatherData } = req.body;

    if (!Array.isArray(weatherData)) {
      return res.status(400).json({
        success: false,
        message: "Weather data must be an array",
      });
    }

    const result = await DataImportService.importWeatherData(weatherData);

    res.json({
      success: true,
      data: result,
      message: `${result.imported} weather records imported successfully`,
    });
  } catch (error) {
    console.error("Error importing weather data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import weather data",
      error: error.message,
    });
  }
});

/**
 * POST /api/data/import/time-context
 * Import time context data
 */
router.post("/time-context", validateDataImport, async (req, res) => {
  try {
    const { timeData } = req.body;

    if (!Array.isArray(timeData)) {
      return res.status(400).json({
        success: false,
        message: "Time context data must be an array",
      });
    }

    const result = await DataImportService.importTimeData(timeData);

    res.json({
      success: true,
      data: result,
      message: `${result.imported} time context records imported successfully`,
    });
  } catch (error) {
    console.error("Error importing time context data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import time context data",
      error: error.message,
    });
  }
});

/**
 * GET /api/data/stats
 * Get data statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await DataImportService.getDataStats();

    res.json({
      success: true,
      data: stats,
      message: "Data statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching data stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data statistics",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/data/clear
 * Clear all data (for testing purposes)
 */
router.delete("/clear", async (req, res) => {
  try {
    const { collection, confirm } = req.body;

    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: "Confirmation required to clear data",
      });
    }

    if (collection) {
      const result = await DataImportService.clearCollection(collection);
      res.json({
        success: true,
        message: `Collection '${collection}' cleared successfully`,
        result,
      });
    } else {
      const result = await DataImportService.clearAllData();
      res.json({
        success: true,
        message: "All data cleared successfully",
        result,
      });
    }
  } catch (error) {
    console.error("Error clearing data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear data",
      error: error.message,
    });
  }
});

/**
 * GET /api/data/health
 * Check data health and integrity
 */
router.get("/health", async (req, res) => {
  try {
    const health = await DataImportService.checkDataHealth();

    res.json({
      success: true,
      data: health,
      message: "Data health check completed",
    });
  } catch (error) {
    console.error("Error checking data health:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check data health",
      error: error.message,
    });
  }
});

module.exports = router;
