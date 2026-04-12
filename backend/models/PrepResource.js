const mongoose = require('mongoose');

const prepResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['company', 'skill', 'mock', 'experience'], 
    required: true 
  },
  company: { type: String, default: 'Any' },
  topic: { type: String, required: true },
  resourceType: { 
    type: String, 
    enum: ['PDF', 'Sheet', 'Link', 'Test', 'Experience', 'Video'], 
    default: 'Link' 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  description: { type: String, required: true },
  estimatedTime: { type: String },
  tags: [{ type: String }],
  linkLabel: { type: String, default: 'Open Resource' },
  linkUrl: { type: String, default: '#' },
}, { timestamps: true });

module.exports = mongoose.model('PrepResource', prepResourceSchema);
