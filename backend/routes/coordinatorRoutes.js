const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');

// List all coordinators (for Admin assignment dropdown)
router.get('/list', coordinatorController.listCoordinators);

// Opportunities
router.get('/jobs/:coordinatorId', coordinatorController.getAssignedDrives);

// Tasks
router.get('/tasks/all', coordinatorController.getAllPendingTasks);
router.get('/tasks/:coordinatorId', coordinatorController.getCoordinatorTasks);
router.post('/tasks', coordinatorController.createTask);
router.patch('/tasks/:id/status', coordinatorController.updateTaskStatus);

// Applications
router.put('/applications/:id', coordinatorController.updateApplicationStatus);

// Scheduler
router.post('/scheduler/slots', coordinatorController.createInterviewSlot);
router.post('/scheduler/slots/:slotId/assign', coordinatorController.assignStudentToSlot);

// Monitoring (Admin Only)
router.get('/monitor', coordinatorController.getMonitoringSummary);

// Activity
router.post('/activity', coordinatorController.logActivity);

module.exports = router;
