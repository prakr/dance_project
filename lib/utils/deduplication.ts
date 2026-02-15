import { RawEventItem, DeduplicatedEvent, SimilarityMatch } from '../types';
import {
  TIME_WINDOW_HOURS,
  TITLE_SIMILARITY_THRESHOLD,
  VENUE_SIMILARITY_THRESHOLD,
} from '../constants';
import {
  calculateTitleSimilarity,
  calculateVenueSimilarity,
} from './normalization';
import { computeConfidence, isEventStale } from './confidence';

/**
 * Check if two events are duplicates based on similarity heuristics
 */
export function areDuplicates(event1: RawEventItem, event2: RawEventItem): SimilarityMatch {
  // Must be in the same city
  if (event1.city !== event2.city) {
    return { titleSimilarity: 0, venueSimilarity: 0, isDuplicate: false };
  }

  // Must have start times within TIME_WINDOW_HOURS
  if (!areTimesClose(event1.startDateTime, event2.startDateTime, TIME_WINDOW_HOURS)) {
    return { titleSimilarity: 0, venueSimilarity: 0, isDuplicate: false };
  }

  // Calculate similarities
  const titleSimilarity = calculateTitleSimilarity(event1.title, event2.title);
  const venueSimilarity = calculateVenueSimilarity(event1.venueName, event2.venueName);

  // Consider duplicates if:
  // - Title similarity > threshold OR
  // - Venue similarity > threshold (and both have venues)
  const isDuplicate =
    titleSimilarity > TITLE_SIMILARITY_THRESHOLD ||
    (venueSimilarity > VENUE_SIMILARITY_THRESHOLD && event1.venueName && event2.venueName);

  return { titleSimilarity, venueSimilarity, isDuplicate };
}

/**
 * Check if two timestamps are within a given number of hours
 */
function areTimesClose(time1: string, time2: string, hours: number): boolean {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= hours;
}

/**
 * Merge a group of duplicate events into a single deduplicated event
 * Chooses the most complete event as canonical and tracks all sources
 */
export function mergeEventGroup(events: RawEventItem[]): DeduplicatedEvent {
  if (events.length === 0) {
    throw new Error('Cannot merge empty event group');
  }

  // Sort by completeness (prefer events with more fields filled)
  const sortedEvents = [...events].sort((a, b) => {
    return getCompletenessScore(b) - getCompletenessScore(a);
  });

  // Use the most complete event as the base
  const canonicalEvent = sortedEvents[0];

  // Collect all sources and IDs
  const sources = [...new Set(events.map(e => e.source))];
  const rawEventIds = events.map(e => e.id);
  const dedupeGroupId = `group-${rawEventIds.sort().join('-')}`;

  // Find oldest and newest lastSeenAt
  const lastSeenDates = events
    .map(e => new Date(e.lastSeenAt))
    .sort((a, b) => a.getTime() - b.getTime());
  const oldestLastSeen = lastSeenDates[0].toISOString();
  const newestLastSeen = lastSeenDates[lastSeenDates.length - 1].toISOString();

  // Merge fields - prefer non-empty values from any event
  const merged: RawEventItem = {
    ...canonicalEvent,
    venueName: findBestValue(events, e => e.venueName) || canonicalEvent.venueName,
    address: findBestValue(events, e => e.address) || canonicalEvent.address,
    description: findBestValue(events, e => e.description, (desc) => desc?.length || 0) || canonicalEvent.description,
    sourceUrl: findBestValue(events, e => e.sourceUrl) || canonicalEvent.sourceUrl,
    price: findBestValue(events, e => e.price) || canonicalEvent.price,
    organizer: findBestValue(events, e => e.organizer) || canonicalEvent.organizer,
    endDateTime: findBestValue(events, e => e.endDateTime) || canonicalEvent.endDateTime,
  };

  // Compute confidence score
  const { score, breakdown } = computeConfidence(merged, sources.length);

  // Check if stale
  const stale = isEventStale(newestLastSeen);

  // Build deduplicated event
  const deduplicatedEvent: DeduplicatedEvent = {
    ...merged,
    confidenceScore: score,
    confidenceBreakdown: breakdown,
    isStale: stale,
    sources,
    rawEventIds,
    dedupeGroupId,
    oldestLastSeen,
    newestLastSeen,
  };

  return deduplicatedEvent;
}

/**
 * Get completeness score for an event (higher is more complete)
 */
function getCompletenessScore(event: RawEventItem): number {
  let score = 0;
  if (event.venueName) score += 3;
  if (event.address) score += 2;
  if (event.description && event.description.length > 30) score += 4;
  if (event.sourceUrl) score += 2;
  if (event.price) score += 1;
  if (event.organizer) score += 1;
  if (event.endDateTime) score += 1;
  return score;
}

/**
 * Find the best (most complete) value from a list of events
 */
function findBestValue<T>(
  events: RawEventItem[],
  getter: (event: RawEventItem) => T | undefined,
  scorer: (value: T) => number = () => 1
): T | undefined {
  let bestValue: T | undefined;
  let bestScore = -1;

  for (const event of events) {
    const value = getter(event);
    if (value) {
      const score = scorer(value);
      if (score > bestScore) {
        bestScore = score;
        bestValue = value;
      }
    }
  }

  return bestValue;
}

/**
 * Main deduplication function - groups duplicates and merges them
 */
export function deduplicateEvents(rawEvents: RawEventItem[]): DeduplicatedEvent[] {
  // Track which events have been assigned to groups
  const assigned = new Set<string>();
  const groups: RawEventItem[][] = [];

  // For each event, find all duplicates and create a group
  for (let i = 0; i < rawEvents.length; i++) {
    const event1 = rawEvents[i];

    // Skip if already assigned to a group
    if (assigned.has(event1.id)) continue;

    // Start a new group
    const group: RawEventItem[] = [event1];
    assigned.add(event1.id);

    // Find all duplicates
    for (let j = i + 1; j < rawEvents.length; j++) {
      const event2 = rawEvents[j];

      // Skip if already assigned
      if (assigned.has(event2.id)) continue;

      // Check if duplicate
      const match = areDuplicates(event1, event2);
      if (match.isDuplicate) {
        group.push(event2);
        assigned.add(event2.id);
      }
    }

    groups.push(group);
  }

  // Merge each group into a deduplicated event
  return groups.map(group => mergeEventGroup(group));
}
