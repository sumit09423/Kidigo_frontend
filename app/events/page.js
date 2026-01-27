'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CategoryFilter from '@/components/CategoryFilter'
import FilterButtons from '@/components/FilterButtons'
import MainEventCards from '@/components/MainEventCards'
import { getAllEvents, getEventsByCategory, buildEventFilters } from '@/lib/events'
import { getAllCategories } from '@/lib/categories'
import { useLocation } from '@/contexts/LocationContext'

function EventsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryFromUrl = searchParams.get('category')
  const searchFromUrl = searchParams.get('search')
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all')
  const [events, setEvents] = useState([])
  const [categoryButtons, setCategoryButtons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDateFilter, setSelectedDateFilter] = useState(null)
  const [selectedAgeFilter, setSelectedAgeFilter] = useState(null)
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

  // Load events based on selected category, search, and filters
  useEffect(() => {
    if (!selectedCategory) return
    
    async function loadEvents() {
      try {
        // Don't clear existing events immediately - keep them visible to prevent flicker
        setLoading(true)
        
        // Build filters - include cityId, search, dateFilter, and age filters
        const filters = buildEventFilters(location, {
          search: searchFromUrl || undefined,
          dateFilter: selectedDateFilter || undefined,
          minAge: selectedAgeFilter?.minAge,
          maxAge: selectedAgeFilter?.maxAge,
        })
        
        // If specific category is selected, add categoryId to filters
        if (selectedCategory !== 'all' && categoryButtons.length > 0) {
          const selectedCategoryObj = categoryButtons.find(cat => 
            (cat.id || cat.category?.toLowerCase()) === selectedCategory.toLowerCase()
          )
          if (selectedCategoryObj?.id) {
            filters.categoryId = selectedCategoryObj.id
          }
        }
        
        // Get events from API with all filters applied
        const allEvents = await getAllEvents(filters)
        
        // If category is selected (not 'all'), also filter client-side by category name
        // This is a fallback in case categoryId filter doesn't work
        let filteredEvents = allEvents
        if (selectedCategory !== 'all' && categoryButtons.length > 0) {
          const selectedCategoryObj = categoryButtons.find(cat => 
            (cat.id || cat.category?.toLowerCase()) === selectedCategory.toLowerCase()
          )
          const categoryName = selectedCategoryObj?.category || selectedCategory
          
          filteredEvents = allEvents.filter(event => 
            event.category?.toLowerCase() === categoryName?.toLowerCase() ||
            event.subCategory?.toLowerCase() === categoryName?.toLowerCase()
          )
        }
        
        console.log(`Loaded ${filteredEvents.length} events with filters:`, {
          category: selectedCategory,
          search: searchFromUrl,
          dateFilter: selectedDateFilter,
          ageFilter: selectedAgeFilter
        })
        setEvents(filteredEvents)
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
  }, [selectedCategory, location, categoryButtons, searchFromUrl, selectedDateFilter, selectedAgeFilter])

  const handleCategoryClick = (button) => {
    const categoryId = button.id
    setSelectedCategory(categoryId)
    
    // Update URL with category parameter, preserving search query if present
    const params = new URLSearchParams()
    if (categoryId !== 'all') {
      params.set('category', categoryId)
    }
    if (searchFromUrl) {
      params.set('search', searchFromUrl)
    }
    
    const queryString = params.toString()
    router.replace(queryString ? `/events?${queryString}` : '/events', { scroll: false })
  }

  const handleFilterClick = (filter) => {
    console.log('Selected filter:', filter.id)
    
    // Handle date filters
    if (filter.id === 'today' || filter.id === 'tomorrow' || filter.id === 'this-weekend') {
      // Toggle date filter - if same filter clicked, deselect it
      if (selectedDateFilter === filter.id) {
        setSelectedDateFilter(null)
      } else {
        setSelectedDateFilter(filter.id)
      }
    }
    // Handle age filter (0-3 years)
    else if (filter.id === 'age') {
      // Toggle age filter - if same filter clicked, deselect it
      if (selectedAgeFilter?.minAge === 0 && selectedAgeFilter?.maxAge === 3) {
        setSelectedAgeFilter(null)
      } else {
        setSelectedAgeFilter({ minAge: 0, maxAge: 3 })
      }
    }
    // Handle calendar filter (future enhancement)
    else if (filter.id === 'calendar') {
      // TODO: Open calendar modal to select date
      console.log('Calendar filter clicked - to be implemented')
    }
  }

  // Get category name for title
  const categoryName = selectedCategory === 'all' 
    ? (searchFromUrl ? `Search Results for "${searchFromUrl}"` : 'All Events')
    : categoryButtons.find(cat => 
        (cat.id || cat.category?.toLowerCase()) === selectedCategory.toLowerCase()
      )?.category || 'Events'
  
  // Determine default selected filter for FilterButtons
  const defaultFilterId = selectedDateFilter || 'tomorrow'

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
              defaultSelected={defaultFilterId}
              selected={selectedDateFilter || (selectedAgeFilter ? 'age' : null)}
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

export default function EventsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <section className="py-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </section>
        <section className="py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    }>
      <EventsPageContent />
    </Suspense>
  )
}
