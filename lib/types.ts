// Raw event item before deduplication
export interface RawEventItem {
  id: string;
  title: string;
  danceTypes: DanceType[];
  category: EventCategory;
  city: City;
  venueName?: string;
  address?: string;
  startDateTime: string; // ISO 8601 format
  endDateTime?: string; // ISO 8601 format
  source: EventSource;
  sourceUrl?: string;
  lastSeenAt: string; // ISO 8601 format
  price?: string;
  organizer?: string;
  description?: string;
}

// Deduplicated event after processing
export interface DeduplicatedEvent extends RawEventItem {
  confidenceScore: number; // 0-100
  confidenceBreakdown: ConfidenceBreakdown;
  isStale: boolean;
  sources: EventSource[]; // All contributing sources
  rawEventIds: string[]; // IDs of raw events that were merged
  dedupeGroupId: string;
  oldestLastSeen?: string;
  newestLastSeen?: string;
}

// Confidence score breakdown
export interface ConfidenceBreakdown {
  hasVenue: number;
  hasDateTime: number;
  hasSourceUrl: number;
  multipleSourcesBonus: number;
  stalenesssPenalty: number;
  descriptionPenalty: number;
  total: number;
}

// Filter state
export interface FilterState {
  city: City | 'all';
  danceType: DanceType | 'all';
  category: EventCategory | 'all';
  showLowConfidence: boolean;
}

// Enums and types
export type City = 'Stockholm' | 'Gothenburg' | 'Malmö';
export type DanceType = 'Salsa' | 'Bachata' | 'Kizomba';
export type EventCategory = 'Social' | 'Class' | 'Congress';
export type EventSource = 'facebook' | 'instagram' | 'whatsapp' | 'website';

// Similarity match result
export interface SimilarityMatch {
  titleSimilarity: number;
  venueSimilarity: number;
  isDuplicate: boolean;
}
