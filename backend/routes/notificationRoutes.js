const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET all notifications for a receiver
router.get('/', async (req, res) => {
  try {
    const { receiverId } = req.query;
    const query = receiverId ? { receiverId } : {};
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST create notification
router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, title, message, type } = req.body;
    if (!receiverId || !title || !message) {
      return res.status(400).json({ message: "receiverId, title and message are required" });
    }
    const notif = new Notification({ senderId, receiverId, title, message, type });
    await notif.save();
    res.status(201).json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id, { $set: { isRead: true } }, { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
