'use client'

import { useState } from 'react'
import { Calendar, ChevronRight } from 'lucide-react'

export default function FilterButtons({ 
  filters = [],
  onFilterClick,
  defaultSelected = null,
  className = ''
}) {
  const [selectedFilter, setSelectedFilter] = useState(defaultSelected)

  const handleClick = (filter) => {
    setSelectedFilter(filter.id || filter.label)
    if (onFilterClick) {
      onFilterClick(filter)
    }
  }

  // Default filters if none provided
  const defaultFilters = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this-weekend', label: 'This Weekend' },
    { id: 'calendar', label: 'Choose from calendar', icon: Calendar, hasArrow: true },
    { id: 'age', label: '0 - 3 years', hasRadio: true, hasArrow: true },
    { id: 'distance', label: 'Under 10km' },
  ]

  const filtersToRender = filters.length > 0 ? filters : defaultFilters

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filtersToRender.map((filter) => {
        const isSelected = selectedFilter === (filter.id || filter.label)
        const Icon = filter.icon
        
        return (
          <button
            key={filter.id || filter.label}
            onClick={() => handleClick(filter)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-lg
              font-medium text-sm transition-all duration-200
              whitespace-nowrap
              ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }
            `}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {filter.hasRadio && (
              <div className={`w-4 h-4 rounded-full border-2 ${
                isSelected ? 'border-white bg-white' : 'border-gray-400'
              }`} />
            )}
            <span>{filter.label}</span>
            {filter.hasArrow && (
              <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}
