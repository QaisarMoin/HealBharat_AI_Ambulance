const mongoose = require("mongoose");

const ambulanceLogSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital reference is required"],
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
    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now,
    },
    patientCount: {
      type: Number,
      required: [true, "Patient count is required"],
      min: [1, "Patient count must be at least 1"],
      max: [10, "Patient count cannot exceed 10"],
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient queries by hospital and time
ambulanceLogSchema.index({ hospital: 1, timestamp: -1 });
// Index for zone-based queries
ambulanceLogSchema.index({ zone: 1, timestamp: -1 });

module.exports = mongoose.model("AmbulanceLog", ambulanceLogSchema);
