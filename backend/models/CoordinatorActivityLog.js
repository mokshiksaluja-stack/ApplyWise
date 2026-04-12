const mongoose = require('mongoose');

const coordinatorActivityLogSchema = new mongoose.Schema({
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true }, // e.g. 'Marked Attendance', 'Scheduled Interview'
  targetEntityId: { type: mongoose.Schema.Types.ObjectId }, // Flexible: could map to Application, Job, Interview
  targetEntityModel: { type: String }, // e.g. 'Application', 'Interview'
  details: { type: String },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null },

  // --- Readability & Audit Fields ---
  relatedJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  relatedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  relatedApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' }
}, { timestamps: true });

const CoordinatorActivityLogModel = mongoose.model('CoordinatorActivityLog', coordinatorActivityLogSchema, 'coordinatoractivitylogs');
console.log(`[Model Init] 'CoordinatorActivityLog' model mapped directly to MongoDB collection: '${CoordinatorActivityLogModel.collection.name}'`);
module.exports = CoordinatorActivityLogModel;
