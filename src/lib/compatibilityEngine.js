// KadamFind Deterministic Travel Compatibility Engine

export const COMPATIBILITY_WEIGHTS = {
  destination: 0.25,            // 25%
  interests: 0.30,              // 30%
  travelStyle: 0.15,            // 15%
  dates: 0.15,                  // 15%
  budget: 0.05,                 // 5%
  activity: 0.05,               // 5%
  accommodationTransport: 0.05 // 5%
};

/**
 * Calculates interest compatibility score using set intersection ratio.
 */
export function calculateInterestCompatibility(interestsA = [], interestsB = []) {
  if (!interestsA.length || !interestsB.length) return 0;
  
  const setA = new Set(interestsA.map(i => i.toLowerCase().trim()));
  const setB = new Set(interestsB.map(i => i.toLowerCase().trim()));
  
  let commonCount = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      commonCount++;
    }
  }
  
  // Set intersection ratio relative to max size
  const maxSize = Math.max(setA.size, setB.size);
  return maxSize > 0 ? (commonCount / maxSize) : 0;
}

/**
 * Calculates destination compatibility score.
 */
export function calculateDestinationCompatibility(destA, destB, prefDestsA = [], prefDestsB = []) {
  const normA = (destA || '').toLowerCase().trim();
  const normB = (destB || '').toLowerCase().trim();

  // Exact primary destination match
  if (normA && normB && normA === normB) {
    return 1.0;
  }

  // Check overlap in preferred destinations lists
  const listA = [normA, ...prefDestsA.map(d => (d || '').toLowerCase().trim())].filter(Boolean);
  const listB = [normB, ...prefDestsB.map(d => (d || '').toLowerCase().trim())].filter(Boolean);

  const hasOverlap = listA.some(d => listB.includes(d));
  if (hasOverlap) {
    return 0.75;
  }

  return 0.0;
}

/**
 * Calculates date compatibility score.
 */
export function calculateDateCompatibility(datesA, datesB, flexA = true, flexB = true) {
  const normA = (datesA || '').toLowerCase().trim();
  const normB = (datesB || '').toLowerCase().trim();

  // Exact dates string match
  if (normA && normB && normA === normB) {
    return 1.0;
  }

  // If either user has flexible dates
  if (flexA || flexB || normA.includes('flex') || normB.includes('flex')) {
    return 0.75;
  }

  // Partial substring overlap (e.g. "October" in both)
  if (normA && normB) {
    const wordsA = normA.split(/\s+/);
    const wordsB = normB.split(/\s+/);
    const commonWords = wordsA.filter(w => w.length > 2 && wordsB.includes(w));
    if (commonWords.length > 0) {
      return 0.6;
    }
  }

  return 0.2;
}

/**
 * Calculates travel style compatibility.
 */
export function calculateStyleCompatibility(styleA, styleB) {
  const sA = (styleA || '').toLowerCase().trim();
  const sB = (styleB || '').toLowerCase().trim();

  if (sA && sB && sA === sB) {
    return 1.0;
  }

  // Compatible travel style pairings
  const compatiblePairs = [
    ['adventure', 'nature'],
    ['relaxed', 'cultural'],
    ['backpacker', 'digital nomad'],
    ['food-focused', 'cultural'],
    ['photography', 'nature'],
    ['luxury', 'relaxed']
  ];

  const isCompatible = compatiblePairs.some(
    ([x, y]) => (sA.includes(x) && sB.includes(y)) || (sA.includes(y) && sB.includes(x))
  );

  if (isCompatible) {
    return 0.6;
  }

  return 0.2;
}

/**
 * Calculates overall Travel Compatibility score (0% to 100%).
 * Note: Gender is NEVER factored into this score.
 */
