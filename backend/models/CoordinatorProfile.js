const mongoose = require('mongoose');

const coordinatorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String },
  phoneNumber: { type: String },
  stats: {
    tasksCompleted: { type: Number, default: 0 },
    interviewsScheduled: { type: Number, default: 0 },
    attendanceUpdates: { type: Number, default: 0 },
    statusUpdates: { type: Number, default: 0 },
    jobsManaged: { type: Number, default: 0 },
    totalActions: { type: Number, default: 0 }
  },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CoordinatorProfile', coordinatorProfileSchema);
