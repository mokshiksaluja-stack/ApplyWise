const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // 1. Basic Opportunity Information
  company: { type: String, required: true },
  logo: { type: String },
  title: { type: String }, 
  role: { type: String, required: true },
  opportunityType: { type: String }, 
  employmentMode: { type: String }, 
  location: { type: String },
  department: { type: String },
  eligibleBatch: [{ type: String }],
  deadline: { type: Date }, 
  tentativeJoiningDate: { type: Date },
  internshipDuration: { type: String },

  // 2. Compensation Details
  stipend: { type: String },
  salary: { type: String }, // CTC
  basePay: { type: String },
  variablePay: { type: String },
  ppoAvailable: { type: Boolean, default: false },
  ppoCriteria: { type: String },
  bondRequired: { type: Boolean, default: false },
  bondDuration: { type: String },
  benefits: { type: String },

  // 3. Eligibility Criteria
  eligibleDegrees: [{ type: String }],
  eligibleBranches: [{ type: String }],
  minCGPA: { type: Number },
  maxBacklogs: { type: Number },
  tenthPercent: { type: Number },
  twelfthPercent: { type: Number },
  semesterEligibility: [{ type: String }],
  gapYearRestrictions: { type: String },
  previousOfferRestrictions: { type: String },
  previousApplicationRestrictions: { type: String },

  // 4. Skill Requirements
  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  programmingLanguages: [{ type: String }],
  toolsPlatforms: [{ type: String }],
  domainFocus: { type: String },
  assessmentAreas: [{ type: String }],

  // 5. Role Description
  shortSummary: { type: String },
  description: { type: String }, 
  responsibilities: { type: String },
  teamContext: { type: String },

  // 6. Selection Process
  selectionRounds: [{
    name: String,
    description: String,
    assessmentType: String,
  }],
  processTimeline: { type: String },

  // 7. Documents Required
  requiredDocuments: [{ type: String }], 
  customQuestions: [{ type: String }],

  // 8. Preparation Guidance
  importantTopics: [{ type: String }],
  dsaFocus: [{ type: String }],
  coreSubjectsFocus: [{ type: String }],
  aptitudeFocus: [{ type: String }],
  topTips: [{ type: String }],
  experienceLinks: [{ type: String }],

  // 9. Coordination / Logistics
  assignedCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedCoordinatorName: { type: String },
  hrMobileNumber: { type: String },
  venue: { type: String },
  reportingInstructions: { type: String },
  contactPerson: { type: String },

  // 6. Visibility / Admin Controls
  isDraft: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  visibilityRule: { type: String, enum: ['All', 'EligibleOnly', 'PartiallyReady'], default: 'All' },
  autoLockForIneligible: { type: Boolean, default: true },
  status: { type: String, enum: ['Open', 'Closed', 'Ongoing', 'Completed'], default: 'Open' },

  // Legacy mapping compatibility
  tags: [{ type: String }],
  applied: { type: Boolean, default: false },
  type: { type: String },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null },

  // --- Readability & Audit Fields ---
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByRole: { type: String, enum: ['admin', 'coordinator'], default: 'admin' },
  lastUpdatedByRole: { type: String },
  lastUpdatedById: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moduleSource: { type: String, default: 'AdminPortal' }
}, { timestamps: true });

const JobModel = mongoose.model('Job', jobSchema, 'jobs');
console.log(`[Model Init] 'Job' model mapped directly to MongoDB collection: '${JobModel.collection.name}'`);
module.exports = JobModel;
