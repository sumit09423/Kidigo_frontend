'use client'

import { useState } from 'react'
import HorizontalScrollButtons from '@/components/HorizontalScrollButtons'
import FilterButtons from '@/components/FilterButtons'
import MainEventCards from '@/components/MainEventCards'
import { Activity, Music, Wrench, Palette } from 'lucide-react'

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

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'International Band Music Festival',
      date: '2024-06-10',
      location: '36 Guild Street London, UK',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 2,
      title: 'Jo Malone London\'s Modern Art Exhibition',
      date: '2024-06-10',
      location: 'Radius Gallery • Santa Cruz, CA',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 3,
      title: 'International Band Music Festival',
      date: '2024-06-10',
      location: '36 Guild Street London, UK',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 4,
      title: 'Jo Malone London\'s Modern Art Exhibition',
      date: '2024-06-10',
      location: 'Radius Gallery • Santa Cruz, CA',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 5,
      title: 'International Band Music Festival',
      date: '2024-06-10',
      location: '36 Guild Street London, UK',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 6,
      title: 'Jo Malone London\'s Modern Art Exhibition',
      date: '2024-06-10',
      location: 'Radius Gallery • Santa Cruz, CA',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 7,
      title: 'International Band Music Festival',
      date: '2024-06-10',
      location: '36 Guild Street London, UK',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 8,
      title: 'Jo Malone London\'s Modern Art Exhibition',
      date: '2024-06-10',
      location: 'Radius Gallery • Santa Cruz, CA',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
    {
      id: 9,
      title: 'International Band Music Festival',
      date: '2024-06-10',
      location: '36 Guild Street London, UK',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format',
      category: 'sports'
    },
  ]

  const handleCategoryClick = (button) => {
    setSelectedCategory(button.id)
    console.log('Selected category:', button.id)
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
