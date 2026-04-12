const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const CoordinatorActivityLog = require('../models/CoordinatorActivityLog');
const CoordinatorProfile = require('../models/CoordinatorProfile');

// ── Configuration ──────────────────────────────────────────────────────────
const LOW_PERFORMANCE_THRESHOLD = 5; // Total actions in 7 days
const TOP_PERFORMANCE_THRESHOLD = 20; // Total actions in 7 days
const ACTIVITY_WINDOW_DAYS = 7;
// ───────────────────────────────────────────────────────────────────────────

// Get assigned drives
const getAssignedDrives = async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    const drives = await Job.find({ assignedCoordinatorId: coordinatorId });
    res.status(200).json(drives);
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

module.exports = {
  getAssignedDrives,
  updateApplicationStatus,
  createInterviewSlot,
  assignStudentToSlot,
  logActivity,
  getMonitoringSummary
};
