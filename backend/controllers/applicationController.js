const Application = require('../models/Application');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const CoordinatorService = require('../services/coordinatorService');

exports.getApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = { $regex: req.query.company, $options: 'i' };
    if (req.query.role) filter.role = { $regex: req.query.role, $options: 'i' };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.round) filter.currentRound = { $regex: req.query.round, $options: 'i' };

    const applications = await Application.find(filter)
      .populate('studentId', 'fullName name enrollmentNumber branch degree cgpa')
      .populate('jobId', 'company role')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getOpportunityApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.opportunityId })
      .populate('studentId', 'fullName name enrollmentNumber branch degree cgpa')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getCoordinatorApplications = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { coordinatorId } = req.params;
    if (!coordinatorId || !mongoose.Types.ObjectId.isValid(coordinatorId)) {
      return res.json([]);
    }
    // Find all jobs assigned to this coordinator
    const assignedJobs = await Job.find({ assignedCoordinatorId: coordinatorId }).select('_id');
    const jobIds = assignedJobs.map(j => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('studentId', 'fullName name enrollmentNumber branch degree cgpa')
      .populate('jobId', 'company role')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getStudentApplications = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { studentId } = req.params;
    // Guard against invalid ObjectId strings (e.g. "null", "undefined", malformed)
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.json([]);
    }
    const applications = await Application.find({ studentId })
      .populate('jobId', 'company role')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('studentId', 'fullName name enrollmentNumber branch degree cgpa')
      .populate('jobId', 'company role');
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

    // --- Backend Validations ---
    if (jobExists.isDraft) {
      return res.status(400).json({ message: "Cannot apply: This opportunity is still a draft." });
    }
    if (jobExists.status !== 'Open' && jobExists.status !== 'Ongoing') {
      return res.status(400).json({ message: `Cannot apply: This opportunity is ${jobExists.status}.` });
    }
    if (jobExists.deadline && new Date(jobExists.deadline) < new Date()) {
      return res.status(400).json({ message: "Cannot apply: The deadline for this opportunity has passed." });
    }

    const existingApp = await Application.findOne({ studentId, jobId });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied for this opportunity." });
    }
    // ---------------------------

    const newApp = new Application({
      ...req.body,
      studentName: studentExists.name,
      company: jobExists.company,
      role: jobExists.role,
      logo: jobExists.logo
    });

    await newApp.save();
    console.log(`[Flow] Application Created: Student ${studentExists.name} applied for ${jobExists.company}`);
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

// ── Coordinator Actions ────────────────────────────────────────────────────

