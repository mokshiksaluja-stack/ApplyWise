const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentName: { type: String },
  company: { type: String },
  role: { type: String },
  logo: { type: String },
  status: { type: String, default: 'Applied' },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
