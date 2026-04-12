const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getJobs);
router.get('/student-visible', jobController.getStudentJobs);
router.get('/coordinator/:coordinatorId', jobController.getCoordinatorJobs);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

// Admin → Coordinator assignment
router.put('/:id/assign-coordinator', jobController.assignCoordinator);

module.exports = router;
