const logger = require("../utils/logger");

// Import models
const Hospital = require("../models/Hospital");
const AmbulanceLog = require("../models/AmbulanceLog");
const AccidentIncident = require("../models/AccidentIncident");
const WeatherContext = require("../models/WeatherContext");
const TimeContext = require("../models/TimeContext");

class DataImportService {
  /**
   * Import hospital data
   */
  static async importHospitals(hospitals) {
    try {
      let imported = 0;
      let skipped = 0;
      let errors = [];

      for (const hospitalData of hospitals) {
        try {
          // Check if hospital already exists
          const existing = await Hospital.findOne({ name: hospitalData.name });
          if (existing) {
            skipped++;
            continue;
          }

          // Validate data
          const validationResult = this.validateHospitalData(hospitalData);
          if (!validationResult.isValid) {
            errors.push({
              data: hospitalData,
              error: validationResult.error,
            });
            continue;
          }

          // Create hospital
          await Hospital.create(hospitalData);
          imported++;
        } catch (error) {
          errors.push({
            data: hospitalData,
            error: error.message,
          });
        }
      }

      logger.info(
        `Hospital import completed: ${imported} imported, ${skipped} skipped, ${errors.length} errors`,
      );

      return {
        imported,
        skipped,
        errors,
        success: errors.length === 0,
      };
    } catch (error) {
      logger.error("Error importing hospitals:", error);
      throw error;
    }
  }

  /**
   * Import ambulance log data
   */
  static async importAmbulanceLogs(logs) {
    try {
      let imported = 0;
      let skipped = 0;
      let errors = [];

      for (const logData of logs) {
        try {
          // Check if log already exists (basic duplicate check)
          const existing = await AmbulanceLog.findOne({
            hospitalId: logData.hospitalId,
            arrivalTime: logData.arrivalTime,
            patientCount: logData.patientCount,
          });

          if (existing) {
            skipped++;
            continue;
          }

          // Validate data
          const validationResult = this.validateAmbulanceLogData(logData);
          if (!validationResult.isValid) {
            errors.push({
              data: logData,
              error: validationResult.error,
            });
            continue;
          }

          // Create log
          await AmbulanceLog.create(logData);
          imported++;
        } catch (error) {
          errors.push({
            data: logData,
            error: error.message,
          });
        }
      }

      logger.info(
        `Ambulance log import completed: ${imported} imported, ${skipped} skipped, ${errors.length} errors`,
      );

      return {
        imported,
        skipped,
        errors,
        success: errors.length === 0,
      };
    } catch (error) {
      logger.error("Error importing ambulance logs:", error);
      throw error;
    }
  }

  /**
   * Import accident/incident data
   */
  static async importAccidents(accidents) {
    try {
      let imported = 0;
      let skipped = 0;
      let errors = [];

      for (const accidentData of accidents) {
        try {
          // Check if accident already exists (basic duplicate check)
          const existing = await AccidentIncident.findOne({
            zone: accidentData.zone,
            latitude: accidentData.latitude,
            longitude: accidentData.longitude,
            timestamp: accidentData.timestamp,
          });

          if (existing) {
            skipped++;
            continue;
          }

          // Validate data
          const validationResult = this.validateAccidentData(accidentData);
          if (!validationResult.isValid) {
            errors.push({
              data: accidentData,
              error: validationResult.error,
            });
            continue;
          }

          // Create accident
          await AccidentIncident.create(accidentData);
          imported++;
        } catch (error) {
          errors.push({
            data: accidentData,
            error: error.message,
          });
        }
      }

      logger.info(
        `Accident import completed: ${imported} imported, ${skipped} skipped, ${errors.length} errors`,
      );

      return {
        imported,
        skipped,
        errors,
        success: errors.length === 0,
      };
    } catch (error) {
      logger.error("Error importing accidents:", error);
      throw error;
    }
  }

  /**
   * Import weather context data
   */
  static async importWeatherData(weatherData) {
    try {
      let imported = 0;
      let skipped = 0;
      let errors = [];

      for (const weather of weatherData) {
        try {
          // Check if weather data already exists for this date and zone
          const existing = await WeatherContext.findOne({
            date: weather.date,
            zone: weather.zone,
          });

          if (existing) {
            skipped++;
            continue;
          }

          // Validate data
          const validationResult = this.validateWeatherData(weather);
          if (!validationResult.isValid) {
            errors.push({
              data: weather,
              error: validationResult.error,
            });
            continue;
          }

          // Create weather record
          await WeatherContext.create(weather);
          imported++;
        } catch (error) {
          errors.push({
            data: weather,
            error: error.message,
          });
        }
      }

      logger.info(
        `Weather data import completed: ${imported} imported, ${skipped} skipped, ${errors.length} errors`,
      );

      return {
        imported,
        skipped,
        errors,
        success: errors.length === 0,
      };
    } catch (error) {
      logger.error("Error importing weather data:", error);
      throw error;
    }
  }

