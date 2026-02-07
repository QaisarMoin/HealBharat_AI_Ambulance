const express = require("express");
const router = express.Router();
const AccidentIncident = require("../models/AccidentIncident");

// GET all incidents
router.get("/", async (req, res) => {
  try {
    const incidents = await AccidentIncident.find().sort({ timestamp: -1 });
    res.json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new incident
router.post("/", async (req, res) => {
  try {
    const incident = await AccidentIncident.create(req.body);
    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update incident
router.put("/:id", async (req, res) => {
  try {
    const incident = await AccidentIncident.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!incident) {
      return res
        .status(404)
        .json({ success: false, message: "Incident not found" });
    }
    res.json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE incident
router.delete("/:id", async (req, res) => {
  try {
    const incident = await AccidentIncident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res
        .status(404)
        .json({ success: false, message: "Incident not found" });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
