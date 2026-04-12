/**
 * eligibilityEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Deterministic eligibility and readiness scoring engine.
 * Pure functions — zero dependencies — drop-in replaceable with an ML layer.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const WEIGHTS = {
  skillMatch:        0.40,   // 40% — most important signal
  cgpaScore:         0.25,   // 25% — academic standing
  projectRelevance:  0.20,   // 20% — practical exposure
  certifications:    0.10,   // 10% — verified learning
  preferredSkills:   0.05,   // 5%  — bonus signal
};

const PROFICIENCY_MAP = {
  expert:       1.0,
  advanced:     0.85,
  intermediate: 0.65,
  beginner:     0.40,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Normalize any string to lowercase trimmed form */
const norm = (str) => (str || "").toLowerCase().trim();

/** Get proficiency weight for a student skill entry */
const profWeight = (skillEntry) => {
  if (typeof skillEntry === "string") return 0.65; // bare string → assume intermediate
  const level = norm(skillEntry.proficiency || skillEntry.level || "");
  return PROFICIENCY_MAP[level] ?? 0.65;
};

/** Extract raw skill names from student profile (handles both string[] and {name, proficiency}[]) */
const extractStudentSkills = (rawSkills = []) =>
  rawSkills.map((s) => (typeof s === "string" ? norm(s) : norm(s.name || s.skill || "")));

/** Build a proficiency-keyed map: { "react": 0.85, "python": 1.0, ... } */
const buildProficiencyMap = (rawSkills = []) => {
  const map = {};
  rawSkills.forEach((s) => {
    const name = typeof s === "string" ? norm(s) : norm(s.name || s.skill || "");
    if (name) map[name] = profWeight(s);
  });
  return map;
};

// ── Sub-scorers ───────────────────────────────────────────────────────────────

/**
 * Skill Match Score (0–1)
 * Weighted by proficiency for matched skills.
 */
const computeSkillMatchScore = (profMap, reqSkills = [], preferredSkills = []) => {
  if (reqSkills.length === 0) return { score: 1, matchedRequired: [], missingRequired: [], matchedPreferred: [] };

  const matchedRequired = [];
  const missingRequired = [];
  let weightedSum = 0;

  reqSkills.forEach((skill) => {
    const key = norm(skill);
    if (profMap[key] !== undefined) {
      matchedRequired.push(skill);
      weightedSum += profMap[key]; // weighted by proficiency
    } else {
      missingRequired.push(skill);
    }
  });

  const matchedPreferred = preferredSkills.filter((s) => profMap[norm(s)] !== undefined);

  // Raw fraction weighted by proficiency
  const score = reqSkills.length > 0 ? weightedSum / reqSkills.length : 1;

  return { score: Math.min(score, 1), matchedRequired, missingRequired, matchedPreferred };
};

/**
 * CGPA Score (0–1)
 * Normalized relative to the requirement with a soft ceiling.
 */
const computeCgpaScore = (studentCgpa, minCgpa) => {
  if (!minCgpa || minCgpa === 0) return 1; // no cutoff → full score
  if (studentCgpa >= 10) return 1;          // max possible
  const ratio = studentCgpa / 10;           // normalize to 0–1 (10-point scale)
  const threshold = minCgpa / 10;
  if (ratio < threshold) return ratio / threshold * 0.5; // below cutoff: capped at 0.5
  return Math.min(0.5 + (ratio - threshold) / (1 - threshold) * 0.5, 1);
};

/**
 * Project Relevance Score (0–1)
 * Checks if project technologies overlap with required skills.
 */
const computeProjectScore = (projects = [], reqSkills = []) => {
  if (!projects.length || !reqSkills.length) return 0.3; // neutral baseline
  const reqNorm = reqSkills.map(norm);
  let matches = 0;
  projects.forEach((proj) => {
    const techStack = [
      ...(proj.technologies || proj.techStack || []),
      ...(proj.skills || []),
      proj.title || "",
      proj.description || "",
    ].map(norm).join(" ");

    reqNorm.forEach((skill) => {
      if (techStack.includes(skill)) matches++;
    });
  });
  // Score: fraction of req skills evidenced in at least one project, capped at 1
  return Math.min(matches / (reqSkills.length * Math.max(projects.length, 1)), 1);
};

/**
 * Certification Score (0–1)
 * Bonus for relevant certifications.
 */
