import { Music } from 'lucide-react';

interface HeaderProps {
  searchBar?: React.ReactNode;
}

export default function Header({ searchBar }: HeaderProps) {
  return (
    <header className="bg-gradient-to-br from-brand-dark via-brand-dark-light to-brand-dark text-white">
      {/* Top Section */}
      <div className="py-6 md:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <Music className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Calaii</h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-2">
            Your Latin Dance Events Aggregator for Sweden
          </p>
          <p className="text-xs md:text-sm text-white/75 max-w-3xl">
            <strong>Demo Prototype:</strong> This is a proof-of-concept showcasing event aggregation,
            deduplication, and data quality scoring. Events are simulated to demonstrate the platform&apos;s
            capabilities. In production, data would be continuously scraped from Facebook, Instagram,
            WhatsApp groups, and event websites.
          </p>
        </div>
      </div>

      {/* Search Bar Section */}
      {searchBar && (
        <div className="pb-6 md:pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            {searchBar}
          </div>
        </div>
      )}
    </header>
  );
}
