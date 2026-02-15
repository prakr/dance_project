import { DeduplicatedEvent, FilterState } from '../types';
import { CONFIDENCE_THRESHOLD } from '../constants';

/**
 * Apply filters to a list of events
 */
export function filterEvents(
  events: DeduplicatedEvent[],
  filters: FilterState
): DeduplicatedEvent[] {
  return events.filter(event => {
    // City filter
    if (filters.city !== 'all' && event.city !== filters.city) {
      return false;
    }

    // Dance type filter
    if (filters.danceType !== 'all' && !event.danceTypes.includes(filters.danceType)) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && event.category !== filters.category) {
      return false;
    }

    // Confidence filter
    if (!filters.showLowConfidence && event.confidenceScore < CONFIDENCE_THRESHOLD) {
      return false;
    }

    return true;
  });
}

/**
 * Sort events by start date (earliest first)
 */
export function sortEventsByDate(events: DeduplicatedEvent[]): DeduplicatedEvent[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.startDateTime);
    const dateB = new Date(b.startDateTime);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Apply filters and sort events
 */
export function filterAndSortEvents(
  events: DeduplicatedEvent[],
  filters: FilterState
): DeduplicatedEvent[] {
  const filtered = filterEvents(events, filters);
  return sortEventsByDate(filtered);
}
