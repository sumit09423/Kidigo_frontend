'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CategoryFilter from '@/components/CategoryFilter'
import FilterButtons from '@/components/FilterButtons'
import MainEventCards from '@/components/MainEventCards'
import { getAllEvents, getEventsByCategory, buildEventFilters } from '@/lib/events'
import { getAllCategories } from '@/lib/categories'
import { useLocation } from '@/contexts/LocationContext'

export default function EventsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryFromUrl = searchParams.get('category')
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all')
  const [events, setEvents] = useState([])
  const [categoryButtons, setCategoryButtons] = useState([])
  const [loading, setLoading] = useState(true)
  const { location } = useLocation()

  // Load categories to get button data for filtering (needed for category name lookup)
  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getAllCategories({ limit: 50 })
        // We need categoryButtons for filtering, but CategoryFilter component handles the UI
        // So we'll keep a local copy for filtering logic
        setCategoryButtons(categories)
        
        // Set category from URL if provided on initial load
        if (categoryFromUrl) {
          const categoryExists = categories.find(cat => 
            (cat.id || cat.category?.toLowerCase()) === categoryFromUrl.toLowerCase()
          )
          if (categoryExists) {
            setSelectedCategory(categoryFromUrl)
          } else {
            setSelectedCategory('all')
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategoryButtons([])
      }
    }
    
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle URL category changes separately (without reloading categories)
  useEffect(() => {
    if (categoryFromUrl) {
      const categoryExists = categoryButtons.find(cat => 
        (cat.id || cat.category?.toLowerCase()) === categoryFromUrl.toLowerCase()
      )
      if (categoryExists) {
        setSelectedCategory(categoryFromUrl)
      } else {
        setSelectedCategory('all')
      }
    } else {
      setSelectedCategory('all')
    }
  }, [categoryFromUrl, categoryButtons])

  // Load events based on selected category
  useEffect(() => {
    if (!selectedCategory) return
    
    async function loadEvents() {
      try {
        // Don't clear existing events immediately - keep them visible to prevent flicker
        setLoading(true)
        
        // Build filters - include cityId if available
        const filters = buildEventFilters(location)
        
        // If "all" is selected, get all events (don't need to wait for categories)
        if (selectedCategory === 'all') {
          const allEvents = await getAllEvents(filters)
          console.log(`Loaded ${allEvents.length} events (all categories)`)
          setEvents(allEvents)
        } else {
          // For specific categories, wait for categories to load to get the category name
          if (categoryButtons.length === 0) return
          
          // Find the selected category object to get its name
          const selectedCategoryObj = categoryButtons.find(cat => 
            (cat.id || cat.category?.toLowerCase()) === selectedCategory.toLowerCase()
          )
          const categoryName = selectedCategoryObj?.category || selectedCategory
          
          // Get all events first, then filter by category
          const allEvents = await getAllEvents(filters)
          
          // Filter events that match the category
          const filtered = allEvents.filter(event => 
            event.category?.toLowerCase() === categoryName?.toLowerCase() ||
            event.subCategory?.toLowerCase() === categoryName?.toLowerCase()
          )
          
          console.log(`Filtered to ${filtered.length} events for category: ${categoryName}`)
          setEvents(filtered)
        }
      } catch (error) {
        console.error('Error loading events:', error)
        // Show error to user instead of stub data
        alert(`Failed to load events: ${error.message || 'Unknown error'}. Please check your connection and try again.`)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    
    loadEvents()
  }, [selectedCategory, location, categoryButtons])

  const handleCategoryClick = (button) => {
    const categoryId = button.id
    setSelectedCategory(categoryId)
    
    // Update URL with category parameter (use replace to avoid flicker)
    if (categoryId === 'all') {
      router.replace('/events', { scroll: false })
    } else {
      router.replace(`/events?category=${categoryId}`, { scroll: false })
    }
  }

  const handleFilterClick = (filter) => {
    console.log('Selected filter:', filter.id)
  }

  // Get category name for title
  const categoryName = selectedCategory === 'all' 
    ? 'All Events' 
    : categoryButtons.find(cat => 
        (cat.id || cat.category?.toLowerCase()) === selectedCategory.toLowerCase()
      )?.category || 'Events'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Category Filter Section */}
      <section className="py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            onCategoryClick={handleCategoryClick}
            defaultSelected="all"
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
            loading={loading}
          />
        </div>
      </section>
    </main>
  )
}
