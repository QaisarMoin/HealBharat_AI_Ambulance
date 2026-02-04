const logger = require("../utils/logger");

// In-memory data store for testing
let mockData = {
  hospitals: [
    {
      id: "1",
      name: "City General Hospital",
      location: { lat: 28.6139, lng: 77.209 },
      capacity: 100,
      currentLoad: 45,
      availableBeds: 55,
      emergencyBeds: 20,
      status: "operational",
    },
    {
      id: "2",
      name: "District Medical Center",
      location: { lat: 28.5355, lng: 77.391 },
      capacity: 80,
      currentLoad: 60,
      availableBeds: 20,
      emergencyBeds: 10,
      status: "high_pressure",
    },
    {
      id: "3",
      name: "Regional Trauma Center",
      location: { lat: 28.7041, lng: 77.1025 },
      capacity: 150,
      currentLoad: 25,
      availableBeds: 125,
      emergencyBeds: 50,
      status: "low_pressure",
    },
  ],
  ambulanceLogs: [
    {
      id: "1",
      timestamp: new Date(Date.now() - 60000),
      location: { lat: 28.6139, lng: 77.209 },
      status: "available",
      hospitalId: "1",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 120000),
      location: { lat: 28.5355, lng: 77.391 },
      status: "on_mission",
      hospitalId: "2",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 180000),
      location: { lat: 28.7041, lng: 77.1025 },
      status: "available",
      hospitalId: "3",
    },
  ],
  accidentIncidents: [
    {
      id: "1",
      timestamp: new Date(Date.now() - 300000),
      location: { lat: 28.6139, lng: 77.209 },
      severity: "high",
      type: "road_accident",
      casualties: 3,
      description: "Multi-vehicle collision on main highway",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 600000),
      location: { lat: 28.5355, lng: 77.391 },
      severity: "medium",
      type: "fire_incident",
      casualties: 1,
      description: "Building fire in commercial area",
    },
  ],
  weatherContexts: [
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000),
      location: { lat: 28.6139, lng: 77.209 },
      temperature: 25,
      humidity: 65,
      precipitation: 0,
      windSpeed: 15,
      weatherCondition: "clear",
    },
  ],
  timeContexts: [
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000),
      hour: 14,
      dayOfWeek: 2,
      isWeekend: false,
      isHoliday: false,
      season: "summer",
    },
  ],
};

class MockDataService {
  // Hospital operations
  async getAllHospitals() {
    logger.info("Retrieving all hospitals from mock data");
    return mockData.hospitals;
  }

  async getHospitalById(id) {
    logger.info(`Retrieving hospital ${id} from mock data`);
    return mockData.hospitals.find((h) => h.id === id);
  }

  async updateHospitalLoad(id, load) {
    logger.info(`Updating hospital ${id} load to ${load}`);
    const hospital = mockData.hospitals.find((h) => h.id === id);
    if (hospital) {
      hospital.currentLoad = load;
      hospital.availableBeds = hospital.capacity - load;
      return hospital;
    }
    return null;
  }

  // Ambulance operations
  async getAmbulanceLogs(limit = 100) {
    logger.info(`Retrieving last ${limit} ambulance logs from mock data`);
    return mockData.ambulanceLogs.slice(-limit);
  }

  async addAmbulanceLog(log) {
    logger.info("Adding new ambulance log to mock data");
    const newLog = {
      id: String(mockData.ambulanceLogs.length + 1),
      ...log,
      timestamp: new Date(),
    };
    mockData.ambulanceLogs.push(newLog);
    return newLog;
  }

  // Incident operations
  async getRecentIncidents(limit = 50) {
    logger.info(`Retrieving last ${limit} incidents from mock data`);
    return mockData.accidentIncidents.slice(-limit);
  }

  async addIncident(incident) {
    logger.info("Adding new incident to mock data");
    const newIncident = {
      id: String(mockData.accidentIncidents.length + 1),
      ...incident,
      timestamp: new Date(),
    };
    mockData.accidentIncidents.push(newIncident);
    return newIncident;
  }

  // Weather operations
  async getRecentWeather(limit = 24) {
    logger.info(`Retrieving last ${limit} weather records from mock data`);
    return mockData.weatherContexts.slice(-limit);
  }

  async addWeatherData(weather) {
    logger.info("Adding new weather data to mock data");
    const newWeather = {
      id: String(mockData.weatherContexts.length + 1),
      ...weather,
      timestamp: new Date(),
    };
    mockData.weatherContexts.push(newWeather);
    return newWeather;
  }

  // Time operations
  async getRecentTimeContexts(limit = 24) {
    logger.info(`Retrieving last ${limit} time contexts from mock data`);
    return mockData.timeContexts.slice(-limit);
  }

  async addTimeContext(timeContext) {
    logger.info("Adding new time context to mock data");
    const newTimeContext = {
      id: String(mockData.timeContexts.length + 1),
      ...timeContext,
      timestamp: new Date(),
    };
    mockData.timeContexts.push(newTimeContext);
    return newTimeContext;
  }

