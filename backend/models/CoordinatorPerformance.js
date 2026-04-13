const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date:    { type: String, required: true }, // 'YYYY-MM-DD'
  present: { type: Boolean, default: true },
  note:    { type: String, default: '' }
}, { _id: false });

const coordinatorPerformanceSchema = new mongoose.Schema({
  coordinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true   // one performance record per coordinator
  },

  // Performance badge assigned by admin
  badge: {
    type: String,
    enum: ['', 'Excellent', 'Good', 'Needs Attention'],
    default: ''
  },

  // Cumulative score — increases by +badgePoints each time admin saves badge
  score: { type: Number, default: 0 },

  // Attendance log entries
  attendance: { type: [attendanceSchema], default: [] },

  // Convenience counters
  totalPresent: { type: Number, default: 0 },
  totalAbsent:  { type: Number, default: 0 },

  // Admin notes
  adminNote: { type: String, default: '' }

}, { timestamps: true });

const BADGE_POINTS = { Excellent: 10, Good: 5, 'Needs Attention': 0 };
coordinatorPerformanceSchema.statics.BADGE_POINTS = BADGE_POINTS;

const CoordinatorPerformance = mongoose.model(
  'CoordinatorPerformance',
  coordinatorPerformanceSchema,
  'coordinatorperformance'   // explicit collection name as requested
);

console.log(`[Model Init] 'CoordinatorPerformance' model mapped to MongoDB collection: '${CoordinatorPerformance.collection.name}'`);
module.exports = CoordinatorPerformance;