  /**
   * Import time context data
   */
  static async importTimeData(timeData) {
    try {
      let imported = 0;
      let skipped = 0;
      let errors = [];

      for (const time of timeData) {
        try {
          // Check if time context already exists for this date and hour
          const existing = await TimeContext.findOne({
            date: time.date,
            hour: time.hour,
            zone: time.zone,
          });

          if (existing) {
            skipped++;
            continue;
          }

          // Validate data
          const validationResult = this.validateTimeData(time);
          if (!validationResult.isValid) {
            errors.push({
              data: time,
              error: validationResult.error,
            });
            continue;
          }

          // Create time context record
          await TimeContext.create(time);
          imported++;
        } catch (error) {
          errors.push({
            data: time,
            error: error.message,
          });
        }
      }

      logger.info(
        `Time context import completed: ${imported} imported, ${skipped} skipped, ${errors.length} errors`,
      );

      return {
        imported,
        skipped,
        errors,
        success: errors.length === 0,
      };
    } catch (error) {
      logger.error("Error importing time context data:", error);
      throw error;
    }
  }

  /**
   * Get data statistics
   */
  static async getDataStats() {
    try {
      const stats = {
        hospitals: await Hospital.countDocuments(),
        ambulanceLogs: await AmbulanceLog.countDocuments(),
        accidents: await AccidentIncident.countDocuments(),
        weatherRecords: await WeatherContext.countDocuments(),
        timeRecords: await TimeContext.countDocuments(),
        totalRecords: 0,
        lastUpdated: new Date(),
      };

      stats.totalRecords =
        stats.hospitals +
        stats.ambulanceLogs +
        stats.accidents +
        stats.weatherRecords +
        stats.timeRecords;

      // Get additional statistics
      const hospitalStats = await Hospital.aggregate([
        {
          $group: {
            _id: null,
            avgCapacity: { $avg: "$capacity" },
            totalCapacity: { $sum: "$capacity" },
          },
        },
      ]);

      const logStats = await AmbulanceLog.aggregate([
        {
          $group: {
            _id: null,
            avgPatients: { $avg: "$patientCount" },
            totalPatients: { $sum: "$patientCount" },
          },
        },
      ]);

      const accidentStats = await AccidentIncident.aggregate([
        { $group: { _id: "$severity", count: { $sum: 1 } } },
      ]);

      stats.hospitalStats = hospitalStats[0] || {
        avgCapacity: 0,
        totalCapacity: 0,
      };
      stats.logStats = logStats[0] || { avgPatients: 0, totalPatients: 0 };
      stats.accidentStats = accidentStats;

      return stats;
    } catch (error) {
      logger.error("Error getting data stats:", error);
      throw error;
    }
  }

  /**
   * Clear all data (for testing purposes)
   */
  static async clearAllData() {
    try {
      const results = {};

      results.hospitals = await Hospital.deleteMany({});
      results.ambulanceLogs = await AmbulanceLog.deleteMany({});
      results.accidents = await AccidentIncident.deleteMany({});
      results.weatherRecords = await WeatherContext.deleteMany({});
      results.timeRecords = await TimeContext.deleteMany({});

      logger.info("All data cleared successfully");

      return results;
    } catch (error) {
      logger.error("Error clearing all data:", error);
      throw error;
    }
  }

