const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema(
  {
    ambulanceId: {
      type: String,
      required: [true, "Ambulance ID is required"],
      unique: true,
      trim: true,
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
    assignedHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: false, // Can be unassigned or roaming
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Available", "Busy", "Maintenance"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
ambulanceSchema.index({ zone: 1 });
ambulanceSchema.index({ status: 1 });

module.exports = mongoose.model("Ambulance", ambulanceSchema);
