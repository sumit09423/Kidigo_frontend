import { getAllEvents as getAllEventsAPI, getEventById as getEventByIdAPI } from '@/API/events/events.client'

/**
 * Transform API event format to component format
 * @param {object} apiEvent - Event from API
 * @returns {object} Transformed event object
 */
export function transformEvent(apiEvent) {
  if (!apiEvent) return null

  const eventDate = new Date(apiEvent.eventDate)
  const dateStr = eventDate.toISOString().split('T')[0]
  const timeStr = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' })

  return {
    id: apiEvent.id,
    title: apiEvent.eventTitle,
    organizer: {
      id: apiEvent.organizer?.id || 'unknown',
      name: apiEvent.organizer?.name || 'Unknown Organizer',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiEvent.organizer?.name || 'Organizer')}&background=6366f1&color=fff&size=256`,
      bio: 'Event Organizer',
      followers: 0,
      events: 0,
      rating: 4.5
    },
    date: dateStr,
    time: timeStr,
    dayOfWeek: dayOfWeek,
    location: {
      venue: apiEvent.locationLink ? 'See location link' : 'Location TBD',
      address: apiEvent.city?.name || 'Address TBD',
      city: apiEvent.city?.name || '',
      country: '',
      latitude: null,
      longitude: null
    },
    image: apiEvent.imageLink || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop&auto=format',
    price: apiEvent.price || 0,
    currency: apiEvent.price > 0 ? '' : 'Free',
    category: apiEvent.category?.name || '',
    subCategory: apiEvent.category?.name || '',
    capacity: apiEvent.capacity || 0,
    ticketsSold: apiEvent.sold || 0,
    ticketsAvailable: apiEvent.availableTickets || apiEvent.ticketLimit || 0,
    description: apiEvent.description || '',
    tags: apiEvent.tags || [],
    status: apiEvent.isPublished ? 'upcoming' : 'draft',
    featured: false,
    createdAt: apiEvent.createdAt,
    updatedAt: apiEvent.updatedAt
  }
}

/**
 * Build filters object with city support and additional filters
 * @param {object} location - Location object from LocationContext { city, coordinates }
 * @param {object} additionalFilters - Additional filters to include
 * @param {string} additionalFilters.search - Search query for event title, description, tags
 * @param {string} additionalFilters.dateFilter - Date filter: 'Today', 'Tomorrow', 'ThisWeekend', or 'YYYY-MM-DD'
 * @param {number} additionalFilters.minAge - Minimum age filter (0-18)
 * @param {number} additionalFilters.maxAge - Maximum age filter (0-18)
 * @param {string} additionalFilters.categoryId - Category ID filter
 * @returns {object} Filters object for API
 * 
 * Note: API requires cityId (MongoDB ObjectId), but LocationContext currently stores city name.
 * City filtering will work automatically once LocationContext is updated to include cityId.
 * For now, if location.city.id exists, it will be used; otherwise, no city filter is applied.
 */
export function buildEventFilters(location = null, additionalFilters = {}) {
  const filters = { ...additionalFilters }
  
  // Add cityId filter if available
  // LocationContext structure: { city: string, coordinates: { lat, lng } }
  // When cityId becomes available, it should be: { city: string, cityId: string, coordinates: { lat, lng } }
  if (location?.cityId) {
    filters.cityId = location.cityId
  }
  
  // Map date filter values to API format
  if (filters.dateFilter) {
    // Convert 'tomorrow' to API format (calculate tomorrow's date)
    if (filters.dateFilter === 'tomorrow') {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      filters.dateFilter = tomorrow.toISOString().split('T')[0] // YYYY-MM-DD format
    } else if (filters.dateFilter === 'today') {
      filters.dateFilter = 'Today'
    } else if (filters.dateFilter === 'this-weekend') {
      filters.dateFilter = 'ThisWeekend'
    }
    // If it's already in YYYY-MM-DD format, keep it as is
  }
  
  return filters
}

/**
 * Get all events from API
 * @param {object} filters - Optional filters (cityId, categoryId, etc.)
 * @returns {Promise<Array>} Array of all events
 */
export async function getAllEvents(filters = {}) {
  try {
    console.log('Fetching events from API with filters:', filters)
    console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000')
    
    const response = await getAllEventsAPI(filters)
    console.log('API Response:', response)
    
    if (response.status === 'success' && response.data?.events) {
      const transformedEvents = response.data.events.map(transformEvent).filter(Boolean)
      console.log(`✅ Successfully fetched ${transformedEvents.length} events from API`)
      return transformedEvents
    }
    
    // If response structure is unexpected, log it and return empty array
    console.warn('⚠️ Unexpected API response structure:', response)
    return []
  } catch (error) {
    console.error('❌ Error fetching events from API:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    })
    
    // Check if it's an authentication error
    if (error.status === 401 || error.status === 403) {
      console.error('🔒 Authentication error - API requires login')
    }
    
    // Re-throw so calling code can handle it
    throw error
  }
}

/**
 * Get event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object|null>} Event object or null if not found
 */
export async function getEventById(id) {
  try {
    console.log('Fetching event by ID from API:', id)
    const response = await getEventByIdAPI(id)
    console.log('API Response:', response)
    
    if (response.status === 'success' && response.data?.event) {
      const transformedEvent = transformEvent(response.data.event)
      console.log('Successfully fetched event from API')
      return transformedEvent
    }
    
    console.warn('Event not found in API response')
    return null
  } catch (error) {
    console.error('Error fetching event from API:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      data: error.data
    })
    throw error // Re-throw so calling code can handle it
  }
}

/**
 * Get events by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of events in the category
 */
export async function getEventsByCategory(category) {
  try {
    console.log('Fetching events by category:', category)
    // First try to get all events and filter by category name
    const allEvents = await getAllEvents()
    const filtered = allEvents.filter(event => 
      event.category?.toLowerCase() === category?.toLowerCase() ||
      event.subCategory?.toLowerCase() === category?.toLowerCase()
    )
    console.log(`Found ${filtered.length} events in category: ${category}`)
    return filtered
  } catch (error) {
    console.error('Error fetching events by category:', error)
    throw error // Re-throw so calling code can handle it
  }
}

/**
 * Get featured events
 * @returns {Promise<Array>} Array of featured events
 */
export async function getFeaturedEvents() {
  try {
    console.log('Fetching featured events from API')
    const allEvents = await getAllEvents()
    // For now, return first few events as featured
    // In the future, API might have a featured flag
    const featured = allEvents.slice(0, 6)
    console.log(`Found ${featured.length} featured events`)
    return featured
  } catch (error) {
    console.error('Error fetching featured events:', error)
    throw error // Re-throw so calling code can handle it
  }
}

/**
 * Get upcoming events
 * @returns {Promise<Array>} Array of upcoming events
 */
export async function getUpcomingEvents() {
  try {
    console.log('Fetching upcoming events from API')
    const allEvents = await getAllEvents()
    const now = new Date()
    const upcoming = allEvents
      .filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= now && event.status === 'upcoming'
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    console.log(`Found ${upcoming.length} upcoming events`)
    return upcoming
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    throw error // Re-throw so calling code can handle it
  }
}

/**
 * Search events by title or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching events
 */
export async function searchEvents(query) {
  if (!query) return []
  
  try {
    console.log('Searching events with query:', query)
    const response = await getAllEventsAPI({ search: query })
    
    if (response.status === 'success' && response.data?.events) {
      const results = response.data.events.map(transformEvent).filter(Boolean)
      console.log(`Found ${results.length} events matching query`)
      return results
    }
    
    // Fallback to client-side search if API search doesn't work
    console.log('API search returned unexpected format, using client-side search')
    const allEvents = await getAllEvents()
    const lowerQuery = query.toLowerCase()
    return allEvents.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description?.toLowerCase().includes(lowerQuery) ||
      event.location?.venue?.toLowerCase().includes(lowerQuery) ||
      event.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  } catch (error) {
    console.error('Error searching events:', error)
    throw error // Re-throw so calling code can handle it
  }
}

/**
 * Get organizer by ID
 * @param {string} organizerId - Organizer ID
 * @returns {Promise<Object|null>} Organizer object or null if not found
 */
export async function getOrganizerById(organizerId) {
  try {
    console.log('Fetching organizer by ID:', organizerId)
    // Get events by organizer to find organizer info
    const events = await getEventsByOrganizer(organizerId)
    
    if (events && events.length > 0 && events[0].organizer) {
      return events[0].organizer
    }
    
    return null
  } catch (error) {
    console.error('Error fetching organizer:', error)
    return null
  }
}

/**
 * Get events by organizer ID
 * @param {string} organizerId - Organizer ID
 * @returns {Promise<Array>} Array of events by the organizer
 */
export async function getEventsByOrganizer(organizerId) {
  try {
    console.log('Fetching events by organizer:', organizerId)
    const { getEventsByOrganizer: getEventsByOrganizerAPI } = await import('@/API/events/events.client')
    const response = await getEventsByOrganizerAPI(organizerId)
    
    if (response.status === 'success' && response.data?.events) {
      const events = response.data.events.map(transformEvent).filter(Boolean)
      console.log(`Found ${events.length} events for organizer`)
      return events
    }
    
    console.warn('No events found for organizer in API response')
    return []
  } catch (error) {
    console.error('Error fetching events by organizer:', error)
    throw error // Re-throw so calling code can handle it
  }
}

/**
 * Get reviews by organizer ID
 * @param {string} organizerId - Organizer ID
 * @returns {Array} Array of reviews for the organizer
 */
export function getReviewsByOrganizer(organizerId) {
  // Sample reviews data - in production, this would come from a database
  const reviewsData = {
    'org_001': [
      {
        id: 1,
        userName: 'Priya Sharma',
        userAvatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6366f1&color=fff&size=128',
        rating: 5,
        date: '2024-01-15',
        comment: 'Amazing experience! The music concert was absolutely fantastic. Great organization and wonderful atmosphere. Highly recommend attending their events!'
      },
      {
        id: 2,
        userName: 'Rahul Mehta',
        userAvatar: 'https://ui-avatars.com/api/?name=Rahul+Mehta&background=10b981&color=fff&size=128',
        rating: 4,
        date: '2024-01-10',
        comment: 'Very professional organizer. The event was well-planned and executed smoothly. The venue was perfect and the sound quality was excellent.'
      },
      {
        id: 3,
        userName: 'Anjali Patel',
        userAvatar: 'https://ui-avatars.com/api/?name=Anjali+Patel&background=ec4899&color=fff&size=128',
        rating: 5,
        date: '2024-01-05',
        comment: 'One of the best events I\'ve attended! The organizers really know how to create a memorable experience. Will definitely follow for future events.'
      }
    ],
    'org_002': [
      {
        id: 1,
        userName: 'David Chen',
        userAvatar: 'https://ui-avatars.com/api/?name=David+Chen&background=6366f1&color=fff&size=128',
        rating: 5,
        date: '2024-01-18',
        comment: 'Incredible art exhibition! The curation was thoughtful and the artwork selection was diverse. A truly inspiring experience for art lovers.'
      },
      {
        id: 2,
        userName: 'Sarah Johnson',
        userAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=f59e0b&color=fff&size=128',
        rating: 4,
        date: '2024-01-12',
        comment: 'Beautiful gallery space and well-organized event. The staff was knowledgeable and helpful. Great way to spend an afternoon exploring art.'
      },
      {
        id: 3,
        userName: 'Michael Brown',
        userAvatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=10b981&color=fff&size=128',
        rating: 5,
        date: '2024-01-08',
        comment: 'Outstanding exhibition! The organizers have a great eye for quality artwork. The event was well-attended and the atmosphere was perfect.'
      }
    ],
    'org_003': [
      {
        id: 1,
        userName: 'Emma Wilson',
        userAvatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=ec4899&color=fff&size=128',
        rating: 5,
        date: '2024-01-20',
        comment: 'Best music festival experience! The lineup was incredible and the organization was top-notch. Already looking forward to next year!'
      },
      {
        id: 2,
        userName: 'James Taylor',
        userAvatar: 'https://ui-avatars.com/api/?name=James+Taylor&background=6366f1&color=fff&size=128',
        rating: 4,
        date: '2024-01-14',
        comment: 'Great festival with amazing artists. The sound system was excellent and the crowd was fantastic. Well worth the ticket price!'
      },
      {
        id: 3,
        userName: 'Lisa Anderson',
        userAvatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=f59e0b&color=fff&size=128',
        rating: 5,
        date: '2024-01-09',
        comment: 'Absolutely loved it! The organizers really know how to put on a show. Everything from the music to the food vendors was perfect.'
      }
    ]
  }

  // Default reviews for any organizer not in the list
  const defaultReviews = [
    {
      id: 1,
      userName: 'Alex Kumar',
      userAvatar: 'https://ui-avatars.com/api/?name=Alex+Kumar&background=6366f1&color=fff&size=128',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent organizer! The event was well-planned and executed perfectly. Great attention to detail and wonderful experience overall.'
    },
    {
      id: 2,
      userName: 'Sneha Reddy',
      userAvatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=10b981&color=fff&size=128',
      rating: 4,
      date: '2024-01-10',
      comment: 'Very professional and organized. The event ran smoothly and all attendees seemed to enjoy themselves. Would recommend!'
    },
    {
      id: 3,
      userName: 'Vikram Singh',
      userAvatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=ec4899&color=fff&size=128',
      rating: 5,
      date: '2024-01-05',
      comment: 'Outstanding event management! Everything was perfect from start to finish. Looking forward to more events from this organizer.'
    }
  ]

  return reviewsData[organizerId] || defaultReviews
}
