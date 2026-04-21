const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── SDK initialisation ───────────────────────────────────────────────────
// Key is read from process.env at call-time so a missing key produces a
// clear Error that the controller's catch-block can classify and fallback.
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in environment variables.');
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// ─── Company-type classifier ──────────────────────────────────────────────
const FINTECH_COMPANIES = [
  'jpmorgan', 'morgan stanley', 'goldman sachs', 'blackrock', 'jane street',
  'optiver', 'citadel', 'two sigma', 'deutsche bank', 'barclays', 'hsbc',
  'american express', 'visa', 'mastercard', 'razorpay', 'paytm', 'zerodha',
  'groww', 'phonepe', 'cred', 'stripe', 'robinhood',
];
const SERVICE_COMPANIES = [
  'tcs', 'infosys', 'wipro', 'hcl', 'cognizant', 'accenture', 'capgemini',
  'tech mahindra', 'mphasis', 'ltimindtree', 'hexaware', 'persistent',
];

const classifyCompany = (company = '') => {
  const c = company.toLowerCase();
  if (FINTECH_COMPANIES.some(f => c.includes(f))) return 'fintech';
  if (SERVICE_COMPANIES.some(s => c.includes(s))) return 'service';
  return 'product';
};

// ─── Per-category hiring context injected into the prompt ─────────────────
const COMPANY_CONTEXT = {
  fintech: `
COMPANY CATEGORY: Fintech / Investment Bank / Financial Technology
How this category evaluates campus candidates:
- Online Assessment: quantitative aptitude, SQL, logical reasoning, sometimes a short coding round
- Interviews: backend system reliability, REST APIs, database design, security awareness
- Strong preference for: analytical thinking, data integrity mindset, clean backend code
- Red flags: weak SQL, no backend projects, inability to quantify project impact
- Do NOT fabricate finance knowledge the student hasn't demonstrated`,

  product: `
COMPANY CATEGORY: Product / SaaS / Tech-First Company
How this category evaluates campus candidates:
- Online Assessment: 2–3 DSA problems (LeetCode medium), sometimes a system design question
- Interviews: DSA problem-solving, project deep-dive, brief system design discussion
- Strong preference for: project depth, OSS contributions, competitive programming track record
- Red flags: copied projects with no understanding, weak time/space complexity awareness`,

  service: `
COMPANY CATEGORY: IT Services / Consulting
How this category evaluates campus candidates:
- Online Assessment: aptitude, verbal reasoning, basic coding (easy–medium difficulty)
- Interviews: OOPS, DBMS, OS, CN fundamentals, HR behavioural round
- Strong preference for: consistent academics, communication clarity, cloud/tool certifications
- Red flags: poor fundamentals, inability to explain projects, very low CGPA for shortlisting`,
};

// ─── JSON output schema (injected literally into the prompt as a contract) ─
const OUTPUT_SCHEMA = `{
  "fitSummary": "string — 2-3 lines. How strong is this student for THIS role? Mention readiness score and alignment. Be direct.",

  "whyYouMatch": ["string — one bullet per matched strength. Reference specific skills/projects/academics from profile above. Max 4 items."],

  "criticalGaps": {
    "critical": ["string — must-fix gaps directly blocking this role. Be specific, not generic. Max 3."],
    "moderate": ["string — should-improve gaps that reduce competitiveness. Max 3."],
    "minor":    ["string — optional polish items. Max 2."]
  },

  "rejectionRisks": ["string — real reasons this candidate may get rejected even if eligible. Mention resume, projects, domain gaps, interview weaknesses. Max 4."],

  "prepTimeEstimate": ["string — format exactly: 'SkillOrArea → X–Y days/weeks'. One entry per gap. Max 6."],

  "resumeFixes": {
    "add":     ["string — what to ADD to resume for this role. Be specific."],
    "remove":  ["string — what to REMOVE or deprioritise. Be specific."],
    "rewrite": ["string — what to REWRITE with stronger impact phrasing. Give an example where possible."],
    "keywords": ["string — role-specific keywords/tools to include for ATS and interview alignment."]
  },

  "interviewFocus": {
    "topics": ["string — technical topics most likely tested for this role at this company type. Max 5."],
    "rounds": ["string — predicted interview rounds in order. E.g. 'Round 1: Online Assessment (DSA, 90 min)'."],
    "focus":  ["string — what the interviewer will probe hardest. Be specific to role + company type."]
  },

  "actionPlan": {
    "top3": ["string — top 3 immediate actions to take this week. Most impactful first."],
    "day3": ["string — what to accomplish in 3 days. Short sprint focus."],
    "day7": ["string — what to accomplish in 7 days. Skill + project focus."],
    "day14": ["string — what to accomplish in 14 days. Interview-ready target."]
  },

  "companySpecificAdvice": ["string — grounded tips about how THIS company hires. Interview culture, assessment format, what they value most. Max 4."],

  "preApplyChecklist": ["string — 5–7 actionable checklist items. Must be practical and specific, not generic. Start each with a verb."]
}`;

