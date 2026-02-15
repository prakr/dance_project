import { EventCategory } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';

interface CategoryBadgeProps {
  category: EventCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = CATEGORY_COLORS[category];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
}
