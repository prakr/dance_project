# Calaii - Latin Dance Events Aggregator

A stakeholder demo prototype for Calaii, a platform that aggregates Latin dance events (Salsa, Bachata, Kizomba) across Sweden from multiple sources.

## Overview

Calaii solves the problem of fragmented event information in the Latin dance community. Currently, events are scattered across Facebook, Instagram, WhatsApp groups, and individual websites. This demo showcases:

- **Event Aggregation**: Simulated data from 4 sources (Facebook, Instagram, WhatsApp, Website)
- **Smart Deduplication**: Heuristic-based algorithm to merge duplicate events from different sources
- **Confidence Scoring**: Data quality assessment (0-100) to help users trust event information
- **Intelligent Filtering**: Search by city, dance type, category, and confidence level

**Note**: This is a proof-of-concept using simulated data to demonstrate the platform's capabilities. In production, events would be continuously scraped from real sources.

## Features

### 1. Event Deduplication
- Normalizes event titles (removes emojis, punctuation, common words)
- Matches events by city, time window (±2 hours), and similarity scores
- Uses Jaccard similarity for titles and Levenshtein distance for venues
- Merges duplicate events while preserving source provenance

### 2. Confidence Scoring
Each event receives a confidence score (0-100) based on:
- **+25 points**: Has venue name
- **+15 points**: Has start date/time
- **+10 points**: Has source URL
- **+20 points**: Appears in 2+ sources
- **-20 points**: Last seen >10 days ago (stale)
- **-15 points**: Missing or minimal description

### 3. User Experience
- Clean, responsive interface (mobile, tablet, desktop)
- Filter by city (Stockholm, Gothenburg, Malmö)
- Filter by dance type (Salsa, Bachata, Kizomba)
- Filter by category (Social, Class, Congress)
- Toggle to show/hide low-confidence events (threshold: 50)
- Expandable event cards with full details
- Visual badges for confidence, category, and freshness
- Source transparency (shows all contributing sources)

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **date-fns** for date formatting
- **lucide-react** for icons
- **Local JSON** as data source (no backend needed for demo)

## Getting Started

### Prerequisites

Before running this project, you need to install Node.js and npm:

**Option 1: Using Homebrew (macOS)**
```bash
brew install node
```

