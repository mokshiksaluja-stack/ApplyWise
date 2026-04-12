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

exports.getStudentJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: { $in: ['Open', 'Ongoing'] }
    }).sort({
      isFeatured: -1,
      deadline: 1,
      createdAt: -1
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCoordinatorJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ 
      assignedCoordinatorId: req.params.coordinatorId 
    }).sort({ createdAt: -1 });
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
    
    // Validate required fields explicitly
    const { company, role, opportunityType, employmentMode } = req.body;
    if (!company || !role || !opportunityType || !employmentMode) {
      return res.status(400).json({ 
        message: "Validation error: company, role, opportunityType, and employmentMode are required fields" 
      });
    }

    const job = new Job(req.body);
    await job.save();
    console.log(`[Flow] Job Created: ${job.role} at ${job.company}`);
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
    const { coordinatorId, coordinatorName } = req.body; // null = unassign
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: { 
          assignedCoordinatorId: coordinatorId || null,
          assignedCoordinatorName: coordinatorName || null 
        } 
      },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    console.log(`[Flow] Coordinator Assigned: Job ${req.params.id} assigned to ${coordinatorName || 'None'}`);
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
