const logger = require("../utils/logger");

// Import models
const Hospital = require("../models/Hospital");
const AmbulanceLog = require("../models/AmbulanceLog");
const Ambulance = require("../models/Ambulance");
const AccidentIncident = require("../models/AccidentIncident");
const WeatherContext = require("../models/WeatherContext");
const TimeContext = require("../models/TimeContext");
const PredictionService = require("./predictionService");
const AlertService = require("./alertService");
const mockDataService = require("./mockDataService");

class DashboardService {
  /**
   * Get dashboard summary data
   */
  static async getDashboardSummary() {
    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get basic counts
      const hospitalCount = await Hospital.countDocuments();
      const ambulanceLogCount = await AmbulanceLog.countDocuments({
        timestamp: { $gte: yesterday },
      });
      const accidentCount = await AccidentIncident.countDocuments({
        timestamp: { $gte: yesterday },
      });

      // Get predictions
      const predictions = await PredictionService.getRiskPredictions();
      
      // Get alerts
      const alerts = await AlertService.getCurrentAlerts();
      
      // Calculate Overall Pressure Level
      const highRiskZones = predictions.filter(p => p.overallRisk === "High").length;
      const criticalAlerts = alerts.filter(a => a.severity === "Critical").length;
      
      let overallPressureLevel = "NORMAL";
      if (hospitalCount === 0) overallPressureLevel = "NO DATA";
      else if (highRiskZones > 1 || criticalAlerts > 0) overallPressureLevel = "CRITICAL";
      else if (highRiskZones > 0 || alerts.length > 5) overallPressureLevel = "WARNING";

      // Get detailed data for lists
      const hospitals = await Hospital.find();
      
      // Calculate available ambulances (real data)
      const availableAmbulances = await Ambulance.countDocuments({ status: "Available" });
      const totalAmbulances = await Ambulance.countDocuments();
      
      // Prepare Pressure Trends (Top 5 busiest hospitals)
      const pressureTrends = hospitals
        .map(h => ({
          level: this.getHospitalStatus(h).toUpperCase(),
          hospitalName: h.name,
          location: h.zone,
          percentage: Math.round((h.currentLoad / h.capacity) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

      // Prepare Ambulance Status (real data aggregation)
      const ambulanceStatus = await Ambulance.aggregate([
        {
          $group: {
            _id: "$zone",
            available: { 
              $sum: { $cond: [{ $eq: ["$status", "Available"] }, 1, 0] } 
            },
            total: { $sum: 1 }
          }
        },
        { $limit: 5 }
      ]);
      
      const formattedAmbulanceStatus = ambulanceStatus.map(stat => ({
        hospitalName: stat._id + " Zone", // Grouped by zone
        location: stat._id,
        available: stat.available
      }));

      // Prepare Recent Alerts
      const recentAlerts = alerts.slice(0, 5).map(a => ({
        severity: a.severity.toUpperCase(),
        message: a.message,
        hospitalName: a.zone + " Zone", // Alerts are zone based mostly
        timestamp: new Date(a.timestamp).toLocaleTimeString()
      }));

      return {
        overallPressureLevel,
        availableAmbulances: availableAmbulances,
        totalAmbulances: totalAmbulances,
        activeIncidents: accidentCount,
        hospitalsMonitored: hospitalCount,
        pressureTrends,
        ambulanceStatus: formattedAmbulanceStatus,
        recentAlerts,
        lastUpdated: now
      };
    } catch (error) {
      logger.error("Error getting dashboard summary:", error);
      throw error;
    }
  }

  /**
   * Get zone-wise data for dashboard
   */
  static async getZonesData() {
    try {
      const zones = ["North", "South", "East", "West", "Central"];
      const zonesData = [];

      for (const zone of zones) {
        const zoneData = await this.getZoneData(zone);
        zonesData.push(zoneData);
      }

      return zonesData;
    } catch (error) {
      logger.error("Error getting zones data:", error);
      throw error;
    }
  }

  /**
   * Get hospital-wise data for dashboard
   */
  static async getHospitalsData() {
    try {
      const hospitals = await Hospital.find().sort({ name: 1 });
      const hospitalsData = [];

      for (const hospital of hospitals) {
        const hospitalData = await this.getHospitalData(hospital);
        hospitalsData.push(hospitalData);
      }

      return hospitalsData;
    } catch (error) {
      logger.error("Error getting hospitals data:", error);
      throw error;
    }
  }

  /**
   * Get trend data for dashboard charts
   */
  static async getTrends(params = {}) {
    try {
      const {
        timeRange = "24h",
        zone,
        hospitalId,
        metric = "pressure",
      } = params;

      const timeRangeHours = this.parseTimeRange(timeRange);
      const endTime = new Date();
      const startTime = new Date(
        endTime.getTime() - timeRangeHours * 60 * 60 * 1000,
      );

      let trends = [];

      switch (metric) {
        case "pressure":
          trends = await this.getPressureTrends(
            startTime,
            endTime,
            zone,
            hospitalId,
          );
          break;
        case "risk":
          trends = await this.getRiskTrends(startTime, endTime, zone);
          break;
        case "utilization":
          trends = await this.getUtilizationTrends(
            startTime,
            endTime,
            zone,
            hospitalId,
          );
          break;
        default:
          trends = await this.getPressureTrends(
            startTime,
            endTime,
            zone,
            hospitalId,
          );
      }

      return {
        metric,
        timeRange,
        zone: zone || "All",
        hospitalId: hospitalId || "All",
        data: trends,
        labels: this.generateTimeLabels(startTime, endTime, timeRangeHours),
      };
    } catch (error) {
      logger.error("Error getting trends:", error);
      throw error;
    }
  }

  /**
   * Get real-time data for dashboard
   */
  static async getRealtimeData() {
    try {
      const now = new Date();
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

      // Get recent activity
      const recentLogs = await AmbulanceLog.find({
        timestamp: { $gte: lastHour },
      })
        .populate("hospital")
        .sort({ timestamp: -1 })
        .limit(20);

      const recentAccidents = await AccidentIncident.find({
        timestamp: { $gte: lastHour },
      })
        .sort({ timestamp: -1 })
        .limit(10);

      // Get current weather
      const currentWeather = await WeatherContext.find({
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      });

      // Get current time context
      const currentTime = await TimeContext.find({
        date: {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
        hour: now.getHours(),
      });

      return {
        timestamp: now,
        recentActivity: {
          ambulanceLogs: recentLogs,
          accidents: recentAccidents,
          totalLogs: recentLogs.length,
          totalAccidents: recentAccidents.length,
        },
        currentConditions: {
          weather: currentWeather,
          timeContext: currentTime,
          isRushHour: currentTime.some((tc) => tc.rushHour),
          isWeekend: currentTime.some((tc) => tc.isWeekend),
          isHoliday: currentTime.some((tc) => tc.isHoliday),
        },
        systemHealth: {
          dataFreshness: this.checkDataFreshness(recentLogs, recentAccidents),
          predictionAccuracy: await this.getPredictionAccuracy(),
          alertResponseTime: await this.getAlertResponseTime(),
        },
      };
    } catch (error) {
      logger.error("Error getting real-time data:", error);
      throw error;
    }
  }

  /**
   * Get key statistics for dashboard
   */
  static async getStats() {
    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Basic statistics
      const totalHospitals = await Hospital.countDocuments();
      const totalBeds = await Hospital.aggregate([
        { $group: { _id: null, total: { $sum: "$capacity" } } },
      ]);

      // Activity statistics
      const dailyLogs = await AmbulanceLog.countDocuments({
        timestamp: { $gte: yesterday },
      });
      const weeklyLogs = await AmbulanceLog.countDocuments({
        timestamp: { $gte: lastWeek },
      });

      const dailyAccidents = await AccidentIncident.countDocuments({
        timestamp: { $gte: yesterday },
      });
      const weeklyAccidents = await AccidentIncident.countDocuments({
        timestamp: { $gte: lastWeek },
      });

      // Risk statistics
      const predictions = await PredictionService.getRiskPredictions();
      const riskDistribution = {
        high: predictions.filter((p) => p.overallRisk === "High").length,
        medium: predictions.filter((p) => p.overallRisk === "Medium").length,
        low: predictions.filter((p) => p.overallRisk === "Low").length,
      };

      // Alert statistics
      const alerts = await AlertService.getCurrentAlerts();
      const alertDistribution = {
        critical: alerts.filter((a) => a.severity === "Critical").length,
        high: alerts.filter((a) => a.severity === "High").length,
        medium: alerts.filter((a) => a.severity === "Medium").length,
        low: alerts.filter((a) => a.severity === "Low").length,
      };

      return {
        hospitals: {
          total: totalHospitals,
          totalCapacity: totalBeds[0]?.total || 0,
          averageCapacity:
            totalHospitals > 0
              ? Math.round((totalBeds[0]?.total || 0) / totalHospitals)
              : 0,
        },
        activity: {
          daily: {
            ambulanceLogs: dailyLogs,
            accidents: dailyAccidents,
          },
          weekly: {
            ambulanceLogs: weeklyLogs,
            accidents: weeklyAccidents,
          },
        },
        risk: riskDistribution,
        alerts: alertDistribution,
        efficiency: {
          avgResponseTime: await this.getAverageResponseTime(),
          avgPatientLoad: await this.getAveragePatientLoad(),
          utilizationRate: await this.getUtilizationRate(),
        },
      };
    } catch (error) {
      logger.error("Error getting statistics:", error);
      throw error;
    }
  }

  /**
   * Get map data for dashboard
   */
  static async getMapData() {
    try {
      const zones = ["North", "South", "East", "West", "Central"];
      const mapData = [];

      for (const zone of zones) {
        const zoneMapData = await this.getZoneMapData(zone);
        mapData.push(zoneMapData);
      }

      return {
        zones: mapData,
        hospitals: await this.getHospitalMapData(),
        incidents: await this.getIncidentMapData(),
        lastUpdated: new Date(),
      };
    } catch (error) {
      logger.error("Error getting map data:", error);
      throw error;
    }
  }

  // Helper methods

  static async getZoneData(zone) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const hospitalCount = await Hospital.countDocuments({ zone });
    const ambulanceLogs = await AmbulanceLog.countDocuments({
      zone,
      timestamp: { $gte: yesterday },
    });
    const accidents = await AccidentIncident.countDocuments({
      zone,
      timestamp: { $gte: yesterday },
    });

    const prediction = await PredictionService.calculateZonePrediction(zone);

    return {
      zone,
      hospitalCount,
      ambulanceLogs,
      accidents,
      prediction,
      riskLevel: prediction.overallRisk,
      lastUpdated: new Date(),
    };
  }

  static async getHospitalData(hospital) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentLogs = await AmbulanceLog.countDocuments({
      hospitalId: hospital._id,
      timestamp: { $gte: yesterday },
    });

    const utilization = hospital.currentPatients / hospital.capacity;

    return {
      ...hospital.toObject(),
      recentActivity: recentLogs,
      utilization: Math.round(utilization * 100),
      status:
        utilization > 0.8 ? "Critical" : utilization > 0.5 ? "High" : "Normal",
      lastUpdated: new Date(),
    };
  }

  static async getPressureTrends(startTime, endTime, zone, hospitalId) {
    const matchStage = {
      timestamp: { $gte: startTime, $lte: endTime },
    };

    if (zone) matchStage.zone = zone;
    if (hospitalId) matchStage.hospitalId = hospitalId;

    const trends = await AmbulanceLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            hour: { $hour: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            month: { $month: "$timestamp" },
            year: { $year: "$timestamp" },
          },
          count: { $sum: 1 },
          avgPatients: { $avg: "$patientCount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.hour": 1 } },
    ]);

    return trends.map((trend) => ({
      time: new Date(
        trend._id.year,
        trend._id.month - 1,
        trend._id.day,
        trend._id.hour,
      ),
      value: trend.count,
      avgPatients: trend.avgPatients,
    }));
  }

  static async getRiskTrends(startTime, endTime, zone) {
    // For simplicity, return mock trend data
    const hours = Math.ceil((endTime - startTime) / (60 * 60 * 1000));
    const trends = [];

    for (let i = 0; i < hours; i++) {
      const time = new Date(startTime.getTime() + i * 60 * 60 * 1000);
      trends.push({
        time,
        riskLevel: Math.floor(Math.random() * 3) + 1, // 1-3 scale
        zone: zone || "All",
      });
    }

    return trends;
  }

  static async getUtilizationTrends(startTime, endTime, zone, hospitalId) {
    // For simplicity, return mock utilization data
    const hours = Math.ceil((endTime - startTime) / (60 * 60 * 1000));
    const trends = [];

    for (let i = 0; i < hours; i++) {
      const time = new Date(startTime.getTime() + i * 60 * 60 * 1000);
      trends.push({
        time,
        utilization: Math.random() * 100,
        occupancy: Math.random() * 100,
      });
    }

    return trends;
  }

  static parseTimeRange(timeRange) {
    const ranges = {
      "1h": 1,
      "6h": 6,
      "24h": 24,
      "7d": 168,
      "30d": 720,
    };
    return ranges[timeRange] || 24;
  }

  static generateTimeLabels(startTime, endTime, hours) {
    const labels = [];
    const interval = (endTime - startTime) / hours;

    for (let i = 0; i < hours; i++) {
      const time = new Date(startTime.getTime() + i * interval);
      labels.push(time.toISOString());
    }

    return labels;
  }

  static async getZoneMapData(zone) {
    const hospitals = await Hospital.find({ zone });
    const recentAccidents = await AccidentIncident.find({
      zone,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    return {
      zone,
      hospitals: hospitals.map((h) => ({
        id: h._id,
        name: h.name,
        location: { lat: h.latitude, lng: h.longitude },
        capacity: h.capacity,
        currentPatients: h.currentPatients,
        utilization: Math.round((h.currentPatients / h.capacity) * 100),
      })),
      incidents: recentAccidents.map((a) => ({
        id: a._id,
        type: a.type,
        severity: a.severity,
        location: { lat: a.latitude, lng: a.longitude },
        timestamp: a.timestamp,
        victimCount: a.victimCount,
      })),
      riskLevel: await this.getZoneRiskLevel(zone),
    };
  }

  static async getHospitalMapData() {
    const hospitals = await Hospital.find();
    // Get available ambulances count for each hospital
    const ambulanceCounts = await Ambulance.aggregate([
      { $match: { status: "Available" } },
      { $group: { _id: "$assignedHospital", count: { $sum: 1 } } }
    ]);
    
    const countMap = {};
    ambulanceCounts.forEach(item => {
      if (item._id) countMap[item._id.toString()] = item.count;
    });

    const activeIncidents = await AccidentIncident.aggregate([
       { $match: { timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }, // Last 24h
       { $group: { _id: "$zone", count: { $sum: 1 } } }
    ]);
    
    const incidentMap = {};
    activeIncidents.forEach(item => {
        incidentMap[item._id] = item.count;
    });

    return hospitals.map((h) => ({
      id: h._id,
      name: h.name,
      zone: h.zone,
      location: { lat: h.latitude, lng: h.longitude },
      capacity: h.capacity,
      currentPatients: h.currentPatients,
      type: h.type,
      status: this.getHospitalStatus(h),
      availableAmbulances: countMap[h._id.toString()] || 0,
      activeIncidents: incidentMap[h.zone] || 0 // Approximate by zone
    }));
  }

  static async getIncidentMapData() {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const incidents = await AccidentIncident.find({
      timestamp: { $gte: yesterday },
    });
    return incidents.map((i) => ({
      id: i._id,
      type: i.type,
      severity: i.severity,
      location: { lat: i.latitude, lng: i.longitude },
      timestamp: i.timestamp,
      victimCount: i.victimCount,
      zone: i.zone,
    }));
  }

  static async getZoneRiskLevel(zone) {
    const prediction = await PredictionService.calculateZonePrediction(zone);
    return prediction.overallRisk;
  }

  static getHospitalStatus(hospital) {
    const utilization = hospital.currentPatients / hospital.capacity;
    if (utilization > 0.9) return "Critical";
    if (utilization > 0.7) return "High";
    if (utilization > 0.5) return "Medium";
    return "Normal";
  }

  static getSystemStatus(predictions, alerts) {
    const highRiskCount = predictions.filter(
      (p) => p.overallRisk === "High",
    ).length;
    const criticalAlerts = alerts.filter(
      (a) => a.severity === "Critical",
    ).length;

    if (highRiskCount > 2 || criticalAlerts > 0) return "Critical";
    if (highRiskCount > 0 || alerts.length > 5) return "Warning";
    return "Normal";
  }

  static checkDataFreshness(logs, accidents) {
    const now = new Date();
    const latestLog = logs.length > 0 ? logs[0].timestamp : null;
    const latestAccident = accidents.length > 0 ? accidents[0].timestamp : null;

    const logAge = latestLog ? (now - latestLog) / (60 * 1000) : Infinity;
    const accidentAge = latestAccident
      ? (now - latestAccident) / (60 * 1000)
      : Infinity;

    const isFresh = Math.min(logAge, accidentAge) < 30; // 30 minutes
    return {
      isFresh,
      logAgeMinutes: Math.round(logAge),
      accidentAgeMinutes: Math.round(accidentAge),
      status: isFresh ? "Fresh" : "Stale",
    };
  }

  static async getPredictionAccuracy() {
    // Mock implementation - in real system would compare predictions with actual outcomes
    return Math.round(75 + Math.random() * 20);
  }

  static async getAlertResponseTime() {
    // Mock implementation
    return Math.round(15 + Math.random() * 30);
  }

  static async getAverageResponseTime() {
    // Mock implementation
    return Math.round(8 + Math.random() * 10);
  }

  static async getAveragePatientLoad() {
    const logs = await AmbulanceLog.find();
    if (logs.length === 0) return 0;
    const totalPatients = logs.reduce((sum, log) => sum + log.patientCount, 0);
    return Math.round(totalPatients / logs.length);
  }

  static async getUtilizationRate() {
    const hospitals = await Hospital.find();
    if (hospitals.length === 0) return 0;
    const totalCapacity = hospitals.reduce((sum, h) => sum + h.capacity, 0);
    const totalPatients = hospitals.reduce(
      (sum, h) => sum + h.currentPatients,
      0,
    );
    return Math.round((totalPatients / totalCapacity) * 100);
  }
}

module.exports = DashboardService;
