const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
      maxlength: [100, "Hospital name cannot exceed 100 characters"],
    },
    zone: {
      type: String,
      required: [true, "Zone is required"],
      trim: true,
      enum: {
        values: ["North", "South", "East", "West", "Central"],
        message: "Zone must be one of: North, South, East, West, Central",
      },
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
      max: [1000, "Capacity cannot exceed 1000"],
    },
    currentLoad: {
      type: Number,
      default: 0,
      min: [0, "Current load cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries by zone
hospitalSchema.index({ zone: 1 });

module.exports = mongoose.model("Hospital", hospitalSchema);
