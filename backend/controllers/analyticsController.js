const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const CoordinatorActivityLog = require('../models/CoordinatorActivityLog');
const CoordinatorProfile = require('../models/CoordinatorProfile');

/**
 * GET /api/analytics/dashboard
 * Returns aggregated metrics for the Admin Dashboard:
 *   - topLevelStats: total students, applications, opportunities, selection rate
 *   - applicationsByCompany: [] for bar chart
 *   - successRateByRole: [] for bar chart
 *   - coordinatorPerformance: [] per coordinator
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { company, role, from, to } = req.query;

    // ── Date range filter ──────────────────────────────────────────────────
    const dateFilter = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to)   dateFilter.createdAt.$lte = new Date(to);
    }

    const appFilter = { ...dateFilter };
    if (company) appFilter.company = { $regex: company, $options: 'i' };
    if (role)    appFilter.role    = { $regex: role,    $options: 'i' };

    // ── Top-level counts ───────────────────────────────────────────────────
    const [totalStudents, totalApplications, totalOpportunities] = await Promise.all([
      Student.countDocuments(),
      Application.countDocuments(appFilter),
      Job.countDocuments(),
    ]);

    const selectedCount = await Application.countDocuments({ ...appFilter, status: 'Selected' });
    const selectionRate = totalApplications > 0
      ? Math.round((selectedCount / totalApplications) * 100)
      : 0;

    // ── Applications per company ───────────────────────────────────────────
    const appsByCompany = await Application.aggregate([
      { $match: appFilter },
      { $group: { _id: '$company', applications: { $sum: 1 }, selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } } } },
      { $sort: { applications: -1 } },
      { $limit: 10 },
      { $project: { company: '$_id', applications: 1, selected: 1, _id: 0 } }
    ]);

    // ── Success rate per role ──────────────────────────────────────────────
    const successByRole = await Application.aggregate([
      { $match: appFilter },
      { $group: { _id: '$role', total: { $sum: 1 }, selected: { $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] } } } },
      { $sort: { total: -1 } },
      { $limit: 8 },
      { $project: {
        role: '$_id',
        total: 1,
        selected: 1,
        successRate: { $cond: [{ $gt: ['$total', 0] }, { $round: [{ $multiply: [{ $divide: ['$selected', '$total'] }, 100] }, 0] }, 0] },
        _id: 0
      }}
    ]);

    // ── Status Normalization Map ──────────────────────────────────────────
    const statusLabels = {
      'Applied': 'Applied',
      'Shortlisted': 'Shortlisted',
      'Interview Scheduled': 'Scheduled',
      'Selected': 'Selected',
      'Rejected': 'Rejected'
    };

    // ── Student status distribution (bucketed) ──────────────────────────
    const statusDistRaw = await Application.aggregate([
      { $match: appFilter },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    // Map and ensure reasonable names
    const statusDistribution = statusDistRaw.map(s => ({
      name: statusLabels[s.name] || s.name,
      value: s.value
    }));

    // If empty, provide a clean default
    if (statusDistribution.length === 0) {
      statusDistribution.push({ name: 'No Data', value: 0 });
    }

    // ── Coordinator performance ────────────────────────────────────────────
    const coordinatorLogs = await CoordinatorActivityLog.aggregate([
      { $group: {
        _id: '$coordinatorId',
        totalActions: { $sum: 1 },
        interviews: { $sum: { $cond: [{ $regexMatch: { input: '$actionType', regex: /interview/i } }, 1, 0] } },
        attendance: { $sum: { $cond: [{ $regexMatch: { input: '$actionType', regex: /attendance/i } }, 1, 0] } },
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: {
        coordinatorId: '$_id',
        name: { $ifNull: ['$user.email', 'Unknown'] },
        tasksCompleted: '$totalActions',
        interviewsScheduled: '$interviews',
        attendanceHandled: '$attendance',
        _id: 0
      }}
    ]);

    res.json({
      success: true,
      topLevelStats: { 
        totalStudents, 
        totalApplications, 
        totalOpportunities, 
        selectionRate,
        filteredSelected: selectedCount
      },
      applicationsByCompany: appsByCompany.length > 0 ? appsByCompany : [],
      successRateByRole: successByRole.length > 0 ? successByRole : [],
      statusDistribution: statusDistribution,
      coordinatorPerformance: coordinatorLogs.length > 0 ? coordinatorLogs : [],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Analytics error', error: err.message });
  }
};
