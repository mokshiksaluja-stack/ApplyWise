const Interview = require('../models/Interview');
const Student = require('../models/Student');
const Job = require('../models/Job');

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate('studentId').populate('jobId');
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('studentId').populate('jobId');
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createInterview = async (req, res) => {
  try {
    const { studentId, jobId } = req.body;
    if (!studentId || !jobId) return res.status(400).json({ message: "studentId and jobId are required" });

    const studentExists = await Student.findById(studentId);
    if (!studentExists) return res.status(404).json({ message: "Student not found" });

    const jobExists = await Job.findById(jobId);
    if (!jobExists) return res.status(404).json({ message: "Job not found" });

    const newInterview = new Interview({
      ...req.body,
      studentName: studentExists.name,
      company: jobExists.company,
      role: jobExists.role,
      logo: jobExists.logo
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json({ message: "Interview deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
