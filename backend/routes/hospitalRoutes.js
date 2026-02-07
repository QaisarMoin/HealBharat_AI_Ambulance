const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

// GET all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single hospital
router.get("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new hospital
router.post("/", async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update hospital
router.put("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE hospital
router.delete("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
