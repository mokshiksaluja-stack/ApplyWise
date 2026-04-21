const { generateOpportunityInsights, buildFallbackInsights } = require('../services/geminiService');

/**
 * POST /api/ai/opportunity-insights
 *
 * Accepts all context about a student + job and returns structured
 * AI-generated insights from Gemini.
 *
 * Safety contract:
 *   - This endpoint NEVER returns a 5xx to the client.
 *   - Any Gemini failure (missing key, quota, network, bad JSON) is caught
 *     and answered with a deterministic fallback so the page stays useful.
 *   - `isFallback: true` is set in the response so the frontend can show
 *     a tasteful "limited guidance" banner instead of a broken error screen.
 *
 * Gemini is purely an explanation / guidance layer.
 * It does NOT determine eligibility — the frontend sends the already-computed
 * eligibility result and readiness score from the deterministic engine.
 */
exports.getOpportunityInsights = async (req, res) => {
  const {
    // Student profile fields
    studentName,
    branch,
    cgpa,
    degree,
    skills,
    certifications,
    projects,
    // Job context
    company,
    role,
    description,
    // Deterministic system outputs (ground truth)
    eligibilityStatus,
    readinessScore,
    matchedSkills,
    missingSkills,
  } = req.body;

  // Basic guard — company and role are the minimum required fields
  if (!company || !role) {
    return res.status(400).json({
      success: false,
      message: 'company and role are required fields.',
    });
  }

  const commonPayload = {
    studentName, branch, cgpa, degree, skills, certifications, projects,
    company, role, description,
    eligibilityStatus, readinessScore, matchedSkills, missingSkills,
  };

  try {
    const insights = await generateOpportunityInsights(commonPayload);
    return res.json({ success: true, isFallback: false, insights });

  } catch (err) {
    // Classify the failure for clean server-side logging
    const isMissingKey  = err.message?.includes('GEMINI_API_KEY');
    const isQuota       = err.message?.toLowerCase().includes('quota') ||
                          err.message?.toLowerCase().includes('429');
    const isParseError  = err.message?.startsWith('Gemini returned non-JSON');

    const reason = isMissingKey  ? 'MISSING_KEY'
                 : isQuota       ? 'QUOTA_EXCEEDED'
                 : isParseError  ? 'PARSE_ERROR'
                 :                 'API_ERROR';

    console.warn(`[AI] Gemini unavailable (${reason}) — serving deterministic fallback. Detail: ${err.message?.slice(0, 120)}`);

    // Always respond 200 with fallback — page must never break
    const fallback = buildFallbackInsights(commonPayload);
    return res.json({ success: true, isFallback: true, insights: fallback });
  }
};

