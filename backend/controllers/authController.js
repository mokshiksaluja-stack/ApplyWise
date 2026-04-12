const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = ['admin', 'coordinator'].includes(role) ? role : 'student';
    const user = new User({ email, password: hashedPassword, role: userRole });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecret_fallback_key', { expiresIn: '1d' });

    res.status(201).json({ success: true, user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecret_fallback_key', { expiresIn: '1d' });

    // For student role, also look up the Student document to get the correct studentId
    let studentId = null;
    if (user.role === 'student') {
      const studentDoc = await Student.findOne({ userId: user._id }).select('_id');
      if (studentDoc) studentId = studentDoc._id;
    }

    res.json({ 
      success: true, 
      user: { id: user._id, email: user.email, role: user.role, studentId }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
