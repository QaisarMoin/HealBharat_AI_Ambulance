const Joi = require("joi");

/**
 * Input sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  // Remove any potentially dangerous characters from query parameters
  if (req.query && typeof req.query === "object") {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = req.query[key].replace(/[<>\"'&]/g, "");
      }
    });
  }

  // Remove any potentially dangerous characters from body parameters
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].replace(/[<>\"'&]/g, "");
      }
    });
  }

  next();
};

/**
 * Rate limiting helper (simple implementation)
 */
const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(ip)) {
      const userRequests = requests.get(ip);
      const validRequests = userRequests.filter((time) => time > windowStart);
      requests.set(ip, validRequests);
    }

    // Check current request count
    const currentRequests = requests.get(ip) || [];
    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    // Add current request
    currentRequests.push(now);
    requests.set(ip, currentRequests);

    next();
  };
};

/**
 * Validate alert parameters
 */
const validateAlertParams = (req, res, next) => {
  const schema = Joi.object({
    zone: Joi.string()
      .valid("North", "South", "East", "West", "Central")
      .optional(),
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid parameters",
      error: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Validate dashboard parameters
 */
const validateDashboardParams = (req, res, next) => {
  const schema = Joi.object({
    timeRange: Joi.string()
      .valid("1h", "6h", "24h", "7d", "30d")
      .default("24h"),
    zone: Joi.string()
      .valid("North", "South", "East", "West", "Central")
      .optional(),
    hospitalId: Joi.string().optional(),
    metric: Joi.string()
      .valid("pressure", "risk", "utilization")
      .default("pressure"),
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      error: error.details.map((detail) => detail.message),
    });
  }
  next();
};

/**
 * Validate data import
 */
const validateDataImport = (req, res, next) => {
  // Basic validation for data import endpoints
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No data provided for import",
    });
  }

  next();
};

/**
 * Validate hospital data
 */
const validateHospitalData = (hospital) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    zone: Joi.string()
      .valid("North", "South", "East", "West", "Central")
      .required(),
    capacity: Joi.number().integer().min(1).max(1000).required(),
    currentPatients: Joi.number().integer().min(0).max(1000).default(0),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    type: Joi.string()
      .valid("General", "Trauma", "Specialized")
      .default("General"),
    contact: Joi.object({
      phone: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .optional(),
      email: Joi.string().email().optional(),
    }).optional(),
  });

  return schema.validate(hospital);
};

/**
 * Validate ambulance log data
 */
const validateAmbulanceLogData = (log) => {
  const schema = Joi.object({
    hospitalId: Joi.string().required(),
    zone: Joi.string()
      .valid("North", "South", "East", "West", "Central")
      .required(),
    patientCount: Joi.number().integer().min(0).max(10).required(),
    arrivalTime: Joi.date().iso().required(),
    departureTime: Joi.date().iso().optional(),
    ambulanceType: Joi.string()
      .valid("Basic", "Advanced", "Critical")
      .default("Basic"),
    priority: Joi.string()
      .valid("Low", "Medium", "High", "Critical")
      .default("Medium"),
  });

  return schema.validate(log);
};

/**
 * Validate accident data
 */
const validateAccidentData = (accident) => {
  const schema = Joi.object({
    zone: Joi.string()
      .valid("North", "South", "East", "West", "Central")
      .required(),
    severity: Joi.string()
      .valid("Low", "Medium", "High", "Critical")
      .required(),
    type: Joi.string()
      .valid("Road", "Industrial", "Medical", "Other")
      .required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    victimCount: Joi.number().integer().min(1).max(100).required(),
    timestamp: Joi.date().iso().required(),
    description: Joi.string().max(500).optional(),
  });

  return schema.validate(accident);
};

/**
 * Validate weather data
 */
const validateWeatherData = (weather) => {
  const schema = Joi.object({
    date: Joi.date().iso().required(),
    zone: Joi.string()
      .valid("North", "South", "East", "West", "Central")
      .required(),
    temperature: Joi.number().min(-50).max(50).required(),
    humidity: Joi.number().min(0).max(100).required(),
    condition: Joi.string()
      .valid("Sunny", "Cloudy", "Rainy", "Stormy", "Foggy", "Snowy")
      .required(),
    windSpeed: Joi.number().min(0).max(200).default(0),
    visibility: Joi.number().min(0).max(10000).default(10000),
  });

  return schema.validate(weather);
};

/**
 * Validate time context data
 */
const validateTimeData = (time) => {
  const schema = Joi.object({
    date: Joi.date().iso().required(),
    hour: Joi.number().integer().min(0).max(23).required(),
    dayOfWeek: Joi.number().integer().min(0).max(6).required(),
    isWeekend: Joi.boolean().required(),
    isHoliday: Joi.boolean().default(false),
    isFestival: Joi.boolean().default(false),
    season: Joi.string().valid("Summer", "Monsoon", "Winter").required(),
    rushHour: Joi.boolean().default(false),
  });

  return schema.validate(time);
};

module.exports = {
  validateAlertParams,
  validateDashboardParams,
  validateDataImport,
  validateHospitalData,
  validateAmbulanceLogData,
  validateAccidentData,
  validateWeatherData,
  validateTimeData,
  sanitizeInput,
  rateLimit,
};
