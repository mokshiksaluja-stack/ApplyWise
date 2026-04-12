const CoordinatorProfile = require('../models/CoordinatorProfile');
const CoordinatorActivityLog = require('../models/CoordinatorActivityLog');
const User = require('../models/User');

/**
 * CoordinatorService
 * Centralized service for tracking and logging coordinator performance.
 */
const CoordinatorService = {
  /**
   * logActivity
   * ─────────────────────────────────────────────────────────────────────────────
   * Logs a coordinator action and increments their specific stats.
   * ─────────────────────────────────────────────────────────────────────────────
   */
  logActivity: async ({ coordinatorId, actionType, entityId, entityModel, details }) => {
    try {
      if (!coordinatorId) return;

      // 1. Create the activity log entry
      const logEntry = new CoordinatorActivityLog({
        coordinatorId,
        actionType,
        targetEntityId: entityId,
        targetEntityModel: entityModel,
        details
      });
      await logEntry.save();

      // 2. Map actionType to stat increment
      const statIncrements = { totalActions: 1 };
      
      const typeLower = actionType.toLowerCase();
      if (typeLower.includes('interview'))  statIncrements['stats.interviewsScheduled'] = 1;
      if (typeLower.includes('attendance')) statIncrements['stats.attendanceUpdates'] = 1;
      if (typeLower.includes('status'))     statIncrements['stats.statusUpdates'] = 1;
      if (typeLower.includes('assign'))     statIncrements['stats.jobsManaged'] = 1;
      if (typeLower.includes('task'))       statIncrements['stats.tasksCompleted'] = 1;

      // 3. Update or Create Coordinator Profile
      await CoordinatorProfile.findOneAndUpdate(
        { userId: coordinatorId },
        { 
          $inc: statIncrements,
          $set: { lastActive: new Date() }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`[CoordinatorService] Logged ${actionType} for ${coordinatorId}`);
    } catch (err) {
      console.error('[CoordinatorService] Error logging activity:', err);
    }
  }
};

module.exports = CoordinatorService;