// ─── Prompt builder ───────────────────────────────────────────────────────
/**
 * Constructs the full mentor-report prompt sent to Gemini.
 * The prompt treats Gemini as a placement strategist, NOT a decision-maker.
 */
const buildPrompt = ({
  studentName,
  branch,
  cgpa,
  degree,
  skills,
  certifications,
  projects,
  company,
  role,
  description,
  eligibilityStatus,
  readinessScore,
  matchedSkills,
  missingSkills,
}) => {
  const companyType    = classifyCompany(company);
  const companyContext = COMPANY_CONTEXT[companyType];

  const skillsStr   = skills?.length        ? skills.join(', ')         : 'None listed';
  const certsStr    = certifications?.length ? certifications.join(', ') : 'None';
  const matchedStr  = matchedSkills?.length  ? matchedSkills.join(', ')  : 'None';
  const missingStr  = missingSkills?.length  ? missingSkills.join(', ')  : 'None';

  return `
You are an expert career mentor, placement strategist, and technical interviewer.
Your task: generate a highly personalised, actionable placement mentor report for THIS student applying to THIS role.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE RULES — NEVER BREAK THESE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Do NOT re-evaluate or override the system's eligibility decision. Treat it as ground truth.
2. Do NOT make guarantees ("you will get selected"). Use guidance language only ("consider", "this may help", "aim to").
3. Do NOT invent skills, certifications, or projects the student hasn't listed.
4. Do NOT repeat the same advice across sections.
5. Do NOT write generic advice like "improve your skills" — always name the specific skill.
6. Every array item = one concise sentence or phrase (max ~25 words).
7. Return raw JSON only — no markdown, no code fences, no preamble, no trailing text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDENT PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name         : ${studentName || 'Student'}
Degree       : ${degree || 'Not specified'} — ${branch || 'Not specified'}
CGPA         : ${cgpa ?? 'Not provided'}
Skills       : ${skillsStr}
Certifications: ${certsStr}
Projects     : ${projects ?? 0} project(s) listed on profile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JOB DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Company      : ${company}
Role         : ${role}
Company Type : ${companyType}
Description  : ${description ? description.slice(0, 500) : 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SYSTEM ANALYSIS — GROUND TRUTH (DO NOT CHANGE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Eligibility Status : ${eligibilityStatus}
Readiness Score    : ${readinessScore}/100
Matched Skills     : ${matchedStr}
Missing Skills     : ${missingStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${companyContext}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR TASK:
Think like a real placement mentor. Compare THIS student's profile vs the ideal candidate for THIS ${role} role at ${company}.
Identify strengths, weaknesses, risks. Give practical, step-by-step guidance that is specific to this student.

CRITICAL: Analyse the student vs this role. Do not write a generic guide.
- If missingSkills is empty, set criticalGaps.critical to [] and give positive, polish-focused advice instead.
- For prepTimeEstimate, give one entry per missing skill — be realistic (e.g., "SQL joins → 5–7 days", "REST API project → 2–3 weeks").
- For actionPlan, each sub-array (top3, day3, day7, day14) should contain 3 concrete sentences, not abstract goals.
- For preApplyChecklist, start every item with an action verb (e.g., "Add", "Revise", "Practice", "Research").

OUTPUT — Return this exact JSON structure (raw JSON only):

${OUTPUT_SCHEMA}

REMINDER: Raw JSON only. No markdown. No preamble. No trailing text outside the JSON object.
`;
};

// ─── Deterministic fallback ───────────────────────────────────────────────
/**
 * Zero-network fallback returned whenever Gemini is unavailable.
 * Must match the same JSON schema as the Gemini output exactly.
 */
