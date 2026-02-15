import { DeduplicatedEvent } from '../types';

/**
 * Search events by query string
 * Searches across: title, venue, city, organizer, description
 */
export function searchEvents(
  events: DeduplicatedEvent[],
  query: string
): DeduplicatedEvent[] {
  if (!query || query.trim() === '') {
    return events;
  }

  const searchTerm = query.toLowerCase().trim();

  return events.filter((event) => {
    // Search in title
    if (event.title.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in venue name
    if (event.venueName?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in city
    if (event.city.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in organizer
    if (event.organizer?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in description
    if (event.description?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Search in dance types
    if (event.danceTypes.some(type => type.toLowerCase().includes(searchTerm))) {
      return true;
    }

    // Search in category
    if (event.category.toLowerCase().includes(searchTerm)) {
      return true;
    }

    return false;
  });
}
