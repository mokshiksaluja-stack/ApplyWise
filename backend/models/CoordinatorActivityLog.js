const mongoose = require('mongoose');

const coordinatorActivityLogSchema = new mongoose.Schema({
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { type: String, required: true }, // e.g. 'Marked Attendance', 'Scheduled Interview'
  targetEntityId: { type: mongoose.Schema.Types.ObjectId }, // Flexible: could map to Application, Job, Interview
  targetEntityModel: { type: String }, // e.g. 'Application', 'Interview'
  details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CoordinatorActivityLog', coordinatorActivityLogSchema);
