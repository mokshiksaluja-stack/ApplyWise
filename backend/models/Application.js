const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  studentName: { type: String },
  company: { type: String },
  role: { type: String },
  logo: { type: String },
  status: { type: String, default: 'Applied' },
  attendance: { type: String, enum: ['Present', 'Absent', 'Pending'], default: 'Pending' },
  currentRound: { type: String, default: 'Initial' },
  roundResult: { type: String, default: 'Pending' },
  date: { type: String },

  // Interview scheduling fields
  interviewDate: { type: String },
  reportingTime: { type: String },
  venue: { type: String },
  coordinatorNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
