import { City, DanceType, EventCategory, EventSource } from './types';

// Available cities
export const CITIES: City[] = ['Stockholm', 'Gothenburg', 'Malmö'];

// Available dance types
export const DANCE_TYPES: DanceType[] = ['Salsa', 'Bachata', 'Kizomba'];

// Event categories
export const EVENT_CATEGORIES: EventCategory[] = ['Social', 'Class', 'Congress'];

// Event sources
export const EVENT_SOURCES: EventSource[] = ['facebook', 'instagram', 'whatsapp', 'website'];

// Thresholds
export const CONFIDENCE_THRESHOLD = 50; // Low confidence threshold
export const STALENESS_DAYS = 10; // Days before event is considered stale
export const TIME_WINDOW_HOURS = 2; // Hours within which events are considered same time
export const TITLE_SIMILARITY_THRESHOLD = 0.6; // Minimum title similarity for duplicate
export const VENUE_SIMILARITY_THRESHOLD = 0.8; // Minimum venue similarity for duplicate

// Common words to filter out during normalization
export const COMMON_WORDS = [
  'party',
  'social',
  'dance',
  'dancing',
  'night',
  'event',
  'workshop',
  'class',
  'lesson',
  'congress',
  'festival',
  'the',
  'a',
  'an',
  'and',
  'or',
  'at',
  'in',
  'on',
  'with',
];

// Source display names and icons
export const SOURCE_INFO: Record<EventSource, { name: string; color: string }> = {
  facebook: { name: 'Facebook', color: 'text-blue-600' },
  instagram: { name: 'Instagram', color: 'text-pink-600' },
  whatsapp: { name: 'WhatsApp', color: 'text-green-600' },
  website: { name: 'Website', color: 'text-purple-600' },
};

// Category colors
export const CATEGORY_COLORS: Record<EventCategory, string> = {
  Social: 'bg-blue-100 text-blue-800',
  Class: 'bg-green-100 text-green-800',
  Congress: 'bg-purple-100 text-purple-800',
};

// Dance type colors
export const DANCE_TYPE_COLORS: Record<DanceType, string> = {
  Salsa: 'bg-red-100 text-red-800',
  Bachata: 'bg-orange-100 text-orange-800',
  Kizomba: 'bg-indigo-100 text-indigo-800',
};
