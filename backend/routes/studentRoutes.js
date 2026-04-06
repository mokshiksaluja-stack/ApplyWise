const express = require('express');
const router = express.Router();

// Import our controller methods
const { 
  saveStudentProfile,
  getStudentProfile,
  updateStudentProfile
} = require('../controllers/studentController');

// Routes
router.post('/profile', saveStudentProfile);
router.get('/profile/:id', getStudentProfile);
router.put('/profile/:id', updateStudentProfile);

module.exports = router;
