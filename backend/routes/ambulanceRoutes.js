const express = require("express");
const router = express.Router();
const Ambulance = require("../models/Ambulance");

// GET all ambulances
router.get("/", async (req, res) => {
  try {
    const ambulances = await Ambulance.find().populate("assignedHospital", "name");
    res.json({ success: true, data: ambulances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single ambulance
router.get("/:id", async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({ success: false, message: "Ambulance not found" });
    }
    res.json({ success: true, data: ambulance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new ambulance
router.post("/", async (req, res) => {
  try {
    const ambulance = await Ambulance.create(req.body);
    res.status(201).json({ success: true, data: ambulance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update ambulance
router.put("/:id", async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ambulance) {
      return res.status(404).json({ success: false, message: "Ambulance not found" });
    }
    res.json({ success: true, data: ambulance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE ambulance
router.delete("/:id", async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndDelete(req.params.id);
    if (!ambulance) {
      return res.status(404).json({ success: false, message: "Ambulance not found" });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
