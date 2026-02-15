import { Music } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Music className="w-10 h-10" />
          <h1 className="text-4xl font-bold">Calaii</h1>
        </div>
        <p className="text-xl text-white/90 mb-2">
          Your Latin Dance Events Aggregator for Sweden
        </p>
        <p className="text-sm text-white/75 max-w-3xl">
          <strong>Demo Prototype:</strong> This is a proof-of-concept showcasing event aggregation,
          deduplication, and data quality scoring. Events are simulated to demonstrate the platform&apos;s
          capabilities. In production, data would be continuously scraped from Facebook, Instagram,
          WhatsApp groups, and event websites.
        </p>
      </div>
    </header>
  );
}
