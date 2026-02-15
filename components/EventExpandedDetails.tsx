import { DeduplicatedEvent } from '@/lib/types';
import { DANCE_TYPE_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, DollarSign, User, Info } from 'lucide-react';
import SourceList from './SourceList';

interface EventExpandedDetailsProps {
  event: DeduplicatedEvent;
}

export default function EventExpandedDetails({ event }: EventExpandedDetailsProps) {
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p'); // e.g., "February 20th, 2026 at 8:00 PM"
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
      {/* Dance Types */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Dance Types</h4>
        <div className="flex flex-wrap gap-2">
          {event.danceTypes.map((type) => (
            <span
              key={type}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${DANCE_TYPE_COLORS[type]}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {/* Date/Time */}
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-700">Start</div>
            <div className="text-gray-600">{formatDateTime(event.startDateTime)}</div>
          </div>
        </div>

        {event.endDateTime && (
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">End</div>
              <div className="text-gray-600">{formatDateTime(event.endDateTime)}</div>
            </div>
          </div>
        )}

        {/* Venue */}
        {event.venueName && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">Venue</div>
              <div className="text-gray-600">{event.venueName}</div>
              {event.address && <div className="text-gray-500 text-xs">{event.address}</div>}
            </div>
          </div>
        )}

        {/* Price */}
        {event.price && (
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">Price</div>
              <div className="text-gray-600">{event.price}</div>
            </div>
          </div>
        )}

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-700">Organizer</div>
              <div className="text-gray-600">{event.organizer}</div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* Confidence Breakdown */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <Info className="w-4 h-4" />
          Confidence Breakdown
        </h4>
        <div className="space-y-1 text-xs text-gray-600">
          {event.confidenceBreakdown.hasVenue > 0 && (
            <div className="flex justify-between">
              <span>Has venue information</span>
              <span className="font-medium text-green-600">+{event.confidenceBreakdown.hasVenue}</span>
            </div>
          )}
          {event.confidenceBreakdown.hasDateTime > 0 && (
            <div className="flex justify-between">
              <span>Has date/time</span>
              <span className="font-medium text-green-600">+{event.confidenceBreakdown.hasDateTime}</span>
            </div>
          )}
          {event.confidenceBreakdown.hasSourceUrl > 0 && (
            <div className="flex justify-between">
              <span>Has source URL</span>
              <span className="font-medium text-green-600">+{event.confidenceBreakdown.hasSourceUrl}</span>
            </div>
          )}
          {event.confidenceBreakdown.multipleSourcesBonus > 0 && (
            <div className="flex justify-between">
              <span>Multiple sources ({event.sources.length})</span>
              <span className="font-medium text-green-600">+{event.confidenceBreakdown.multipleSourcesBonus}</span>
            </div>
          )}
          {event.confidenceBreakdown.stalenesssPenalty < 0 && (
            <div className="flex justify-between">
              <span>Not recently updated</span>
              <span className="font-medium text-red-600">{event.confidenceBreakdown.stalenesssPenalty}</span>
            </div>
          )}
          {event.confidenceBreakdown.descriptionPenalty < 0 && (
            <div className="flex justify-between">
              <span>Limited description</span>
              <span className="font-medium text-red-600">{event.confidenceBreakdown.descriptionPenalty}</span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-semibold">
            <span>Total Confidence</span>
            <span>{event.confidenceBreakdown.total}</span>
          </div>
        </div>
      </div>

      {/* Sources */}
      <SourceList sources={event.sources} sourceUrl={event.sourceUrl} />
    </div>
  );
}
