const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Import models
const Hospital = require("../models/Hospital");
const AmbulanceLog = require("../models/AmbulanceLog");
const AccidentIncident = require("../models/AccidentIncident");
const WeatherContext = require("../models/WeatherContext");
const TimeContext = require("../models/TimeContext");

class AlertService {
  /**
   * Get current alerts for all zones
   */
  static async getCurrentAlerts() {
    try {
      const zones = ["North", "South", "East", "West", "Central"];
      const alerts = [];

      for (const zone of zones) {
        const zoneAlerts = await this.getZoneAlerts(zone);
        alerts.push(...zoneAlerts);
      }

      return alerts.sort((a, b) => {
        // Sort by severity (Critical > High > Medium > Low)
        const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    } catch (error) {
      logger.error("Error getting current alerts:", error);
      throw error;
    }
  }

  /**
   * Get active alerts only
   */
  static async getActiveAlerts() {
    try {
      const alerts = await this.getCurrentAlerts();
      return alerts.filter((alert) => alert.status === "active");
    } catch (error) {
      logger.error("Error getting active alerts:", error);
      throw error;
    }
  }

  /**
   * Get alerts for a specific zone
   */
  static async getAlertsByZone(zone) {
    try {
      const zoneAlerts = await this.getZoneAlerts(zone);
      return zoneAlerts.sort((a, b) => {
        const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    } catch (error) {
      logger.error(`Error getting alerts for zone ${zone}:`, error);
      throw error;
    }
  }

  /**
   * Get alert types and their counts
   */
  static async getAlertTypes() {
    try {
      const alerts = await this.getCurrentAlerts();
      const typeCounts = {};

      alerts.forEach((alert) => {
        typeCounts[alert.type] = (typeCounts[alert.type] || 0) + 1;
      });

      return Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        severity: this.getAlertTypeSeverity(type),
      }));
    } catch (error) {
      logger.error("Error getting alert types:", error);
      throw error;
    }
  }

  /**
   * Acknowledge an alert
   */
  static async acknowledgeAlert(alertId, acknowledgedBy) {
    try {
      // For now, we'll just return a mock acknowledged alert
      // In a real system, you'd have an Alert model to update
      return {
        id: alertId,
        acknowledged: true,
        acknowledgedBy,
        acknowledgedAt: new Date().toISOString(),
        status: "acknowledged",
      };
    } catch (error) {
      logger.error("Error acknowledging alert:", error);
      throw error;
    }
  }

  /**
   * Get alert history with filters
   */
  static async getAlertHistory(filters = {}) {
    try {
      const { startDate, endDate, zone, type, severity, limit = 100 } = filters;

      // Generate mock history data
      const mockHistory = [];
      const now = new Date();

      for (let i = 0; i < Math.min(limit, 50); i++) {
        const alertDate = new Date(
          now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        );

        mockHistory.push({
          id: `alert_${Date.now()}_${i}`,
          type: this.getRandomAlertType(),
          zone: this.getRandomZone(),
          severity: this.getRandomSeverity(),
          message: `Historical alert ${i + 1}`,
          timestamp: alertDate,
          status: "resolved",
        });
      }

      // Apply filters
      let filtered = mockHistory;

      if (startDate) {
        filtered = filtered.filter((alert) => alert.timestamp >= startDate);
      }
      if (endDate) {
        filtered = filtered.filter((alert) => alert.timestamp <= endDate);
      }
      if (zone) {
        filtered = filtered.filter((alert) => alert.zone === zone);
      }
      if (type) {
        filtered = filtered.filter((alert) => alert.type === type);
      }
      if (severity) {
        filtered = filtered.filter((alert) => alert.severity === severity);
      }

      return filtered.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      logger.error("Error getting alert history:", error);
      throw error;
    }
  }

  /**
   * Get zone-specific alerts
   */
  static async getZoneAlerts(zone) {
    const alerts = [];
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      // Check ED Pressure
      const recentLogs = await AmbulanceLog.find({
        zone: zone,
        timestamp: { $gte: yesterday },
      }).populate("hospital");

      const edPressure = this.calculateEDPressure(recentLogs);
      if (edPressure === "High") {
        alerts.push({
          id: `ed_pressure_${zone}_${Date.now()}`,
          type: "ED_OVERLOAD_RISK",
          zone: zone,
          hospitalName: `${zone} Zone Hospitals`,
          severity: "CRITICAL",
          message: `Emergency Department overload risk in ${zone} zone`,
          description: `High patient volume detected across ${recentLogs.length} hospitals in ${zone} zone. Average load is ${this.getAverageLoad(recentLogs).toFixed(1)}.`,
          timestamp: now,
          status: "active",
          details: {
            hospitalCount: recentLogs.length,
            averageLoad: this.getAverageLoad(recentLogs),
          },
        });
      }

      // Check Accidents (Include all severities)
      const recentIncidents = await AccidentIncident.find({
        zone: zone,
        timestamp: { $gte: yesterday },
      }).sort({ timestamp: -1 });

      recentIncidents.forEach((incident) => {
        let alertSeverity = "INFO";
        const incSev = incident.severity.toUpperCase();

        if (incSev === "CRITICAL") alertSeverity = "CRITICAL";
        else if (incSev === "HIGH")
          alertSeverity = "WARNING"; // High severity accident -> Warning alert (or High)
        else if (incSev === "MEDIUM")
          alertSeverity = "INFO"; // Medium -> Info
        else alertSeverity = "INFO"; // Low -> Info

        // User requested strict action colors:
        // Critical -> Red
        // Warning -> Amber
        // Info -> Green/Blue
        // So let's map strictly to what the frontend expects: CRITICAL, WARNING, INFO

        // However, if the user wants "High" to be "High Risk", we should use CRITICAL or WARNING.
        // Let's stick to the mapping:
        // Incident Critical -> Alert CRITICAL
        // Incident High -> Alert WARNING
        // Incident Medium -> Alert WARNING (or INFO?) -> Let's make Medium = WARNING to be safe
        // Incident Low -> Alert INFO

        if (incSev === "CRITICAL") alertSeverity = "CRITICAL";
        else if (incSev === "HIGH") alertSeverity = "WARNING";
        else if (incSev === "MEDIUM")
          alertSeverity = "WARNING"; // Elevate Medium to Warning for visibility
        else alertSeverity = "INFO";

        alerts.push({
          id: `incident_alert_${zone}_${incident._id}`,
          type: "ACCIDENT_HOTSPOT",
          zone: zone,
          hospitalName: `${zone} Emergency`,
          severity: alertSeverity,
          message: `${incident.severity} Severity Incident in ${zone}`,
          description:
            incident.description ||
            `${incident.severity} severity accident reported in ${zone} zone.`,
          timestamp: incident.timestamp,
          status: "active",
          details: {
            riskLevel: incident.riskLevel,
            type: incident.type,
            notes: incident.description || "No additional details",
          },
        });
      });

      // Check High Risk Dispatches (New Logic)
      const highRiskLogs = await AmbulanceLog.find({
        zone: zone,
        riskLevel: "High",
        timestamp: { $gte: yesterday },
      })
        .sort({ timestamp: -1 })
        .populate("hospital")
        .populate("ambulanceId"); // Ensure we get details

      // Iterate through all high risk logs instead of just the latest one
      highRiskLogs.forEach((latestHighRisk) => {
        alerts.push({
          id: `dispatch_risk_${zone}_${latestHighRisk._id}`,
          type: "HIGH_RISK_DISPATCH",
          zone: zone,
          hospitalName: latestHighRisk.hospital
            ? latestHighRisk.hospital.name
            : `${zone} Hospital`,
          severity: "CRITICAL", // Force Critical for High Risk Dispatch
          message: `High Risk Accident Dispatch in ${zone}`,
          description:
            latestHighRisk.description ||
            `Critical ambulance dispatch reported in ${zone} zone.`,
          timestamp: latestHighRisk.timestamp,
          status: "active",
          details: {
            riskLevel: latestHighRisk.riskLevel,
            ambulanceId: latestHighRisk.ambulanceId
              ? latestHighRisk.ambulanceId.ambulanceId
              : "Unassigned",
            notes: latestHighRisk.description || "No additional details",
          },
        });
      });

      // Check Accident Risk
      const recentAccidents = await AccidentIncident.find({
        zone: zone,
        timestamp: { $gte: yesterday },
      });

      const accidentRisk = this.calculateAccidentRisk(recentAccidents);
      if (accidentRisk === "High") {
        alerts.push({
          id: `accident_risk_${zone}_${Date.now()}`,
          type: "ACCIDENT_HOTSPOT",
          zone: zone,
          hospitalName: `${zone} Zone Emergency`,
          severity: "CRITICAL",
          message: `Accident hotspot detected in ${zone} zone`,
          description: `Multiple high-severity accidents reported in ${zone} zone. Total accidents: ${recentAccidents.length}.`,
          timestamp: now,
          status: "active",
          details: {
            accidentCount: recentAccidents.length,
            highSeverityCount: recentAccidents.filter(
              (a) => a.severity === "High" || a.severity === "Critical",
            ).length,
          },
        });
      }

      // Check Ambulance Pressure
      const ambulancePressure = this.calculateAmbulancePressure(recentLogs);
      if (ambulancePressure === "High") {
        alerts.push({
          id: `ambulance_pressure_${zone}_${Date.now()}`,
          type: "AMBULANCE_OVERLOAD",
          zone: zone,
          hospitalName: `${zone} Zone Fleet`,
          severity: "WARNING",
          message: `High ambulance activity in ${zone} zone`,
          description: `Ambulance fleet is under high pressure. ${recentLogs.length} recent logs.`,
          timestamp: now,
          status: "active",
          details: {
            arrivalCount: recentLogs.length,
            averagePatients: this.getAveragePatients(recentLogs),
          },
        });
      }

      // Check Weather Alerts
      const currentWeather = await WeatherContext.findOne({
        zone: zone,
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      });

      if (currentWeather && this.isSevereWeather(currentWeather.condition)) {
        alerts.push({
          id: `weather_alert_${zone}_${Date.now()}`,
          type: "SEVERE_WEATHER",
          zone: zone,
          hospitalName: `${zone} Zone Weather`,
          severity: "WARNING",
          message: `Severe weather conditions in ${zone} zone: ${currentWeather.condition}`,
          description: `Weather warning: ${currentWeather.condition}. Temperature: ${currentWeather.temperature}°C.`,
          timestamp: now,
          status: "active",
          details: {
            condition: currentWeather.condition,
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity,
          },
        });
      }

      // Check Time-based Alerts
      const currentTime = await TimeContext.findOne({
        zone: zone,
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
        hour: now.getHours(),
      });

      if (currentTime && currentTime.rushHour) {
        alerts.push({
          id: `rush_hour_${zone}_${Date.now()}`,
          type: "RUSH_HOUR",
          zone: zone,
          hospitalName: `${zone} Zone Traffic`,
          severity: "INFO",
          message: `Rush hour traffic expected in ${zone} zone`,
          description: `Traffic congestion likely due to rush hour. Delays expected for ambulance routing.`,
          timestamp: now,
          status: "active",
          details: {
            hour: now.getHours(),
            isWeekend: currentTime.isWeekend,
            isHoliday: currentTime.isHoliday,
          },
        });
      }

      return alerts;
    } catch (error) {
      logger.error(`Error getting alerts for zone ${zone}:`, error);
      throw error;
    }
  }

