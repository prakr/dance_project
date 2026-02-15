'use client';

import { FilterState, City, DanceType, EventCategory } from '@/lib/types';
import { CITIES, DANCE_TYPES, EVENT_CATEGORIES } from '@/lib/constants';
import { Filter } from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FiltersBar({ filters, onFilterChange }: FiltersBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            id="city-filter"
            value={filters.city}
            onChange={(e) =>
              onFilterChange({ ...filters, city: e.target.value as City | 'all' })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Dance Type Filter */}
        <div>
          <label htmlFor="dance-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Dance Type
          </label>
          <select
            id="dance-filter"
            value={filters.danceType}
            onChange={(e) =>
              onFilterChange({ ...filters, danceType: e.target.value as DanceType | 'all' })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dances</option>
            {DANCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value as EventCategory | 'all' })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {EVENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Show Low Confidence Toggle */}
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showLowConfidence}
              onChange={(e) =>
                onFilterChange({ ...filters, showLowConfidence: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show low-confidence events</span>
          </label>
        </div>
      </div>
    </div>
  );
}
