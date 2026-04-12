const mongoose = require('mongoose');

// We define the Student Schema mapping directly to the frontend formData fields.
// For beginner friendly validation, we use required: true where strictly needed
// and matching datatypes.
const studentSchema = new mongoose.Schema({
  // Personal Info
  fullName: { type: String, required: true },
  name: { type: String }, // To support admin side legacy fields
  enrollmentNumber: { type: String, required: true, unique: true },
  email: { type: String }, // To support admin side legacy fields
  collegeEmail: { type: String, required: true },
  personalEmail: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },

  // Academic Info
  course: { type: String }, // Admin compatibility
  year: { type: String }, // Admin compatibility
  degree: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  cgpa: { type: Number, required: true },
  tenthPercentage: { type: Number, required: true },
  twelfthPercentage: { type: Number, required: true },
  backlogs: { type: String, required: true },
  academicStatus: { type: String, required: true },

  // Skills & Technologies
  primaryDomain: { type: String, required: true },
  primaryLanguage: { type: String, required: true },
  overallSkillLevel: { type: String, required: true },
  technicalSkills: [{ type: String }], // Array of strings for multiselect
  skillProficiency: { type: Map, of: String }, // Flexible object holding skill levels
  databaseFamiliarity: { type: String, required: true },
  backendFamiliarity: { type: String, required: true },
  communicationLevel: { type: String, required: true },
  problemSolvingLevel: { type: String, required: true },
  teamworkLevel: { type: String }, // Optional
  leadershipLevel: { type: String }, // Optional
  certificationSource: { type: String }, // Optional
  codingPlatform: { type: String, required: true },
  dsaLevel: { type: String, required: true },

  // Career Preferences
  interestedRoles: [{ type: String }],
  preferredJobType: { type: String, required: true },
  preferredWorkMode: { type: String, required: true },
  preferredLocation: { type: String, required: true },
  openToRelocation: { type: String, required: true },
  preferredDomains: [{ type: String }],
  expectedCompensation: { type: String, required: true },
  availabilityStatus: { type: String, required: true },
  preferredCompanyType: { type: String, required: true },
  offCampusInterest: { type: String, required: true },

  // Resume & Links
  resumeLink: { type: String, required: true },
  resumeStatus: { type: String, required: true },
  linkedIn: { type: String, required: true },
  github: { type: String, required: true },
  portfolio: { type: String },
  leetcode: { type: String },
  additionalProfilePlatform: { type: String },
  additionalProfileLink: { type: String },
  profileVisibility: { type: String, required: true },

  // Admin status tracking
  status: { type: String, default: "Not Placed" },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null }

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  collection: 'students' // [EXPLICIT DB CONFIG] Forces data to live in 'students' collection
});

// Middleware to sync full name to admin name where needed
studentSchema.pre('save', function() {
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.collegeEmail && !this.email) this.email = this.collegeEmail;
});

const StudentModel = mongoose.model('Student', studentSchema);

// [EXPLICIT DB CONFIG] Server startup log to verify model/collection identity
console.log(`[Model Init] 'Student' model mapped directly to MongoDB collection: '${StudentModel.collection.name}'`);

module.exports = StudentModel;
