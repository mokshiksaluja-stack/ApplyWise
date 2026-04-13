const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');

// List all coordinators (for Admin assignment dropdown)
router.get('/list', coordinatorController.listCoordinators);

// Opportunities
router.get('/jobs/:coordinatorId', coordinatorController.getAssignedDrives);

// Tasks — /all MUST be registered before /:coordinatorId (specific before param routes)
router.get('/tasks/all', coordinatorController.getAllPendingTasks);
router.post('/tasks', coordinatorController.createTask);
router.patch('/tasks/:id/status', coordinatorController.updateTaskStatus);
router.get('/tasks/:coordinatorId', coordinatorController.getCoordinatorTasks);

// Applications
router.put('/applications/:id', coordinatorController.updateApplicationStatus);

// Scheduler
router.post('/scheduler/slots', coordinatorController.createInterviewSlot);
router.post('/scheduler/slots/:slotId/assign', coordinatorController.assignStudentToSlot);

// Monitoring (Admin Only)
router.get('/monitor', coordinatorController.getMonitoringSummary);

// Activity
router.post('/activity', coordinatorController.logActivity);

// Performance (Admin Only) — stored in coordinatorperformance collection
router.get('/performance', coordinatorController.getAllPerformance);
router.get('/performance/:coordinatorId', coordinatorController.getPerformance);
router.post('/performance/:coordinatorId/attendance', coordinatorController.markAttendance);
router.patch('/performance/:coordinatorId/badge', coordinatorController.assignBadge);

module.exports = router;