**Option 2: Download from nodejs.org**
Visit [https://nodejs.org/](https://nodejs.org/) and download the LTS version.

### Installation

1. Clone the repository (or you're already here!)

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
calaii-demo/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page (orchestrates everything)
│   └── globals.css          # Global styles
├── components/               # React components
│   ├── Header.tsx           # App header with branding
│   ├── FiltersBar.tsx       # Filter controls
│   ├── EventCard.tsx        # Event card (collapsed/expanded)
│   ├── EventExpandedDetails.tsx  # Full event details
│   ├── ConfidenceBadge.tsx  # Confidence score badge
│   ├── CategoryBadge.tsx    # Event category badge
│   ├── FreshnessBadge.tsx   # Staleness warning badge
│   └── SourceList.tsx       # List of contributing sources
├── lib/                      # Core logic
│   ├── types.ts             # TypeScript type definitions
│   ├── constants.ts         # App constants and thresholds
│   ├── data/
│   │   └── raw-events.json  # Sample event data (8 items → 5 unique)
│   └── utils/
│       ├── normalization.ts # Text normalization & similarity
│       ├── confidence.ts    # Confidence scoring logic
│       ├── deduplication.ts # Main deduplication algorithm
│       └── filters.ts       # Filtering and sorting
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Data Model

### RawEventItem (Before Deduplication)
```typescript
{
  id: string;
  title: string;
  danceTypes: ('Salsa' | 'Bachata' | 'Kizomba')[];
  category: 'Social' | 'Class' | 'Congress';
  city: 'Stockholm' | 'Gothenburg' | 'Malmö';
  venueName?: string;
  address?: string;
  startDateTime: string;  // ISO 8601
  endDateTime?: string;
  source: 'facebook' | 'instagram' | 'whatsapp' | 'website';
  sourceUrl?: string;
  lastSeenAt: string;     // ISO 8601
  price?: string;
  organizer?: string;
  description?: string;
}
```

### DeduplicatedEvent (After Processing)
Extends RawEventItem with:
```typescript
{
  confidenceScore: number;          // 0-100
  confidenceBreakdown: {...};       // Detailed scoring
  isStale: boolean;                 // lastSeenAt > 10 days
  sources: EventSource[];           // All contributing sources
  rawEventIds: string[];            // Merged event IDs
  dedupeGroupId: string;            // Unique group identifier
  oldestLastSeen: string;
  newestLastSeen: string;
}
```

## Sample Dataset

The demo includes 8 raw events that deduplicate to 5 unique events:

1. **Stockholm Salsa Social** (merged from Facebook + Instagram)
   - High confidence (70+)
   - Multiple sources bonus
   - Complete information

2. **Gothenburg Bachata & Kizomba Workshop** (merged from Website + WhatsApp)
   - High confidence (70+)
   - Multiple sources
   - Detailed description

3. **Malmö Salsa Congress**
   - High confidence (single source but complete)
   - Full event details

4. **Stockholm Kizomba Night**
   - **Low confidence (<50)**
   - Stale data (>10 days old)
   - Minimal information, no venue
   - Hidden by default (toggle to show)

5. **Gothenburg Bachata Social**
   - High confidence
   - Complete information

6. **Malmö Beginners Class**
   - High confidence
   - Course details

## Algorithm Details

### Deduplication Process

1. **Normalization**: Strip emojis, punctuation, common words from titles
2. **Matching Criteria**: Events are duplicates if:
   - Same city
   - Start times within 2 hours
   - Title similarity > 0.6 (Jaccard) OR Venue similarity > 0.8 (Levenshtein)
3. **Merging**: Choose most complete event as canonical, merge all fields
4. **Provenance**: Track all contributing sources and IDs

### Confidence Calculation

```
Base Score = 0
+ Has venue name: +25
+ Has date/time: +15
+ Has source URL: +10
+ Multiple sources: +20
- Stale (>10 days): -20
- Poor description: -15
Final Score = clamp(0, 100)
```

## Testing the Demo

### Verification Checklist

**Deduplication:**
- [ ] Raw events JSON has 8 items
- [ ] App displays exactly 5 unique events
- [ ] Click merged events to see multiple sources listed

**Confidence:**
- [ ] High-quality events show 70+ score (green badge)
- [ ] Low-quality event (Stockholm Kizomba Night) shows <50 score (red badge)
- [ ] Toggle "Show low-confidence" to reveal/hide low-quality events

**Filters:**
- [ ] Filter by Stockholm → shows only Stockholm events
- [ ] Filter by Salsa → shows only Salsa events
- [ ] Combine filters (e.g., Gothenburg + Bachata) → shows intersection
- [ ] "All" resets each filter

**UI:**
- [ ] Click event to expand details
- [ ] Click another event → previous collapses
- [ ] All badges render correctly (confidence, category, freshness)
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1280px+)

## Known Limitations

This is a demo prototype with intentional simplifications:

1. **No real scraping**: Uses static JSON instead of live data sources
2. **Simple deduplication**: Heuristic-based, not ML-powered
3. **No user accounts**: No saved preferences or personalization
4. **No calendar sync**: Can't export to Google Calendar, etc.
5. **No notifications**: No alerts for new events or changes
6. **Limited cities**: Only Stockholm, Gothenburg, Malmö

## Future Enhancements

For a production system, consider:

- **Real-time scraping** from Facebook Events API, Instagram API, web crawlers
- **Machine learning** for deduplication (embeddings, classification)
- **User accounts** with favorites, RSVP tracking, preferences
- **Calendar integration** (iCal, Google Calendar)
- **Push notifications** for new events or updates
- **Event submission** by organizers
- **Reviews and ratings** from attendees
- **More cities** across Sweden and beyond
- **Additional dance styles** (Zouk, Mambo, etc.)

## Contributing

This is a demo project for stakeholder presentation. For questions or feedback, please contact the development team.

## License

Proprietary - All rights reserved
