const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentName: { type: String },
  company: { type: String },
  role: { type: String },
  logo: { type: String },
  date: { type: String },
  time: { type: String },
  mode: { type: String },
  status: { type: String, default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