const buildFallbackInsights = ({
  company           = 'this company',
  role              = 'this role',
  eligibilityStatus = 'Unknown',
  readinessScore    = 0,
  matchedSkills     = [],
  missingSkills     = [],
} = {}) => {
  const companyType = classifyCompany(company);
  const hasGaps     = missingSkills.length > 0;
  const matched4    = matchedSkills.slice(0, 4).join(', ') || 'none detected';
  const missing4    = missingSkills.slice(0, 4).join(', ') || 'none detected';

  const statusLine =
    eligibilityStatus === 'Eligible'        ? `Your profile satisfies the core requirements for this role with a readiness score of ${readinessScore}/100.` :
    eligibilityStatus === 'Partially Ready' ? `You meet some requirements but have skill gaps. Readiness score: ${readinessScore}/100 — closing the gaps can make you fully competitive.` :
    `You do not currently meet the hard requirements for this role (score: ${readinessScore}/100). Use this as a focused learning roadmap.`;

  return {
    fitSummary:
      `${statusLine} Matched skills include: ${matched4}. ` +
      (hasGaps ? `Gaps to address: ${missing4}.` : 'Focus on interview polish and application quality.'),

    whyYouMatch: matchedSkills.length
      ? matchedSkills.slice(0, 4).map(s => `Your skill in ${s} directly matches a requirement listed for this ${role} role.`)
      : [`Complete your profile skills section to see a detailed match analysis.`],

    criticalGaps: {
      critical: missingSkills.slice(0, 3),
      moderate: missingSkills.slice(3, 6),
      minor:    [],
    },

    rejectionRisks: [
      hasGaps ? `Missing critical skills (${missingSkills[0]}) may cause early-round elimination.` : `A weak project portfolio may reduce your competitive edge despite skill matches.`,
      'Resume may lack quantified impact — interviewers prefer metrics over descriptions.',
      `Not being able to explain your projects at ${company}'s interview depth is a common disqualifier.`,
      'Insufficient company-specific preparation can signal low genuine interest.',
    ],

    prepTimeEstimate: hasGaps
      ? missingSkills.slice(0, 6).map(s => `${s} → ${Math.ceil(1.5 + Math.random())}–${Math.ceil(2 + Math.random() * 1.5)} weeks`)
      : [`Interview preparation → 1–2 weeks of mock sessions and company research.`],

    resumeFixes: {
      add:      [`Add a dedicated Skills section listing: ${matched4}.`, `Include any measurable outcomes from your projects (users, performance improvements, etc.).`],
      remove:   ['Remove unrelated coursework or hobbies that do not strengthen your engineering profile.'],
      rewrite:  [`Rewrite project bullets using action verbs: instead of "Made a login page", write "Designed and implemented JWT-authenticated login, reducing session errors by X%".`],
      keywords: [role, company, ...matchedSkills.slice(0, 3)],
    },

    interviewFocus: {
      topics:
        companyType === 'fintech' ? ['SQL and database design', 'REST API fundamentals', 'Backend system reliability', 'Data security basics', 'Analytical problem-solving'] :
        companyType === 'service' ? ['OOPS concepts', 'DBMS fundamentals', 'Operating Systems basics', 'Computer Networks', 'Aptitude and verbal reasoning'] :
        ['Data Structures & Algorithms', 'Project deep-dive', 'System design basics', 'Time/space complexity', 'Behavioural questions'],
      rounds:
        companyType === 'service' ? ['Round 1: Aptitude + Coding Test', 'Round 2: Technical Interview (fundamentals)', 'Round 3: HR Round'] :
        ['Round 1: Online Assessment (DSA/Aptitude)', 'Round 2: Technical Interview (projects + coding)', 'Round 3: HR / Cultural Fit'],
      focus: [
        `Expect deep questions on your listed projects — know every technical decision you made.`,
        companyType === 'fintech' ? 'SQL query writing and database normalisation are commonly tested live.' :
        companyType === 'service' ? 'Be ready to define and differentiate OOPS concepts with examples.' :
        'DSA problems at LeetCode medium difficulty are the primary filter for product companies.',
      ],
    },

    actionPlan: {
      top3: [
        hasGaps ? `Start learning ${missingSkills[0]} today — dedicate 1–2 hours daily.` : `Prepare a 3-minute project walkthrough for your strongest project.`,
        'Revise your resume to highlight matched skills and quantify project outcomes.',
        `Research ${company}'s recent engineering work, products, or campus hiring process.`,
      ],
      day3: [
        hasGaps ? `Complete the basics of ${missingSkills[0]} with a small hands-on exercise.` : `Do 3–5 practice problems on topics relevant to this role.`,
        'Polish your resume and get it reviewed by a peer or senior.',
        'Prepare a concise STAR-format answer for "Tell me about a challenging project".',
      ],
      day7: [
        hasGaps ? `Build a mini-project or script demonstrating ${missingSkills[0]}.` : `Complete 2 mock interviews focused on your target role\'s technical areas.`,
        'Revise all matched skills to ensure you can discuss them fluently under pressure.',
        `Explore ${company}'s engineering blog, GitHub, or Glassdoor interview reviews.`,
      ],
      day14: [
        'Complete at least 2 timed mock interviews covering technical + behavioural rounds.',
        'Ensure all resume bullets use action verbs and include measurable impact.',
        'Apply to the role and follow up on the platform\'s Application tracker.',
      ],
    },

    companySpecificAdvice: [
      companyType === 'fintech' ? `${company} values analytical thinking — frame your projects in terms of data accuracy, reliability, or financial impact where genuine.` :
      companyType === 'service' ? `${company} mass-recruits — consistency in aptitude scores and fundamentals matters more than depth at this stage.` :
      `${company} values project depth — be ready to justify every technical decision in your strongest project.`,
      'Interviewers often ask "Why this company?" — prepare a specific, research-backed answer.',
      'Arrive or log in early; punctuality and communication clarity are soft signals interviewers notice.',
    ],

    preApplyChecklist: [
      `Verify your profile skills list is complete and matches this job description's requirements.`,
      `Revise your resume to include keywords: ${[role, ...matchedSkills.slice(0, 2)].join(', ')}.`,
      `Prepare a 2-minute verbal summary of your strongest project for the technical interview.`,
      `Research ${company}'s recent news, products, or campus hiring reports on LinkedIn/Glassdoor.`,
      'Practice at least 3 coding problems or aptitude sets relevant to this role before applying.',
      `Ensure your application is submitted well before the deadline shown on this page.`,
    ],
  };
};