  /**
   * Clear specific collection
   */
  static async clearCollection(collectionName) {
    try {
      let result;

      switch (collectionName.toLowerCase()) {
        case "hospitals":
          result = await Hospital.deleteMany({});
          break;
        case "ambulancelogs":
        case "ambulance_logs":
          result = await AmbulanceLog.deleteMany({});
          break;
        case "accidents":
          result = await AccidentIncident.deleteMany({});
          break;
        case "weather":
        case "weathercontext":
          result = await WeatherContext.deleteMany({});
          break;
        case "time":
        case "timecontext":
          result = await TimeContext.deleteMany({});
          break;
        default:
          throw new Error(`Unknown collection: ${collectionName}`);
      }

      logger.info(`Collection ${collectionName} cleared successfully`);

      return result;
    } catch (error) {
      logger.error(`Error clearing collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Check data health and integrity
   */
  static async checkDataHealth() {
    try {
      const health = {
        status: "healthy",
        issues: [],
        warnings: [],
        lastChecked: new Date(),
      };

      // Check for missing required data
      const hospitalCount = await Hospital.countDocuments();
      const logCount = await AmbulanceLog.countDocuments();
      const accidentCount = await AccidentIncident.countDocuments();

      if (hospitalCount === 0) {
        health.issues.push("No hospitals found in database");
        health.status = "unhealthy";
      }

      if (logCount === 0) {
        health.warnings.push("No ambulance logs found");
      }

      if (accidentCount === 0) {
        health.warnings.push("No accident records found");
      }

      // Check for data consistency
      const recentLogs = await AmbulanceLog.find({
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      const recentAccidents = await AccidentIncident.find({
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      if (recentLogs.length === 0) {
        health.warnings.push("No recent ambulance logs (last 7 days)");
      }

      if (recentAccidents.length === 0) {
        health.warnings.push("No recent accident records (last 7 days)");
      }

      // Check for orphaned references
      const orphanedLogs = await AmbulanceLog.aggregate([
        {
          $lookup: {
            from: "hospitals",
            localField: "hospitalId",
            foreignField: "_id",
            as: "hospital",
          },
        },
        { $match: { hospital: { $size: 0 } } },
        { $count: "orphaned" },
      ]);

      if (orphanedLogs.length > 0 && orphanedLogs[0].orphaned > 0) {
        health.warnings.push(
          `${orphanedLogs[0].orphaned} ambulance logs have invalid hospital references`,
        );
      }

      // Check data freshness
      const latestLog = await AmbulanceLog.findOne().sort({ timestamp: -1 });
      const latestAccident = await AccidentIncident.findOne().sort({
        timestamp: -1,
      });

      if (latestLog) {
        const logAge =
          (Date.now() - latestLog.timestamp.getTime()) / (60 * 60 * 1000);
        if (logAge > 24) {
          health.warnings.push(
            `Latest ambulance log is ${Math.round(logAge)} hours old`,
          );
        }
      }

      if (latestAccident) {
        const accidentAge =
          (Date.now() - latestAccident.timestamp.getTime()) / (60 * 60 * 1000);
        if (accidentAge > 24) {
          health.warnings.push(
            `Latest accident record is ${Math.round(accidentAge)} hours old`,
          );
        }
      }

      return health;
    } catch (error) {
      logger.error("Error checking data health:", error);
      throw error;
    }
  }

  // Validation helper methods

  static validateHospitalData(data) {
    const required = ["name", "zone", "capacity"];
    const errors = [];

    for (const field of required) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (data.capacity && (data.capacity < 1 || data.capacity > 1000)) {
      errors.push("Capacity must be between 1 and 1000");
    }

    return {
      isValid: errors.length === 0,
      error: errors.join(", "),
    };
  }

  static validateAmbulanceLogData(data) {
    const required = ["hospitalId", "zone", "patientCount", "arrivalTime"];
    const errors = [];

    for (const field of required) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (
      data.patientCount &&
      (data.patientCount < 0 || data.patientCount > 10)
    ) {
      errors.push("Patient count must be between 0 and 10");
    }

    return {
      isValid: errors.length === 0,
      error: errors.join(", "),
    };
  }

  static validateAccidentData(data) {
    const required = [
      "zone",
      "severity",
      "type",
      "latitude",
      "longitude",
      "victimCount",
      "timestamp",
    ];
    const errors = [];

    for (const field of required) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (data.victimCount && data.victimCount < 1) {
      errors.push("Victim count must be at least 1");
    }

    if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
      errors.push("Latitude must be between -90 and 90");
    }

    if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
      errors.push("Longitude must be between -180 and 180");
    }

    return {
      isValid: errors.length === 0,
      error: errors.join(", "),
    };
  }

  static validateWeatherData(data) {
    const required = ["date", "zone", "temperature", "humidity", "condition"];
    const errors = [];

    for (const field of required) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (data.temperature && (data.temperature < -50 || data.temperature > 50)) {
      errors.push("Temperature must be between -50 and 50");
    }

    if (data.humidity && (data.humidity < 0 || data.humidity > 100)) {
      errors.push("Humidity must be between 0 and 100");
    }

    return {
      isValid: errors.length === 0,
      error: errors.join(", "),
    };
  }

  static validateTimeData(data) {
    const required = ["date", "hour", "dayOfWeek", "isWeekend", "season"];
    const errors = [];

    for (const field of required) {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    if (data.hour && (data.hour < 0 || data.hour > 23)) {
      errors.push("Hour must be between 0 and 23");
    }

    if (data.dayOfWeek && (data.dayOfWeek < 0 || data.dayOfWeek > 6)) {
      errors.push("Day of week must be between 0 and 6");
    }

    return {
      isValid: errors.length === 0,
      error: errors.join(", "),
    };
  }
}

module.exports = DataImportService;
