const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'coordinator'], default: 'student' },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema, 'users');
console.log(`[Model Init] 'User' model mapped directly to MongoDB collection: '${UserModel.collection.name}'`);
module.exports = UserModel;
