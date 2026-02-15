import { COMMON_WORDS } from '../constants';

/**
 * Normalize text by converting to lowercase, removing emojis/punctuation,
 * and filtering common words
 */
export function normalizeText(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    // Remove emojis and special characters
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .split(' ')
    .filter(word => word.length > 0 && !COMMON_WORDS.includes(word))
    .join(' ');
}

/**
 * Calculate Jaccard similarity between two strings (token overlap)
 * Returns a value between 0 and 1
 */
export function jaccardSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const tokens1 = new Set(str1.split(' '));
  const tokens2 = new Set(str2.split(' '));

  if (tokens1.size === 0 && tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return intersection.size / union.size;
}

/**
 * Calculate Levenshtein distance between two strings
 * Returns the number of single-character edits needed
 */
export function levenshteinDistance(str1: string, str2: string): number {
  if (!str1) return str2?.length || 0;
  if (!str2) return str1?.length || 0;

  const matrix: number[][] = [];

  // Initialize first column and row
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str1.length][str2.length];
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a value between 0 and 1
 */
export function levenshteinSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;

  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 1;

  return 1 - (distance / maxLength);
}

/**
 * Calculate title similarity using Jaccard similarity on normalized text
 */
export function calculateTitleSimilarity(title1: string, title2: string): number {
  const normalized1 = normalizeText(title1);
  const normalized2 = normalizeText(title2);

  return jaccardSimilarity(normalized1, normalized2);
}

/**
 * Calculate venue similarity using Levenshtein distance
 */
export function calculateVenueSimilarity(venue1: string | undefined, venue2: string | undefined): number {
  if (!venue1 || !venue2) return 0;

  const normalized1 = normalizeText(venue1);
  const normalized2 = normalizeText(venue2);

  return levenshteinSimilarity(normalized1, normalized2);
}