  // Dashboard operations
  async getDashboardSummary() {
    logger.info("Generating dashboard summary from mock data");

    const totalHospitals = mockData.hospitals.length;
    const totalCapacity = mockData.hospitals.reduce(
      (sum, h) => sum + h.capacity,
      0,
    );
    const totalCurrentLoad = mockData.hospitals.reduce(
      (sum, h) => sum + h.currentLoad,
      0,
    );
    const totalAvailableBeds = mockData.hospitals.reduce(
      (sum, h) => sum + h.availableBeds,
      0,
    );

    const highPressureHospitals = mockData.hospitals.filter(
      (h) => h.status === "high_pressure",
    ).length;
    const availableAmbulances = mockData.ambulanceLogs.filter(
      (a) => a.status === "available",
    ).length;
    const onMissionAmbulances = mockData.ambulanceLogs.filter(
      (a) => a.status === "on_mission",
    ).length;

    const recentIncidents = mockData.accidentIncidents.filter(
      (i) => i.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000),
    ).length;

    return {
      totalHospitals,
      totalCapacity,
      totalCurrentLoad,
      totalAvailableBeds,
      highPressureHospitals,
      availableAmbulances,
      onMissionAmbulances,
      recentIncidents,
      lastUpdated: new Date(),
      status: highPressureHospitals > 0 ? "Warning" : "Normal",
    };
  }

  async getZonesData() {
    logger.info("Generating zones data from mock data");

    // Group hospitals by zones (simplified for demo)
    const zones = [
      {
        zone: "North",
        hospitals: mockData.hospitals.filter((h) => h.location.lat > 28.65),
        totalCapacity: mockData.hospitals
          .filter((h) => h.location.lat > 28.65)
          .reduce((sum, h) => sum + h.capacity, 0),
        currentLoad: mockData.hospitals
          .filter((h) => h.location.lat > 28.65)
          .reduce((sum, h) => sum + h.currentLoad, 0),
        availableBeds: mockData.hospitals
          .filter((h) => h.location.lat > 28.65)
          .reduce((sum, h) => sum + h.availableBeds, 0),
      },
      {
        zone: "South",
        hospitals: mockData.hospitals.filter((h) => h.location.lat <= 28.65),
        totalCapacity: mockData.hospitals
          .filter((h) => h.location.lat <= 28.65)
          .reduce((sum, h) => sum + h.capacity, 0),
        currentLoad: mockData.hospitals
          .filter((h) => h.location.lat <= 28.65)
          .reduce((sum, h) => sum + h.currentLoad, 0),
        availableBeds: mockData.hospitals
          .filter((h) => h.location.lat <= 28.65)
          .reduce((sum, h) => sum + h.availableBeds, 0),
      },
    ];

    return zones;
  }

  async getRealtimeData() {
    logger.info("Generating realtime data from mock data");

    return {
      activeIncidents: mockData.accidentIncidents.filter(
        (i) => i.timestamp > new Date(Date.now() - 60 * 60 * 1000),
      ),
      ambulanceStatus: {
        available: mockData.ambulanceLogs.filter(
          (a) => a.status === "available",
        ).length,
        onMission: mockData.ambulanceLogs.filter(
          (a) => a.status === "on_mission",
        ).length,
        maintenance: mockData.ambulanceLogs.filter(
          (a) => a.status === "maintenance",
        ).length,
      },
      hospitalStatus: mockData.hospitals.map((h) => ({
        id: h.id,
        name: h.name,
        status: h.status,
        loadPercentage: Math.round((h.currentLoad / h.capacity) * 100),
      })),
      lastUpdated: new Date(),
    };
  }

  // Utility methods
  async generateMockData() {
    logger.info("Generating additional mock data for testing");

    // Generate some additional ambulance logs
    for (let i = 0; i < 10; i++) {
      const log = {
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        location: {
          lat: 28.6 + Math.random() * 0.1,
          lng: 77.2 + Math.random() * 0.1,
        },
        status: ["available", "on_mission", "maintenance"][
          Math.floor(Math.random() * 3)
        ],
        hospitalId:
          mockData.hospitals[
            Math.floor(Math.random() * mockData.hospitals.length)
          ].id,
      };
      await this.addAmbulanceLog(log);
    }

    // Generate some additional incidents
    for (let i = 0; i < 5; i++) {
      const incident = {
        location: {
          lat: 28.6 + Math.random() * 0.1,
          lng: 77.2 + Math.random() * 0.1,
        },
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        type: ["road_accident", "fire_incident", "medical_emergency"][
          Math.floor(Math.random() * 3)
        ],
        casualties: Math.floor(Math.random() * 5) + 1,
        description: "Simulated incident for testing",
      };
      await this.addIncident(incident);
    }

    logger.info("Mock data generation completed");
  }
}

module.exports = new MockDataService();
