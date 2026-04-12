const express = require('express');
const router = express.Router();
const prepController = require('../controllers/prepController');

router.get('/', prepController.getResources);
router.post('/', prepController.createResource);
router.post('/seed', prepController.seedResources);

module.exports = router;