// Notification helper — fire-and-forget, never blocks response
const createStudentNotification = async (receiverId, title, message, type = 'General') => {
  try {
    await Notification.create({ receiverId, title, message, type });
    console.log(`[Flow] Notification Created: Delivered to ${receiverId} [${type}]`);
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

// Controlled Transition Model - Defined as a formal constant for absolute state control
const STATUS_TRANSITION_MAP = {
  'Applied': ['Shortlisted', 'In Progress', 'Rejected', 'Absent', 'Interview Scheduled'],
  'Shortlisted': ['Interview Scheduled', 'In Progress', 'Rejected', 'Absent'],
  'Interview Scheduled': ['In Progress', 'Rejected', 'Absent'],
  'In Progress': ['In Progress', 'Selected', 'Rejected', 'Absent'],
  'Absent': ['Interview Scheduled', 'Rejected'], // Allow re-scheduling if absent
  'Rejected': [], // Terminal State: No further transitions allowed
  'Selected': []  // Terminal State: Final outcome achieved
};

const validateTransition = (currentStatus, nextStatus) => {
  if (currentStatus === nextStatus) return true;
  const allowed = STATUS_TRANSITION_MAP[currentStatus] || [];
  return allowed.includes(nextStatus);
};

// Status transition notification messages - Specific and Contextual
const getStatusNotification = (status, currentRound, company, role) => {
  const ctx = `${company} — ${role}`;
  switch (status) {
    case 'Shortlisted':
      return { 
        title: 'Application Shortlisted! 📄', 
        message: `Great news! You have been shortlisted for the ${role} position at ${company}. Please monitor your dashboard for the upcoming interview schedule.`, 
        type: 'Result' 
      };
    case 'Selected':
      return { 
        title: '🎉 Congratulations! You are Selected', 
        message: `We are thrilled to inform you that you have successfully cleared all rounds and secured the ${role} position at ${company}! Your hard work and dedication have truly paid off.`, 
        type: 'Result' 
      };
    case 'Rejected':
      return { 
        title: `Update: ${company} Recruitment`, 
        message: `Thank you for your interest in the ${role} role. At this stage, the team has decided to move forward with other candidates. We appreciate your efforts and wish you the best for future opportunities.`, 
        type: 'Result' 
      };
    case 'Absent':
      return {
        title: 'Attendance Alert: Absent ⚠️',
        message: `You were recorded as Absent for your scheduled interview at ${company} for the ${role} role. If there was an emergency, please contact the placement cell or your coordinator immediately.`,
        type: 'Alert'
      };
    default:
      if (currentRound && status === 'In Progress') {
        return { 
          title: 'Round Cleared! 🚀', 
          message: `Excellent work! You have cleared the previous evaluation stage and moved to ${currentRound} for the ${role} role at ${company}. Keep up the momentum!`, 
          type: 'Result' 
        };
      }
      return null;
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, roundResult, currentRound } = req.body;

    if (!status) return res.status(400).json({ message: "status is required" });

    // 1. Fetch current application to check transition validity
    const currentApp = await Application.findById(req.params.id);
    if (!currentApp) return res.status(404).json({ message: "Application not found" });

    // Formal Guard: Enforce controlled transition map
    if (!validateTransition(currentApp.status, status)) {
      return res.status(400).json({ message: `Invalid transition: Cannot move application from ${currentApp.status} to ${status}` });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: { status, ...(roundResult && { roundResult }), ...(currentRound && { currentRound }) } },
      { new: true }
    );

    // Auto-create student notification for key transitions
    const notif = getStatusNotification(status, currentRound || app.currentRound, app.company, app.role);
    if (notif) {
      await createStudentNotification(app.studentId, notif.title, notif.message, notif.type);
    }

    // Track Coordinator Activity
    if (req.user && req.user.role === 'coordinator') {
      await CoordinatorService.logActivity({
        coordinatorId: req.user.id,
        actionType: 'Status Update',
        entityId: app._id,
        entityModel: 'Application',
        details: `Updated status to ${status}${currentRound ? ` (Round: ${currentRound})` : ''}`
      });
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  try {
    const { interviewDate, reportingTime, roomNumber, venue, coordinatorNotes } = req.body;
    const resolvedVenue = venue || roomNumber;

    const currentApp = await Application.findById(req.params.id);
    if (!currentApp) return res.status(404).json({ message: "Application not found" });

    // Guard: Validate transition to 'Interview Scheduled'
    if (!validateTransition(currentApp.status, 'Interview Scheduled')) {
      return res.status(400).json({ message: `Invalid action: Cannot schedule interview when status is ${currentApp.status}` });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: 'Interview Scheduled',
          interviewDate,
          reportingTime,
          venue: resolvedVenue,
          coordinatorNotes: coordinatorNotes || ''
        }
      },
      { new: true }
    );

    // Auto-create student notification
    await createStudentNotification(
      app.studentId,
      'Interview Scheduled 📅',
      `Your interview for ${app.company} (${app.role}) has been scheduled for ${interviewDate} at ${reportingTime}. Venue: ${resolvedVenue}. Good luck!`,
      'Interview'
    );

    // Track Coordinator Activity
    if (req.user && req.user.role === 'coordinator') {
      await CoordinatorService.logActivity({
        coordinatorId: req.user.id,
        actionType: 'Schedule Interview',
        entityId: app._id,
        entityModel: 'Application',
        details: `Scheduled interview on ${interviewDate} at ${resolvedVenue}`
      });
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;
    if (!['Present', 'Absent', 'Pending'].includes(attendance)) {
      return res.status(400).json({ message: "Invalid attendance value" });
    }

    const currentApp = await Application.findById(req.params.id);
    if (!currentApp) return res.status(404).json({ message: "Application not found" });

    const updateFields = { attendance };
    
    // Automatic status update to 'Absent' if marked absent
    if (attendance === 'Absent') {
      // Guard: Ensure transition to 'Absent' is valid
      if (!validateTransition(currentApp.status, 'Absent')) {
        return res.status(400).json({ message: `Invalid action: Cannot mark as Absent when status is ${currentApp.status}` });
      }
      updateFields.status = 'Absent';
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    // Notify student if marked Absent
    if (attendance === 'Absent') {
      const notif = getStatusNotification('Absent', null, app.company, app.role);
      await createStudentNotification(app.studentId, notif.title, notif.message, notif.type);
    }

    // Track Coordinator Activity
    if (req.user && req.user.role === 'coordinator') {
      await CoordinatorService.logActivity({
        coordinatorId: req.user.id,
        actionType: 'Attendance Update',
        entityId: app._id,
        entityModel: 'Application',
        details: `Marked attendance as ${attendance}`
      });
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.advanceRound = async (req, res) => {
  try {
    const { nextRound, previousRoundResult } = req.body;

    if (!nextRound) return res.status(400).json({ message: "nextRound is required" });

    const currentApp = await Application.findById(req.params.id);
    if (!currentApp) return res.status(404).json({ message: "Application not found" });

    // Guard: Validate transition to 'In Progress' for round advancement
    if (!validateTransition(currentApp.status, 'In Progress')) {
      return res.status(400).json({ message: `Invalid action: Cannot advance round when status is ${currentApp.status}` });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          currentRound: nextRound,
          roundResult: previousRoundResult || 'Cleared',
          status: 'In Progress'
        }
      },
      { new: true }
    );

    // Auto-notify student
    const notif = getStatusNotification('In Progress', nextRound, app.company, app.role);
    if (notif) {
      await createStudentNotification(app.studentId, notif.title, notif.message, notif.type);
    }

    // Track Coordinator Activity
    if (req.user && req.user.role === 'coordinator') {
      await CoordinatorService.logActivity({
        coordinatorId: req.user.id,
        actionType: 'Round Advance',
        entityId: app._id,
        entityModel: 'Application',
        details: `Advanced to ${nextRound} (Previous stage marked as ${previousRoundResult || 'Cleared'})`
      });
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
