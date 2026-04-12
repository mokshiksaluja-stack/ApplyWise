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
  coordinatorNotes: { type: String },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null },

  // --- Readability & Audit Fields ---
  lastUpdatedByRole: { type: String, enum: ['student', 'coordinator', 'admin'] },
  lastUpdatedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moduleSource: { type: String, default: 'StudentPortal' }
}, { timestamps: true });

const ApplicationModel = mongoose.model('Application', applicationSchema, 'applications');
console.log(`[Model Init] 'Application' model mapped directly to MongoDB collection: '${ApplicationModel.collection.name}'`);
module.exports = ApplicationModel;
