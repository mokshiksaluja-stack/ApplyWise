const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// --- STUDENT Profile Routes ---
router.post('/profile', studentController.saveStudentProfile);
router.get('/profile/:id', studentController.getStudentProfile);
router.put('/profile/:id', studentController.updateStudentProfile);

// --- ADMIN Management Routes ---
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