export function calculateTravelCompatibility(userA, userB) {
  // 1. Interest Score (30%)
  const interestRatio = calculateInterestCompatibility(userA.interests || [], userB.interests || []);
  const interestScore = interestRatio * 100 * COMPATIBILITY_WEIGHTS.interests;

  // 2. Destination Score (25%)
  const destRatio = calculateDestinationCompatibility(
    userA.destination, userB.destination,
    userA.preferredDestinations || [], userB.preferredDestinations || []
  );
  const destScore = destRatio * 100 * COMPATIBILITY_WEIGHTS.destination;

  // 3. Travel Style Score (15%)
  const styleRatio = calculateStyleCompatibility(userA.travelStyle, userB.travelStyle);
  const styleScore = styleRatio * 100 * COMPATIBILITY_WEIGHTS.travelStyle;

  // 4. Date Score (15%)
  const dateRatio = calculateDateCompatibility(
    userA.travelDates, userB.travelDates,
    userA.flexibleDates, userB.flexibleDates
  );
  const dateScore = dateRatio * 100 * COMPATIBILITY_WEIGHTS.dates;

  // 5. Budget Score (5%)
  const bA = (userA.budget || '').toLowerCase();
  const bB = (userB.budget || '').toLowerCase();
  const budgetRatio = bA === bB ? 1.0 : (bA.includes('flex') || bB.includes('flex')) ? 0.7 : 0.3;
  const budgetScore = budgetRatio * 100 * COMPATIBILITY_WEIGHTS.budget;

  // 6. Activity Score (5%)
  const activityScore = interestRatio * 100 * COMPATIBILITY_WEIGHTS.activity;

  // 7. Accommodation/Transport Score (5%)
  const accA = (userA.accommodation || '').toLowerCase();
  const accB = (userB.accommodation || '').toLowerCase();
  const accRatio = accA === accB ? 1.0 : 0.4;
  const accScore = accRatio * 100 * COMPATIBILITY_WEIGHTS.accommodationTransport;

  const totalScore = Math.round(
    interestScore + destScore + styleScore + dateScore + budgetScore + activityScore + accScore
  );

  return Math.min(100, Math.max(10, totalScore));
}

/**
 * Filters candidates by gender preference as a strict result set filter.
 * DOES NOT modify compatibility scores.
 */
export function filterCandidatesByGender(candidates, genderPref) {
  if (!genderPref || genderPref === 'Any Gender' || genderPref === 'Any') {
    return candidates;
  }

  const prefNorm = genderPref.toLowerCase();

  return candidates.filter(c => {
    const cGender = (c.gender || '').toLowerCase();
    if (prefNorm.includes('female')) {
      return cGender === 'female';
    }
    if (prefNorm.includes('male')) {
      return cGender === 'male';
    }
    return true;
  });
}

/**
 * Ranks candidates against a target user profile:
 * - Excludes current user & blocked users
 * - Excludes incomplete profiles (< 60% completion)
 * - Excludes deleted/suspended users
 * - Applies gender filter preference to result set
 * - Sorts by Travel Compatibility Score descending
 */
export function rankTravelCompanions(currentUser, candidateProfiles, options = {}) {
  const {
    blockedUserIds = [],
    genderPref = 'Any Gender',
    targetDestination = ''
  } = options;

  const currentId = currentUser?.id || currentUser?.user_id;

  // Deduplicate and filter out invalid candidates
  const seenIds = new Set();
  const validCandidates = [];

  for (const candidate of candidateProfiles) {
    const candId = candidate.id || candidate.user_id;
    if (!candId) continue;

    // 1. Exclude self match
    if (currentId && candId === currentId) continue;

    // 2. Exclude blocked users
    if (blockedUserIds.includes(candId)) continue;

    // 3. Exclude duplicate profiles
    if (seenIds.has(candId)) continue;
    seenIds.add(candId);

    // 4. Exclude suspended/inactive accounts
    if (candidate.account_status && candidate.account_status !== 'active') continue;

    // 5. Exclude incomplete profiles (< 60% completion)
    if (candidate.completionScore !== undefined && candidate.completionScore < 60) continue;

    validCandidates.push(candidate);
  }

  // Apply Gender Filter to result set (does not touch score)
  const filteredCandidates = filterCandidatesByGender(validCandidates, genderPref);

  // Compute deterministic compatibility score for each candidate
  const scoredCandidates = filteredCandidates.map(c => {
    // Determine common interests array
    const userAInterests = currentUser?.interests || [];
    const userBInterests = c.interests || c.tags || [];
    const commonInterests = userAInterests.filter(i => 
      userBInterests.map(x => x.toLowerCase().replace('#', '')).includes(i.toLowerCase().replace('#', ''))
    );

    const compatibilityPercent = calculateTravelCompatibility(
      {
        destination: targetDestination || currentUser?.destination,
        preferredDestinations: currentUser?.preferredDestinations || [],
        interests: userAInterests,
        travelStyle: currentUser?.travelStyle,
        travelDates: currentUser?.travelDates,
        flexibleDates: currentUser?.flexibleDates,
        budget: currentUser?.budget,
        accommodation: currentUser?.accommodation
      },
      {
        destination: c.destination,
        preferredDestinations: c.preferredDestinations || [],
        interests: userBInterests,
        travelStyle: c.vibe || c.travelStyle,
        travelDates: c.dates || c.travelDates,
        flexibleDates: c.flexibleDates,
        budget: c.splitCost || c.budget,
        accommodation: c.accommodation
      }
    );

    return {
      ...c,
      matchScore: compatibilityPercent,
      compatibilityPercent,
      commonInterests
    };
  });

  // Sort descending by highest compatibility percentage
  scoredCandidates.sort((a, b) => b.compatibilityPercent - a.compatibilityPercent);

  return scoredCandidates;
}
