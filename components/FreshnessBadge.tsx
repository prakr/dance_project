import { AlertTriangle } from 'lucide-react';

interface FreshnessBadgeProps {
  isStale: boolean;
}

export default function FreshnessBadge({ isStale }: FreshnessBadgeProps) {
  if (!isStale) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
      <AlertTriangle className="w-3 h-3" />
      May be outdated
    </span>
  );
}
