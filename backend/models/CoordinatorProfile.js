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
  isActive: { type: Boolean, default: true },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null }
}, { timestamps: true });

const CoordinatorProfileModel = mongoose.model('CoordinatorProfile', coordinatorProfileSchema, 'coordinatorprofiles');
console.log(`[Model Init] 'CoordinatorProfile' model mapped directly to MongoDB collection: '${CoordinatorProfileModel.collection.name}'`);
module.exports = CoordinatorProfileModel;
