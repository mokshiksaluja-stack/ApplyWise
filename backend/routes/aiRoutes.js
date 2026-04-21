const express = require('express');
const router = express.Router();
const { getOpportunityInsights } = require('../controllers/aiController');

/**
 * POST /api/ai/opportunity-insights
 * Generate Gemini-powered insights for a student viewing a specific opportunity.
 */
router.post('/opportunity-insights', getOpportunityInsights);

module.exports = router;