  // Helper methods

  static calculateEDPressure(recentLogs) {
    if (recentLogs.length === 0) return "Low";

    const hospitalLoads = {};
    recentLogs.forEach((log) => {
      if (log.hospital) {
        hospitalLoads[log.hospital._id] =
          (hospitalLoads[log.hospital._id] || 0) + log.patientCount;
      }
    });

    const hospitals = Object.keys(hospitalLoads);
    if (hospitals.length === 0) return "Low";

    const avgLoad =
      Object.values(hospitalLoads).reduce((a, b) => a + b, 0) /
      hospitals.length;

    if (avgLoad >= 8) return "High";
    if (avgLoad >= 4) return "Medium";
    return "Low";
  }

  static calculateAccidentRisk(recentAccidents) {
    const highSeverityAccidents = recentAccidents.filter(
      (a) => a.severity === "High" || a.severity === "Critical",
    );
    const riskScore =
      highSeverityAccidents.length * 2 +
      recentAccidents.filter((a) => a.severity === "Medium").length;

    if (riskScore >= 6) return "High";
    if (riskScore >= 3) return "Medium";
    return "Low";
  }

  static calculateAmbulancePressure(recentLogs) {
    const count = recentLogs.length;
    if (count >= 12) return "High";
    if (count >= 6) return "Medium";
    return "Low";
  }

