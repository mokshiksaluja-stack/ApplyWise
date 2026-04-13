const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const CoordinatorActivityLog = require('../models/CoordinatorActivityLog');
const CoordinatorProfile = require('../models/CoordinatorProfile');
const CoordinatorPerformance = require('../models/CoordinatorPerformance');
const User = require('../models/User');

// ── Configuration ──────────────────────────────────────────────────────────
const LOW_PERFORMANCE_THRESHOLD = 5;
const TOP_PERFORMANCE_THRESHOLD = 20;
const ACTIVITY_WINDOW_DAYS = 7;
const CoordinatorTask = require('../models/CoordinatorTask');

// List all coordinator users (for Admin assignment dropdown)
const listCoordinators = async (req, res) => {
  try {
    const coordinators = await User.find({ role: 'coordinator' }).select('_id email name');
    res.json(coordinators.map(c => ({
      id: c._id,
      name: c.name || c.email.split('@')[0], // fallback to email prefix if no name
      email: c.email
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get assigned drives with live applicant counts
const getAssignedDrives = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { coordinatorId } = req.params;
    if (!coordinatorId || !mongoose.Types.ObjectId.isValid(coordinatorId)) {
      return res.status(200).json([]);
    }
    const drives = await Job.find({ assignedCoordinatorId: coordinatorId }).sort({ createdAt: -1 });
    
    // Attach live applicant counts for each drive
    const drivesWithCounts = await Promise.all(drives.map(async (drive) => {
      const count = await Application.countDocuments({ jobId: drive._id });
      return { ...drive.toObject(), applicantCount: count };
    }));
    
    res.status(200).json(drivesWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get pending tasks for a specific coordinator
const getCoordinatorTasks = async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    const tasks = await CoordinatorTask.find({ coordinatorId, status: 'Pending' }).sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ALL pending tasks (for Admin Dashboard)
const getAllPendingTasks = async (req, res) => {
  try {
    const tasks = await CoordinatorTask.find()
      .populate('coordinatorId', 'email name')
      .sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new task and assign to a coordinator (Admin action)
const createTask = async (req, res) => {
  try {
    const { coordinatorId, title, description, deadline, priority } = req.body;
    if (!coordinatorId || !title) {
      return res.status(400).json({ error: 'coordinatorId and title are required' });
    }
    const task = new CoordinatorTask({ coordinatorId, title, description, deadline, priority: priority || 'Medium' });
    await task.save();
    const populated = await task.populate('coordinatorId', 'email name');
    console.log(`[Flow] Task Created: "${title}" assigned to coordinator ${coordinatorId}`);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update task status (coordinator marks complete)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await CoordinatorTask.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Application Management
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, attendance, currentRound, roundResult } = req.body;
    
    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { $set: { status, attendance, currentRound, roundResult } },
      { new: true }
    );
    res.status(200).json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Scheduler functionalities
const createInterviewSlot = async (req, res) => {
  try {
    const { jobId, company, role, date, time, venue, mode, reportingTime } = req.body;
    const newInterview = new Interview({
      jobId, company, role, date, time, venue, mode, reportingTime
    });
    
    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assignStudentToSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { studentId, studentName } = req.body;
    
    const interview = await Interview.findById(slotId);
    if (!interview) return res.status(404).json({ error: "Slot not found" });

    // Since our existing schema binds Interview directly to one student via model requirement, 
    // we would create individualized Interview documents per student assigned to this "slot params"
    const newInterviewAssignment = new Interview({
      studentId,
      studentName,
      jobId: interview.jobId,
      company: interview.company,
      role: interview.role,
      date: interview.date,
      time: interview.time,
      venue: interview.venue,
      mode: interview.mode,
      reportingTime: interview.reportingTime,
      slotId: interview._id,
      status: 'Upcoming'
    });

    await newInterviewAssignment.save();
    res.status(201).json(newInterviewAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logActivity = async (req, res) => {
  try {
    const { coordinatorId, actionType, details } = req.body;
    const log = new CoordinatorActivityLog({ coordinatorId, actionType, details });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * getMonitoringSummary
 * Admin-only: Returns performance metrics and tiering for all coordinators.
 */
const getMonitoringSummary = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - ACTIVITY_WINDOW_DAYS);

    // 1. Fetch all profiles
    const profiles = await CoordinatorProfile.find().populate('userId', 'email');

    // 2. Compute recent activity counts per coordinator
    const recentActivity = await CoordinatorActivityLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$coordinatorId', count: { $sum: 1 } } }
    ]);

    const recentMap = {};
    recentActivity.forEach(item => {
      recentMap[item._id.toString()] = item.count;
    });

    // 3. Process and Tier
    const summary = profiles.map(profile => {
      const recentCount = recentMap[profile.userId?._id?.toString()] || 0;
      
      let tier = 'Active';
      if (recentCount >= TOP_PERFORMANCE_THRESHOLD) tier = 'Top Performer';
      else if (recentCount < LOW_PERFORMANCE_THRESHOLD) tier = 'Needs Attention';

      return {
        id: profile._id,
        coordinatorId: profile.userId?._id,
        name: profile.name,
        email: profile.userId?.email,
        stats: profile.stats,
        lastActive: profile.lastActive,
        recentActivityCount: recentCount,
        tier
      };
    });

    // 4. Activity Feed (Last 15 system-wide coordinator actions)
    const recentLogs = await CoordinatorActivityLog.find()
      .populate('coordinatorId', 'email')
      .sort({ createdAt: -1 })
      .limit(15);

    res.json({
      success: true,
      leaderboard: [...summary].sort((a, b) => b.stats.totalActions - a.stats.totalActions).slice(0, 5),
      fullMetrics: summary,
      activityFeed: recentLogs,
      config: {
        lowThreshold: LOW_PERFORMANCE_THRESHOLD,
        topThreshold: TOP_PERFORMANCE_THRESHOLD,
        windowDays: ACTIVITY_WINDOW_DAYS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Coordinator Performance ─────────────────────────────────────────────────

// GET /performance/:coordinatorId — fetch or create a performance record
const getPerformance = async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    let record = await CoordinatorPerformance.findOne({ coordinatorId });
    if (!record) {
      record = await CoordinatorPerformance.create({ coordinatorId });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /performance — fetch all performance records (for monitor page)
const getAllPerformance = async (req, res) => {
  try {
    const records = await CoordinatorPerformance.find()
      .populate('coordinatorId', 'email name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /performance/:coordinatorId/attendance — mark attendance for a date
const markAttendance = async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    const { date, present, note } = req.body;
    if (!date) return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });

    let record = await CoordinatorPerformance.findOne({ coordinatorId });
    if (!record) record = new CoordinatorPerformance({ coordinatorId });

    // Remove existing entry for same date (upsert by date)
    const prevEntry = record.attendance.find(a => a.date === date);
    const wasPresentBefore = prevEntry ? prevEntry.present : null;
    record.attendance = record.attendance.filter(a => a.date !== date);
    record.attendance.push({ date, present: !!present, note: note || '' });

    // Recompute totals from scratch
    record.totalPresent = record.attendance.filter(a => a.present).length;
    record.totalAbsent  = record.attendance.filter(a => !a.present).length;

    await record.save();
    console.log(`[Attendance] Coordinator ${coordinatorId} marked ${present ? 'Present' : 'Absent'} on ${date}`);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /performance/:coordinatorId/badge — assign badge and increment score
const assignBadge = async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    const { badge, adminNote } = req.body;
    const VALID = ['Excellent', 'Good', 'Needs Attention', ''];
    if (!VALID.includes(badge)) {
      return res.status(400).json({ error: `badge must be one of: ${VALID.filter(Boolean).join(', ')}` });
    }

    let record = await CoordinatorPerformance.findOne({ coordinatorId });
    if (!record) record = new CoordinatorPerformance({ coordinatorId });

    // Points map — only increase on badge assignment
    const POINTS = { Excellent: 10, Good: 5, 'Needs Attention': 0 };
    const earned = POINTS[badge] ?? 0;
    record.score += earned;   // score only ever increases
    record.badge = badge;
    if (adminNote !== undefined) record.adminNote = adminNote;

    await record.save();
    console.log(`[Badge] Coordinator ${coordinatorId} → badge: ${badge}, +${earned} pts, total: ${record.score}`);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listCoordinators,
  getAssignedDrives,
  getCoordinatorTasks,
  getAllPendingTasks,
  createTask,
  updateTaskStatus,
  updateApplicationStatus,
  createInterviewSlot,
  assignStudentToSlot,
  logActivity,
  getMonitoringSummary,
  // Performance
  getPerformance,
  getAllPerformance,
  markAttendance,
  assignBadge,
};
