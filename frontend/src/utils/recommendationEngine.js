import { prepResources } from '../data/prepResources';

export function getRecommendedResources(opportunity, limit = 4) {
  if (!opportunity) return [];
  
  const { company, missingSkills = [], requiredSkills = [] } = opportunity;
  
  // Score resources based on relevance
  const scoredResources = prepResources.map(res => {
    let score = 0;
    
    // 1. Company Match (Highest weight)
    if (res.company && res.company.toLowerCase() === company.toLowerCase()) {
      score += 10;
    }

    const resString = `${res.title} ${res.topic} ${res.tags.join(' ')}`.toLowerCase();

    // 2. Missing Skills Match (High weight - prioritizing gaps)
    missingSkills.forEach(skill => {
      if (resString.includes(skill.toLowerCase())) {
        score += 5;
      }
    });

    // 3. Required Skills Match (Medium weight - general prep)
    requiredSkills.forEach(skill => {
      if (resString.includes(skill.toLowerCase())) {
        score += 2;
      }
    });
    
    return { ...res, score };
  });

  // Sort by score descending
  scoredResources.sort((a, b) => b.score - a.score);

  // Filter out zero score items if desired, but for dummy data let's just return the top subset
  return scoredResources.slice(0, limit);
}

export function getDashboardRecommendedResources(profile, limit = 4) {
  if (!profile) return [];
  
  const { primaryDomain = "", technicalSkills = [] } = profile;
  
  const scoredResources = prepResources.map(res => {
    let score = 0;
    const resString = `${res.title} ${res.topic} ${res.category} ${res.tags.join(' ')}`.toLowerCase();

    // 1. Primary Domain Match (High weight)
    if (primaryDomain && resString.includes(primaryDomain.toLowerCase())) {
      score += 10;
    }

    // 2. Technical Skills Match
    technicalSkills.forEach(skill => {
      if (resString.includes(skill.toLowerCase())) {
        score += 5;
      }
    });

    // 3. Fallback baseline score so we always show something in dummy data
    score += Math.random(); 
    
    return { ...res, score };
  });

  scoredResources.sort((a, b) => b.score - a.score);
  return scoredResources.slice(0, limit);
}