  static isSevereWeather(condition) {
    return ["Stormy", "Foggy", "Snowy"].includes(condition);
  }

  static getAverageLoad(recentLogs) {
    if (recentLogs.length === 0) return 0;
    const totalLoad = recentLogs.reduce(
      (sum, log) => sum + log.patientCount,
      0,
    );
    return totalLoad / recentLogs.length;
  }

  static getAveragePatients(recentLogs) {
    return this.getAverageLoad(recentLogs);
  }

  static getAlertTypeSeverity(type) {
    const severityMap = {
      HIGH_RISK_DISPATCH: "Critical",
      HIGH_RISK_ZONE: "Critical",
      ED_OVERLOAD_RISK: "High",
      ACCIDENT_HOTSPOT: "High",
      AMBULANCE_OVERLOAD: "Medium",
      SEVERE_WEATHER: "Medium",
      RUSH_HOUR: "Low",
    };
    return severityMap[type] || "Medium";
  }

  static getRandomAlertType() {
    const types = [
      "HIGH_RISK_ZONE",
      "ED_OVERLOAD_RISK",
      "ACCIDENT_HOTSPOT",
      "AMBULANCE_OVERLOAD",
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  static getRandomZone() {
    const zones = ["North", "South", "East", "West", "Central"];
    return zones[Math.floor(Math.random() * zones.length)];
  }

  static getRandomSeverity() {
    const severities = ["Low", "Medium", "High", "Critical"];
    return severities[Math.floor(Math.random() * severities.length)];
  }
}

module.exports = AlertService;
