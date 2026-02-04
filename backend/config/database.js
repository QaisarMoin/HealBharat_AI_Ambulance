const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Database connection error:", error);
    logger.warn("Falling back to mock data service for testing");
    // Don't exit - continue with mock data service
  }
};

module.exports = connectDB;