const computeCertScore = (certifications = [], reqSkills = []) => {
  if (!certifications.length) return 0;
  const reqNorm = reqSkills.map(norm);
  let hits = 0;
  certifications.forEach((cert) => {
    const body = norm(cert.name || cert.title || cert);
    if (reqNorm.some((skill) => body.includes(skill))) hits++;
  });
  return Math.min(hits / Math.max(reqSkills.length, 1), 1);
};

// ── Explanation Engine ────────────────────────────────────────────────────────

const buildExplanation = ({ status, studentCgpa, minCgpa, matchedRequired, missingRequired, matchedPreferred, branchValid, readinessScore }) => {
  const why = [];
  const improve = [];

  // Eligibility reasons
  if (!branchValid) {
    why.push("⛔ Your branch is not in the eligible stream for this role.");
  }
  if (studentCgpa < minCgpa && minCgpa > 0) {
    why.push(`⛔ Minimum CGPA required is ${minCgpa}. Your current CGPA is ${studentCgpa}.`);
    improve.push(`Maintain a CGPA of at least ${minCgpa} going forward.`);
  }
  if (status === "Eligible") {
    why.push("✅ You meet the CGPA and branch criteria.");
    why.push(`✅ You have ${matchedRequired.length} of ${matchedRequired.length + missingRequired.length} required skills.`);
    if (matchedPreferred.length > 0) {
      why.push(`⭐ Bonus: You also have ${matchedPreferred.length} preferred skill(s): ${matchedPreferred.join(", ")}.`);
    }
  } else if (status === "Partially Ready") {
    why.push("✅ You meet the academic requirements.");
    if (matchedRequired.length > 0) {
      why.push(`✅ Matched ${matchedRequired.length} required skill(s): ${matchedRequired.join(", ")}.`);
    }
    if (missingRequired.length > 0) {
      why.push(`⚠️ Missing ${missingRequired.length} required skill(s): ${missingRequired.join(", ")}.`);
      improve.push(`Learn ${missingRequired.slice(0, 3).join(", ")} — prioritize hands-on projects.`);
      improve.push("Add missing technologies to your profile and build at least one project using them.");
    }
  }

  // Low readiness supplement
  if (readinessScore < 50) {
    improve.push("Strengthen your project portfolio to demonstrate practical ability.");
    improve.push("Earn relevant certifications (e.g., AWS, Google, Coursera verified courses).");
  }

  return { why, improve };
};

// ── Main Engine Export ────────────────────────────────────────────────────────

/**
 * evaluateEligibility
 * ─────────────────────────────────────────────────────────────────────────────
 * @param {Object|null} studentProfile  – Student document from backend/profile
 * @param {Object}      opportunity     – Job/Opportunity document
 * @returns {EligibilityResult}
 *
 * EligibilityResult shape:
 * {
 *   status:           "Eligible" | "Partially Ready" | "Not Eligible"
 *   readinessScore:   number (0–100, integer)
 *   matchedSkills:    string[]   (required skills the student HAS)
 *   missingSkills:    string[]   (required skills the student LACKS)
 *   matchedPreferred: string[]   (preferred skills the student has)
 *   skillMatchPct:    number (0–100)
 *   skillMatchCount:  number
 *   totalSkills:      number
 *   reasons:          string[]   (legacy flat array for backward compat)
 *   explanation: {
 *     why:     string[]  (why eligible / not eligible)
 *     improve: string[]  (what to improve)
 *   }
 *   scoreBreakdown: {
 *     skillMatch, cgpa, projects, certifications, preferred
 *   }
 * }
 */
