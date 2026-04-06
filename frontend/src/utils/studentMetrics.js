export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  const fieldsToCheck = [
    'fullName', 'enrollmentNumber', 'collegeEmail', 'personalEmail', 'phone', 'gender',
    'degree', 'branch', 'semester', 'cgpa', 'tenthPercentage', 'twelfthPercentage',
    'backlogs', 'academicStatus', 'primaryDomain', 'primaryLanguage',
    'databaseFamiliarity', 'backendFamiliarity', 'codingPlatform', 'dsaLevel',
    'preferredJobType', 'preferredLocation', 'expectedCompensation',
    'resumeLink', 'linkedIn', 'github'
  ];

  let filledCount = 0;
  
  fieldsToCheck.forEach(field => {
    if (profile[field] && String(profile[field]).trim() !== '') {
      filledCount++;
    }
  });

  // Check array fields separately
  if (profile.technicalSkills && profile.technicalSkills.length > 0) filledCount++;
  if (profile.interestedRoles && profile.interestedRoles.length > 0) filledCount++;
  if (profile.preferredDomains && profile.preferredDomains.length > 0) filledCount++;

  const totalFields = fieldsToCheck.length + 3; 
  return Math.round((filledCount / totalFields) * 100);
};

export const calculateReadinessScore = (profile, completionPct) => {
  if (!profile) return { score: 0, label: "Not Ready" };
  
  // 1. CGPA (30% weight) - Max 30 points
  const cgpa = parseFloat(profile.cgpa) || 0;
  const cgpaScore = Math.min(30, (cgpa / 10) * 30);
  
  // 2. Skills (30% weight) - Max 30 points (5 skills * 6pts = 30)
  const skillCount = profile.technicalSkills ? profile.technicalSkills.length : 0;
  const skillsScore = Math.min(30, skillCount * 6);
  
  // 3. Profile Completion (20% weight) - Max 20 points
  const completionScore = completionPct * 0.20;
  
  // 4. Projects / Links (20% weight) - Max 20 points (2 links * 10pts = 20)
  const linksFound = [profile.resumeLink, profile.linkedIn, profile.github, profile.portfolio]
    .filter(link => link && String(link).trim() !== "").length;
  const linksScore = Math.min(20, linksFound * 10);
  
  const score = Math.round(cgpaScore + skillsScore + completionScore + linksScore);

  let label = "Not Ready";
  if (score >= 71) label = "Placement Ready";
  else if (score >= 41) label = "Partially Ready";

  return { score, label };
};
