const Hospital = require("../models/Hospital");
const AmbulanceLog = require("../models/AmbulanceLog");
const AccidentIncident = require("../models/AccidentIncident");
const WeatherContext = require("../models/WeatherContext");
const TimeContext = require("../models/TimeContext");

class PredictionService {
  /**
   * Get risk predictions for all zones
   * Returns: {
   *   zone: string,
   *   edPressure: 'Low' | 'Medium' | 'High',
   *   ambulancePressure: 'Low' | 'Medium' | 'High',
   *   accidentRisk: 'Low' | 'Medium' | 'High',
   *   overallRisk: 'Low' | 'Medium' | 'High'
   * }
   */
  static async getRiskPredictions() {
    const zones = ["North", "South", "East", "West", "Central"];
    const predictions = [];

    for (const zone of zones) {
      const prediction = await this.calculateZonePrediction(zone);
      predictions.push(prediction);
    }

    return predictions;
  }

  /**
   * Calculate prediction for a specific zone
   */
  static async calculateZonePrediction(zone) {
    // Get current date context
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Get recent data (last 24 hours)
    const recentLogs = await AmbulanceLog.find({
      zone: zone,
      timestamp: { $gte: yesterday },
    }).populate("hospital");

    const recentAccidents = await AccidentIncident.find({
      zone: zone,
      timestamp: { $gte: yesterday },
    });

    // Get current weather and time context
    const weather = await WeatherContext.findOne({
      date: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });

    const timeContext = await TimeContext.findOne({
      date: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      },
    });

    // Calculate metrics
    const edPressure = this.calculateEDPressure(recentLogs);
    const ambulancePressure = this.calculateAmbulancePressure(recentLogs);
    const accidentRisk = this.calculateAccidentRisk(
      recentAccidents,
      weather,
      timeContext,
    );

    // Calculate overall risk
    const overallRisk = this.calculateOverallRisk(
      edPressure,
      ambulancePressure,
      accidentRisk,
    );

    return {
      zone,
      edPressure,
      ambulancePressure,
      accidentRisk,
      overallRisk,
      timestamp: new Date(),
    };
  }

  /**
   * Calculate Emergency Department pressure based on ambulance arrivals vs capacity
   */
  static calculateEDPressure(recentLogs) {
    if (recentLogs.length === 0) return "Low";

    // Group by hospital and sum patient counts
    const hospitalLoads = {};
    recentLogs.forEach((log) => {
      if (log.hospital) {
        hospitalLoads[log.hospital._id] =
          (hospitalLoads[log.hospital._id] || 0) + log.patientCount;
      }
    });

    // Check if any hospital is near capacity
    const hospitals = Object.keys(hospitalLoads);
    if (hospitals.length === 0) return "Low";

    // For simplicity, we'll use average load vs average capacity
    // In a real system, we'd check each hospital individually
    const avgLoad =
      Object.values(hospitalLoads).reduce((a, b) => a + b, 0) /
      hospitals.length;

    // Thresholds (simplified for MVP)
    if (avgLoad >= 8) return "High";
    if (avgLoad >= 4) return "Medium";
    return "Low";
  }

  /**
   * Calculate ambulance pressure based on frequency of arrivals
   */
  static calculateAmbulancePressure(recentLogs) {
    const count = recentLogs.length;

    // Thresholds based on number of ambulance arrivals in 24 hours
    if (count >= 10) return "High";
    if (count >= 5) return "Medium";
    return "Low";
  }

  /**
   * Calculate accident risk based on historical incidents and current conditions
   */
  static calculateAccidentRisk(recentAccidents, weather, timeContext) {
    let riskScore = 0;

    // Base risk from recent accidents
    const highSeverityAccidents = recentAccidents.filter(
      (a) => a.severity === "High" || a.severity === "Critical",
    );
    riskScore += highSeverityAccidents.length * 2;
    riskScore += recentAccidents.filter((a) => a.severity === "Medium").length;

    // Weather multiplier
    if (weather) {
      switch (weather.condition) {
        case "Rainy":
          riskScore *= 1.5;
          break;
        case "Stormy":
          riskScore *= 2.0;
          break;
        case "Foggy":
          riskScore *= 1.3;
          break;
        case "Snowy":
          riskScore *= 1.8;
          break;
      }
    }

    // Seasonal and festival multiplier
    if (timeContext) {
      if (timeContext.isFestival) {
        riskScore *= 1.4;
      }
      if (timeContext.season === "Monsoon") {
        riskScore *= 1.2;
      }
    }

    // Convert score to risk level
    if (riskScore >= 8) return "High";
    if (riskScore >= 4) return "Medium";
    return "Low";
  }

  /**
   * Calculate overall risk from individual risk factors
   */
  static calculateOverallRisk(edPressure, ambulancePressure, accidentRisk) {
    const riskLevels = { Low: 1, Medium: 2, High: 3 };

    const totalScore =
      riskLevels[edPressure] +
      riskLevels[ambulancePressure] +
      riskLevels[accidentRisk];

    if (totalScore >= 7) return "High";
    if (totalScore >= 4) return "Medium";
    return "Low";
  }

  /**
   * Get early alerts for high-risk situations
   */
  static async getEarlyAlerts() {
    const predictions = await this.getRiskPredictions();
    const alerts = [];

    predictions.forEach((prediction) => {
      // Alert conditions
      if (prediction.overallRisk === "High") {
        alerts.push({
          type: "HIGH_RISK_ZONE",
          zone: prediction.zone,
          message: `High overall risk detected in ${prediction.zone} zone`,
          severity: "Critical",
          timestamp: prediction.timestamp,
        });
      }

      if (prediction.edPressure === "High") {
        alerts.push({
          type: "ED_OVERLOAD_RISK",
          zone: prediction.zone,
          message: `Emergency Department overload risk in ${prediction.zone} zone`,
          severity: "High",
          timestamp: prediction.timestamp,
        });
      }

      if (prediction.accidentRisk === "High") {
        alerts.push({
          type: "ACCIDENT_HOTSPOT",
          zone: prediction.zone,
          message: `Accident hotspot detected in ${prediction.zone} zone`,
          severity: "High",
          timestamp: prediction.timestamp,
        });
      }
    });

    return alerts;
  }
}

module.exports = PredictionService;
