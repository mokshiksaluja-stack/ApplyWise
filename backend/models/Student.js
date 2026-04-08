const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String },
  year: { type: String },
  status: { type: String, default: "Not Placed" }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