export const evaluateEligibility = (studentProfile, opportunity) => {
  // ── Guard: No profile ────────────────────────────────────────────────────
  if (!studentProfile) {
    const reqSkills = opportunity?.requiredSkills || [];
    return {
      status: "Not Eligible",
      readinessScore: 0,
      matchedSkills: [],
      missingSkills: reqSkills,
      matchedPreferred: [],
      skillMatchPct: 0,
      skillMatchCount: 0,
      totalSkills: reqSkills.length,
      reasons: ["Complete your profile to see your eligibility."],
      explanation: { why: ["No profile data found."], improve: ["Complete your student profile first."] },
      scoreBreakdown: { skillMatch: 0, cgpa: 0, projects: 0, certifications: 0, preferred: 0 },
    };
  }

  // ── Extract student data ─────────────────────────────────────────────────
  const studentCgpa = parseFloat(studentProfile.cgpa) || 0;
  const studentBranch = norm(studentProfile.branch || studentProfile.department || "");
  const rawSkills = studentProfile.technicalSkills || studentProfile.skills || [];
  const profMap = buildProficiencyMap(rawSkills);
  const projects = studentProfile.projects || [];
  const certifications = studentProfile.certifications || [];

  // ── Extract opportunity criteria ─────────────────────────────────────────
  const minCgpa = parseFloat(opportunity.minCGPA || opportunity.requiredCGPA || opportunity.cgpaCutoff || 0);
  const eligBranches = (opportunity.eligibleBranches || []).map(norm);
  const reqSkills = opportunity.requiredSkills || [];
  const preferredSkills = opportunity.preferredSkills || [];

  // ── Gate checks ──────────────────────────────────────────────────────────
  const cgpaValid = studentCgpa >= minCgpa || minCgpa === 0;
  const branchValid = eligBranches.length === 0
    || eligBranches.includes("all")
    || eligBranches.includes(studentBranch);

  // ── Sub-scores ───────────────────────────────────────────────────────────
  const { score: skillScore, matchedRequired, missingRequired, matchedPreferred } =
    computeSkillMatchScore(profMap, reqSkills, preferredSkills);

  const cgpaScore    = computeCgpaScore(studentCgpa, minCgpa);
  const projectScore = computeProjectScore(projects, reqSkills);
  const certScore    = computeCertScore(certifications, reqSkills);
  const prefScore    = matchedPreferred.length / Math.max(preferredSkills.length, 1);

  // ── Weighted readiness (0–100) ───────────────────────────────────────────
  const rawReadiness =
    skillScore    * WEIGHTS.skillMatch       +
    cgpaScore     * WEIGHTS.cgpaScore        +
    projectScore  * WEIGHTS.projectRelevance +
    certScore     * WEIGHTS.certifications   +
    prefScore     * WEIGHTS.preferredSkills;

  const readinessScore = Math.round(rawReadiness * 100);

  // ── Eligibility status ───────────────────────────────────────────────────
  let status;
  if (!cgpaValid || !branchValid) {
    status = "Not Eligible";
  } else if (missingRequired.length > 0) {
    status = "Partially Ready";
  } else {
    status = "Eligible";
  }

  // Edge: meets all gates but no skills listed in opportunity
  if (cgpaValid && branchValid && reqSkills.length === 0) {
    status = "Eligible";
  }

  // ── Reasons (flat array — backward compat) ───────────────────────────────
  const reasons = [];
  if (!cgpaValid)  reasons.push(`Required CGPA is ${minCgpa}, your CGPA is ${studentCgpa}.`);
  if (!branchValid) reasons.push(`Your branch (${studentProfile.branch}) is not in the eligible stream.`);
  if (missingRequired.length > 0) reasons.push(`Missing ${missingRequired.length} required skill(s): ${missingRequired.join(", ")}.`);
  if (status === "Eligible") reasons.push("You meet all core requirements for this role.");

  // ── Explanation ──────────────────────────────────────────────────────────
  const explanation = buildExplanation({
    status, studentCgpa, minCgpa, matchedRequired,
    missingRequired, matchedPreferred, branchValid, readinessScore,
  });

  return {
    status,
    readinessScore,
    matchedSkills:    matchedRequired,
    missingSkills:    missingRequired,
    matchedPreferred,
    skillMatchPct:    Math.round(skillScore * 100),
    skillMatchCount:  matchedRequired.length,
    totalSkills:      reqSkills.length,
    reasons,
    explanation,
    scoreBreakdown: {
      skillMatch:     Math.round(skillScore    * 100),
      cgpa:           Math.round(cgpaScore     * 100),
      projects:       Math.round(projectScore  * 100),
      certifications: Math.round(certScore     * 100),
      preferred:      Math.round(prefScore     * 100),
    },
  };
};

/**
 * computeReadinessScore (standalone export for dashboard widgets)
 * Quick single-number readiness without full evaluation context.
 */
export const computeReadinessScore = (studentProfile, opportunity) =>
  evaluateEligibility(studentProfile, opportunity).readinessScore;

/**
 * getEligibilityLabel (helper for badge display)
 */
export const getEligibilityLabel = (status) => ({
  "Eligible":        { label: "Eligible",        color: "emerald" },
  "Partially Ready": { label: "Partially Ready", color: "amber"   },
  "Not Eligible":    { label: "Not Eligible",    color: "red"     },
}[status] ?? { label: "Unknown", color: "gray" });