// ─── Key validator ────────────────────────────────────────────────────────
const EXPECTED_KEYS = [
  'fitSummary', 'whyYouMatch', 'criticalGaps', 'rejectionRisks',
  'prepTimeEstimate', 'resumeFixes', 'interviewFocus', 'actionPlan',
  'companySpecificAdvice', 'preApplyChecklist',
];
const ARRAY_DEFAULTS   = { whyYouMatch: [], rejectionRisks: [], prepTimeEstimate: [], companySpecificAdvice: [], preApplyChecklist: [] };
const OBJECT_DEFAULTS  = {
  criticalGaps:  { critical: [], moderate: [], minor: [] },
  resumeFixes:   { add: [], remove: [], rewrite: [], keywords: [] },
  interviewFocus:{ topics: [], rounds: [], focus: [] },
  actionPlan:    { top3: [], day3: [], day7: [], day14: [] },
};

const validateAndFill = (parsed) => {
  for (const key of EXPECTED_KEYS) {
    if (!(key in parsed)) {
      if (key === 'fitSummary')         parsed[key] = '';
      else if (key in ARRAY_DEFAULTS)   parsed[key] = [];
      else if (key in OBJECT_DEFAULTS)  parsed[key] = OBJECT_DEFAULTS[key];
    }
  }
  return parsed;
};

// ─── Main exported function ───────────────────────────────────────────────
/**
 * Calls Gemini and returns parsed, validated structured insights.
 * Throws on any failure — the controller catches and serves the fallback.
 */
const generateOpportunityInsights = async (payload) => {
  const model  = getModel();
  const prompt = buildPrompt(payload);

  const result  = await model.generateContent(prompt);
  const rawText = result.response.text().trim();

  // Strip any accidental markdown fences Gemini might add
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini returned non-JSON output. Raw: ' + cleaned.slice(0, 300));
  }

  return validateAndFill(parsed);
};

module.exports = { generateOpportunityInsights, buildFallbackInsights };
