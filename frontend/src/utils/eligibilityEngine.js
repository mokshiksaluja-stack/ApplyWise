export const evaluateEligibility = (studentProfile, opportunity) => {
  if (!studentProfile) return { 
    status: "Not Eligible", 
    matchedSkills: [], 
    missingSkills: opportunity.requiredSkills || [],
    skillMatchCount: 0,
    totalSkills: (opportunity.requiredSkills || []).length,
    reasons: ["Profile data is missing."] 
  };

  const studentCgpa = parseFloat(studentProfile.cgpa) || 0;
  // Fallback to empty string for graceful includes checking
  const studentBranch = studentProfile.branch || "";
  const studentSkills = (studentProfile.technicalSkills || []).map(s => s.toLowerCase());

  const reqCgpa = parseFloat(opportunity.requiredCGPA) || 0;
  const eligBranches = (opportunity.eligibleBranches || []).map(b => b.toLowerCase());
  const reqSkills = opportunity.requiredSkills || [];

  const matchedSkills = [];
  const missingSkills = [];

  reqSkills.forEach(skill => {
    if (studentSkills.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchCount = matchedSkills.length;
  const totalSkills = reqSkills.length;

  const reasons = [];
  let isCgpaValid = studentCgpa >= reqCgpa;
  let isBranchValid = eligBranches.includes(studentBranch.toLowerCase()) || eligBranches.includes("all");

  if (!isCgpaValid) reasons.push(`Required CGPA is ${reqCgpa}, your CGPA is ${studentCgpa}.`);
  if (!isBranchValid) reasons.push(`Your branch (${studentBranch}) is not eligible for this role.`);

  let status = "Not Eligible";

  if (!isCgpaValid || !isBranchValid) {
    status = "Not Eligible";
  } else if (missingSkills.length > 0) {
    status = "Partially Ready";
    reasons.push(`You are missing ${missingSkills.length} required skills (${missingSkills.join(", ")}).`);
  } else {
    status = "Eligible";
    reasons.push("You meet all core requirements and skills for this role.");
  }

  // Fallback for edge cases with no skills required
  if (isCgpaValid && isBranchValid && totalSkills === 0) {
    status = "Eligible";
  }

  return {
    status,
    matchedSkills,
    missingSkills,
    skillMatchCount,
    totalSkills,
    reasons
  };
};
