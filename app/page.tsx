'use client';

import { useState, useEffect } from 'react';
import { DeduplicatedEvent, FilterState, RawEventItem } from '@/lib/types';
import { deduplicateEvents } from '@/lib/utils/deduplication';
import { filterAndSortEvents } from '@/lib/utils/filters';
import { searchEvents } from '@/lib/utils/search';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import FiltersBar from '@/components/FiltersBar';
import EventCard from '@/components/EventCard';
import rawEventsData from '@/lib/data/raw-events.json';

export default function Home() {
  // State
  const [deduplicatedEvents, setDeduplicatedEvents] = useState<DeduplicatedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<DeduplicatedEvent[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    city: 'all',
    danceType: 'all',
    category: 'all',
    showLowConfidence: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load and deduplicate events on mount
  useEffect(() => {
    try {
      const rawEvents = rawEventsData as RawEventItem[];
      const deduplicated = deduplicateEvents(rawEvents);
      setDeduplicatedEvents(deduplicated);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setIsLoading(false);
    }
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    if (deduplicatedEvents.length > 0) {
      // First apply regular filters
      let filtered = filterAndSortEvents(deduplicatedEvents, filters);

      // Then apply search
      if (searchQuery) {
        filtered = searchEvents(filtered, searchQuery);
      }

      setFilteredEvents(filtered);
    }
  }, [deduplicatedEvents, filters, searchQuery]);

  // Handle expanding/collapsing event cards
  const handleToggleExpand = (eventId: string) => {
    setExpandedEventId((prev) => (prev === eventId ? null : eventId));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchBar={
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events, venues, cities..."
          />
        }
      />

      <main className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Filters */}
        <div className="mb-6">
          <FiltersBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Stats */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-brand-primary">{filteredEvents.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{deduplicatedEvents.length}</span> events
            </p>
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Deduplicated from {rawEventsData.length} raw event sources
          </p>
        </div>

        {/* Event List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12 text-center">
            <p className="text-gray-600 mb-2 text-sm md:text-base">
              {searchQuery ? `No events found for "${searchQuery}"` : 'No events found matching your filters'}
            </p>
            <p className="text-xs md:text-sm text-gray-500">
              {searchQuery
                ? 'Try a different search term or adjust your filters'
                : 'Try adjusting your filters or enabling low-confidence events'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.dedupeGroupId}
                event={event}
                isExpanded={expandedEventId === event.dedupeGroupId}
                onToggleExpand={() => handleToggleExpand(event.dedupeGroupId)}
              />
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-gray-200">
          <p className="text-xs md:text-sm text-gray-500 text-center">
            This is a demo prototype showcasing event aggregation and deduplication capabilities.
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </main>
    </div>
  );
}
