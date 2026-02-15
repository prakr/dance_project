import { EventSource } from '@/lib/types';
import { SOURCE_INFO } from '@/lib/constants';
import { Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';

interface SourceListProps {
  sources: EventSource[];
  sourceUrl?: string;
}

export default function SourceList({ sources, sourceUrl }: SourceListProps) {
  const getIcon = (source: EventSource) => {
    const iconProps = { className: 'w-4 h-4' };
    switch (source) {
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'whatsapp':
        return <MessageCircle {...iconProps} />;
      case 'website':
        return <Globe {...iconProps} />;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">Sources ({sources.length})</h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source) => {
          const info = SOURCE_INFO[source];
          return (
            <div
              key={source}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-white ${info.color}`}
            >
              {getIcon(source)}
              <span className="text-sm font-medium">{info.name}</span>
            </div>
          );
        })}
      </div>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 underline"
        >
          View original source
        </a>
      )}
    </div>
  );
}
