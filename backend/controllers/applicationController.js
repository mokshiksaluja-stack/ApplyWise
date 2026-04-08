const Application = require('../models/Application');
const Student = require('../models/Student');
const Job = require('../models/Job');

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('studentId').populate('jobId');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('studentId').populate('jobId');
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const { studentId, jobId } = req.body;
    if (!studentId || !jobId) return res.status(400).json({ message: "studentId and jobId are required" });

    const studentExists = await Student.findById(studentId);
    if (!studentExists) return res.status(404).json({ message: "Student not found" });

    const jobExists = await Job.findById(jobId);
    if (!jobExists) return res.status(404).json({ message: "Job not found" });

    const newApp = new Application({
      ...req.body,
      studentName: studentExists.name,
      company: jobExists.company,
      role: jobExists.role,
      logo: jobExists.logo
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
