const mongoose = require("mongoose");

const weatherContextSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      unique: true,
    },
    condition: {
      type: String,
      required: [true, "Weather condition is required"],
      enum: {
        values: ["Clear", "Rainy", "Stormy", "Foggy", "Snowy"],
        message:
          "Weather condition must be one of: Clear, Rainy, Stormy, Foggy, Snowy",
      },
    },
    temperature: {
      type: Number,
      min: [-50, "Temperature cannot be below -50"],
      max: [50, "Temperature cannot exceed 50"],
    },
    humidity: {
      type: Number,
      min: [0, "Humidity cannot be negative"],
      max: [100, "Humidity cannot exceed 100"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for date-based queries
weatherContextSchema.index({ date: 1 });

module.exports = mongoose.model("WeatherContext", weatherContextSchema);
