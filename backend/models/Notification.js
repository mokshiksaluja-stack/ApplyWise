const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be Admin or Coordinator
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usually Student
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Assignment', 'Interview', 'Alert', 'Result', 'General'], default: 'General' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
