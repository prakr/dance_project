import { RawEventItem, ConfidenceBreakdown } from '../types';
import { STALENESS_DAYS } from '../constants';

/**
 * Calculate confidence score for an event (0-100)
 *
 * Scoring breakdown:
 * +25: Has venue name
 * +15: Has start date/time
 * +10: Has source URL
 * +20: Appears in 2+ sources (bonus)
 * -20: Last seen > 10 days ago
 * -15: Description < 30 chars or missing
 */
export function computeConfidence(
  event: RawEventItem,
  sourceCount: number = 1
): { score: number; breakdown: ConfidenceBreakdown } {
  let score = 0;
  const breakdown: ConfidenceBreakdown = {
    hasVenue: 0,
    hasDateTime: 0,
    hasSourceUrl: 0,
    multipleSourcesBonus: 0,
    stalenesssPenalty: 0,
    descriptionPenalty: 0,
    total: 0,
  };

  // +25 for venue
  if (event.venueName && event.venueName.trim().length > 0) {
    breakdown.hasVenue = 25;
    score += 25;
  }

  // +15 for date/time
  if (event.startDateTime) {
    breakdown.hasDateTime = 15;
    score += 15;
  }

  // +10 for source URL
  if (event.sourceUrl && event.sourceUrl.trim().length > 0) {
    breakdown.hasSourceUrl = 10;
    score += 10;
  }

  // +20 for multiple sources
  if (sourceCount >= 2) {
    breakdown.multipleSourcesBonus = 20;
    score += 20;
  }

  // -20 for staleness (last seen > STALENESS_DAYS days ago)
  if (event.lastSeenAt) {
    const daysSinceLastSeen = getDaysSince(event.lastSeenAt);
    if (daysSinceLastSeen > STALENESS_DAYS) {
      breakdown.stalenesssPenalty = -20;
      score -= 20;
    }
  }

  // -15 for poor description
  if (!event.description || event.description.trim().length < 30) {
    breakdown.descriptionPenalty = -15;
    score -= 15;
  }

  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, score));
  breakdown.total = score;

  return { score, breakdown };
}

/**
 * Check if an event is stale (last seen more than STALENESS_DAYS days ago)
 */
export function isEventStale(lastSeenAt: string): boolean {
  return getDaysSince(lastSeenAt) > STALENESS_DAYS;
}

/**
 * Get number of days since a given date
 */
function getDaysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}
