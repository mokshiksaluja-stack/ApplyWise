const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplicationById);
router.post('/', applicationController.createApplication);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

// Coordinator action routes
router.put('/:id/status',     applicationController.updateStatus);
router.put('/:id/schedule',   applicationController.scheduleInterview);
router.put('/:id/attendance', applicationController.markAttendance);

module.exports = router;
