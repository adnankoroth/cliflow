/**
 * Fuzzy matching algorithm for CLIFlow
 * Inspired by fzf's algorithm for fast, intuitive matching
 */

export interface FuzzyMatch {
  score: number;
  indices: number[];  // Positions of matched characters
}

/**
 * Calculate fuzzy match score between query and target string
 * Returns null if no match, or a FuzzyMatch object with score and matched positions
 * 
 * Scoring:
 * - Consecutive matches: bonus points
 * - Match at start of word: bonus points  
 * - Match at start of string: bonus points
 * - Gaps between matches: penalty
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
  if (!query) return { score: 0, indices: [] };
  if (!target) return null;
  
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();
  
  // Quick check: all query chars must exist in target
  let checkIdx = 0;
  for (const char of queryLower) {
    const found = targetLower.indexOf(char, checkIdx);
    if (found === -1) return null;
    checkIdx = found + 1;
  }
  
  // Find best match using dynamic programming approach
  const result = findBestMatch(queryLower, targetLower, target);
  return result;
}

function findBestMatch(query: string, targetLower: string, targetOriginal: string): FuzzyMatch | null {
  const queryLen = query.length;
  const targetLen = targetLower.length;
  
  if (queryLen === 0) return { score: 0, indices: [] };
  if (targetLen === 0) return null;
  
  // Score matrix and tracking
  const scores: number[][] = [];
  const matches: number[][] = [];
  
  for (let i = 0; i <= queryLen; i++) {
    scores[i] = new Array(targetLen + 1).fill(-Infinity);
    matches[i] = new Array(targetLen + 1).fill(-1);
  }
  scores[0].fill(0);
  
  // Bonus calculations
  const getBonus = (idx: number): number => {
    if (idx === 0) return 10; // Start of string
    
    const prev = targetOriginal[idx - 1];
    const curr = targetOriginal[idx];
    
    // Word boundary (after separator or case change)
    if (prev === '-' || prev === '_' || prev === ' ' || prev === '/' || prev === '.') {
      return 8; // After separator
    }
    if (prev >= 'a' && prev <= 'z' && curr >= 'A' && curr <= 'Z') {
      return 7; // camelCase boundary
    }
    if (prev >= 'A' && prev <= 'Z' && curr >= 'A' && curr <= 'Z') {
      return 2; // ALLCAPS continuation
    }
    
    return 0;
  };
  
  // Fill the matrix
  for (let i = 1; i <= queryLen; i++) {
    const qChar = query[i - 1];
    let maxScore = -Infinity;
    
    for (let j = 1; j <= targetLen; j++) {
      const tChar = targetLower[j - 1];
      
      if (qChar === tChar) {
        // Character matches
        const bonus = getBonus(j - 1);
        
        // Option 1: Continue from previous match (consecutive)
        const consecutiveScore = scores[i - 1][j - 1] + 3 + bonus + (matches[i - 1][j - 1] === j - 2 ? 4 : 0);
        
        // Option 2: Start fresh match (gap)
        let gapScore = -Infinity;
        for (let k = 0; k < j - 1; k++) {
          const gapPenalty = Math.min((j - 1 - k - 1) * 0.5, 3); // Gap penalty capped at 3
          const score = scores[i - 1][k + 1] + 3 + bonus - gapPenalty;
          if (score > gapScore) {
            gapScore = score;
          }
        }
        
        // Take best option
        if (consecutiveScore >= gapScore && consecutiveScore > scores[i][j]) {
          scores[i][j] = consecutiveScore;
          matches[i][j] = j - 1;
        } else if (gapScore > scores[i][j]) {
          scores[i][j] = gapScore;
          matches[i][j] = j - 1;
        }
        
        maxScore = Math.max(maxScore, scores[i][j]);
      }
    }
    
    // If no matches possible for this query char, fail
    if (maxScore === -Infinity) return null;
  }
  
  // Find best ending position
  let bestScore = -Infinity;
  let bestEnd = -1;
  for (let j = 1; j <= targetLen; j++) {
    if (scores[queryLen][j] > bestScore) {
      bestScore = scores[queryLen][j];
      bestEnd = j;
    }
  }
  
  if (bestScore === -Infinity) return null;
  
  // Backtrack to find matched indices
  const indices: number[] = [];
  let i = queryLen;
  let j = bestEnd;
  
  while (i > 0 && j > 0) {
    if (matches[i][j] !== -1) {
      indices.unshift(matches[i][j]);
      // Find where this match came from
      const matchedAt = matches[i][j];
      i--;
      j = matchedAt; // Move to column before match
    } else {
      j--;
    }
  }
  
  // Normalize score based on target length (shorter matches rank higher)
  const normalizedScore = bestScore - (targetLen - queryLen) * 0.1;
  
  return {
    score: normalizedScore,
    indices
  };
}

/**
 * Simple fuzzy filter and sort for a list of items
 */
export function fuzzyFilter<T>(
  items: T[],
  query: string,
  getKey: (item: T) => string
): Array<{ item: T; match: FuzzyMatch }> {
  if (!query) {
    return items.map(item => ({ item, match: { score: 0, indices: [] } }));
  }
  
  const results: Array<{ item: T; match: FuzzyMatch }> = [];
  
  for (const item of items) {
    const key = getKey(item);
    const match = fuzzyMatch(query, key);
    if (match) {
      results.push({ item, match });
    }
  }
  
  // Sort by score descending
  results.sort((a, b) => b.match.score - a.match.score);
  
  return results;
}

/**
 * Check if query is a prefix of target (for prioritizing prefix matches)
 */
export function isPrefix(query: string, target: string): boolean {
  return target.toLowerCase().startsWith(query.toLowerCase());
}

/**
 * Combined ranking: prefix matches first, then fuzzy matches by score
 */
export function fuzzyRank<T>(
  items: T[],
  query: string,
  getKey: (item: T) => string
): T[] {
  if (!query) return items;
  
  const results = fuzzyFilter(items, query, getKey);
  
  // Separate prefix matches from fuzzy-only matches
  const prefixMatches: Array<{ item: T; match: FuzzyMatch }> = [];
  const fuzzyMatches: Array<{ item: T; match: FuzzyMatch }> = [];
  
  for (const result of results) {
    if (isPrefix(query, getKey(result.item))) {
      prefixMatches.push(result);
    } else {
      fuzzyMatches.push(result);
    }
  }
  
  // Return prefix matches first, then fuzzy matches
  return [
    ...prefixMatches.map(r => r.item),
    ...fuzzyMatches.map(r => r.item)
  ];
}
