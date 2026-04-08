const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: String },
  deadline: { type: String },
  logo: { type: String },
  tags: [{ type: String }],
  description: { type: String },
  applied: { type: Boolean, default: false },
  type: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
