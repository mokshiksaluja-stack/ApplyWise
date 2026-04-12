const Job = require('../models/Job');
const CoordinatorService = require('../services/coordinatorService');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── Admin → Coordinator Assignment ────────────────────────────────────────

exports.assignCoordinator = async (req, res) => {
  try {
    const { coordinatorId } = req.body; // null = unassign
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: { assignedCoordinatorId: coordinatorId || null } },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
