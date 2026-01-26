'use client'

import { useState, useMemo } from 'react'
import HorizontalScrollButtons from '@/components/HorizontalScrollButtons'
import FilterButtons from '@/components/FilterButtons'
import MainEventCards from '@/components/MainEventCards'
import { Activity, Music, Wrench, Palette } from 'lucide-react'
import { getAllEvents, getEventsByCategory } from '@/lib/events'

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('sports')

  // Category buttons with icons
  const categoryButtons = [
    { 
      id: 'sports', 
      label: 'Sports', 
      color: '#F0635A',
      icon: Activity
    },
    { 
      id: 'music', 
      label: 'Music', 
      color: '#F59762',
      icon: Music
    },
    { 
      id: 'arts', 
      label: 'Arts', 
      color: '#29D697',
      icon: Wrench
    },
    { 
      id: 'art', 
      label: 'Art', 
      color: '#4285F4',
      icon: Palette
    },
  ]

  // Get events based on selected category
  const events = useMemo(() => {
    const allEvents = getAllEvents()
    
    // Map category IDs to actual event categories
    const categoryMap = {
      'sports': ['sports', 'Sports'],
      'music': ['music', 'Music', 'concerts', 'Concert'],
      'arts': ['arts', 'Arts', 'art', 'Art'],
      'art': ['arts', 'Arts', 'art', 'Art']
    }
    
    const categories = categoryMap[selectedCategory] || []
    
    return allEvents.filter(event => 
      categories.some(cat => 
        event.category?.toLowerCase() === cat.toLowerCase() ||
        event.subCategory?.toLowerCase() === cat.toLowerCase()
      )
    )
  }, [selectedCategory])

  const handleCategoryClick = (button) => {
    setSelectedCategory(button.id)
  }

  const handleFilterClick = (filter) => {
    console.log('Selected filter:', filter.id)
  }

  // Get category name for title
  const categoryName = categoryButtons.find(cat => cat.id === selectedCategory)?.label || 'Sports'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Category Filter Section */}
      <section className="py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HorizontalScrollButtons
            buttons={categoryButtons}
            onButtonClick={handleCategoryClick}
            defaultSelected="sports"
            selected={selectedCategory}
          />
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {categoryName}
          </h1>

          {/* Filter Buttons */}
          <div className="mb-8">
            <FilterButtons
              onFilterClick={handleFilterClick}
              defaultSelected="tomorrow"
            />
          </div>

          {/* Event Cards Grid */}
          <MainEventCards
            events={events}
            variant="category"
            title=""
          />
        </div>
      </section>
    </main>
  )
}
