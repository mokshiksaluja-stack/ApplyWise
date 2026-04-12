const mongoose = require('mongoose');

const coordinatorTaskSchema = new mongoose.Schema({
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null }
}, { timestamps: true });

const CoordinatorTaskModel = mongoose.model('CoordinatorTask', coordinatorTaskSchema, 'coordinatortasks');
console.log(`[Model Init] 'CoordinatorTask' model mapped directly to MongoDB collection: '${CoordinatorTaskModel.collection.name}'`);
module.exports = CoordinatorTaskModel;
