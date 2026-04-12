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
  venue: { type: String },
  slotId: { type: String },
  reportingTime: { type: String },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, default: 'Upcoming' },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null },

  // --- Readability & Audit Fields ---
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByRole: { type: String, default: 'coordinator' },
  relatedApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  moduleSource: { type: String, default: 'CoordinatorPortal' }
}, { timestamps: true });

const InterviewModel = mongoose.model('Interview', interviewSchema, 'interviews');
console.log(`[Model Init] 'Interview' model mapped directly to MongoDB collection: '${InterviewModel.collection.name}'`);
module.exports = InterviewModel;
