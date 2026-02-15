'use client';

import { DeduplicatedEvent } from '@/lib/types';
import { format } from 'date-fns';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import CategoryBadge from './CategoryBadge';
import FreshnessBadge from './FreshnessBadge';
import EventExpandedDetails from './EventExpandedDetails';

interface EventCardProps {
  event: DeduplicatedEvent;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function EventCard({ event, isExpanded, onToggleExpand }: EventCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEE, MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className="p-4 cursor-pointer"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {event.title}
            </h3>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <CategoryBadge category={event.category} />
              <ConfidenceBadge score={event.confidenceScore} />
              <FreshnessBadge isStale={event.isStale} />
              {event.sources.length > 1 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {event.sources.length} sources
                </span>
              )}
            </div>

            {/* Location and Date */}
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">{event.city}</span>
                {event.venueName && (
                  <>
                    <span>•</span>
                    <span>{event.venueName}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{formatDate(event.startDateTime)}</span>
                <span>•</span>
                <span>{formatTime(event.startDateTime)}</span>
              </div>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && <EventExpandedDetails event={event} />}
      </div>
    </div>
  );
}
