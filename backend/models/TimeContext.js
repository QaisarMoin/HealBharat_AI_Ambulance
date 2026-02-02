const mongoose = require("mongoose");

const timeContextSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
      unique: true,
    },
    season: {
      type: String,
      required: [true, "Season is required"],
      enum: {
        values: ["Summer", "Monsoon", "Winter"],
        message: "Season must be one of: Summer, Monsoon, Winter",
      },
    },
    isFestival: {
      type: Boolean,
      default: false,
    },
    festivalName: {
      type: String,
      trim: true,
      maxlength: [50, "Festival name cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for date-based queries
timeContextSchema.index({ date: 1 });

module.exports = mongoose.model("TimeContext", timeContextSchema);
