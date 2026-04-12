const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be Admin or Coordinator
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usually Student
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Assignment', 'Interview', 'Alert', 'Result', 'General'], default: 'General' },
  isRead: { type: Boolean, default: false },
  isDemoData: { type: Boolean, default: false },
  demoBatch: { type: String, default: null },

  // --- Readability & Audit Fields ---
  relatedJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  relatedApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  visibilityScope: { type: String, enum: ['Private', 'Broadcast', 'Cohort'], default: 'Private' },
  notificationType: { type: String } // Enhances the legacy 'type' field without breaking it
}, { timestamps: true });

const NotificationModel = mongoose.model('Notification', notificationSchema, 'notifications');
console.log(`[Model Init] 'Notification' model mapped directly to MongoDB collection: '${NotificationModel.collection.name}'`);
module.exports = NotificationModel;
