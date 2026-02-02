const mongoose = require("mongoose");

const accidentIncidentSchema = new mongoose.Schema(
  {
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
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "Severity must be one of: Low, Medium, High, Critical",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for zone and time-based queries
accidentIncidentSchema.index({ zone: 1, timestamp: -1 });
// Index for severity-based queries
accidentIncidentSchema.index({ severity: 1 });

module.exports = mongoose.model("AccidentIncident", accidentIncidentSchema);
