import eventsData from '@/data/events.json'

/**
 * Get all events
 * @returns {Array} Array of all events
 */
export function getAllEvents() {
  return eventsData
}

/**
 * Get event by ID
 * @param {string|number} id - Event ID
 * @returns {Object|null} Event object or null if not found
 */
export function getEventById(id) {
  const eventId = typeof id === 'string' ? parseInt(id, 10) : id
  return eventsData.find(event => event.id === eventId) || null
}

/**
 * Get events by category
 * @param {string} category - Category name
 * @returns {Array} Array of events in the category
 */
export function getEventsByCategory(category) {
  return eventsData.filter(event => 
    event.category?.toLowerCase() === category?.toLowerCase() ||
    event.subCategory?.toLowerCase() === category?.toLowerCase()
  )
}

/**
 * Get featured events
 * @returns {Array} Array of featured events
 */
export function getFeaturedEvents() {
  return eventsData.filter(event => event.featured === true)
}

/**
 * Get upcoming events
 * @returns {Array} Array of upcoming events
 */
export function getUpcomingEvents() {
  const now = new Date()
  return eventsData
    .filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= now && event.status === 'upcoming'
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

/**
 * Search events by title or description
 * @param {string} query - Search query
 * @returns {Array} Array of matching events
 */
export function searchEvents(query) {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return eventsData.filter(event =>
    event.title.toLowerCase().includes(lowerQuery) ||
    event.description?.toLowerCase().includes(lowerQuery) ||
    event.location?.venue?.toLowerCase().includes(lowerQuery) ||
    event.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get organizer by ID
 * @param {string} organizerId - Organizer ID
 * @returns {Object|null} Organizer object or null if not found
 */
export function getOrganizerById(organizerId) {
  const event = eventsData.find(e => e.organizer?.id === organizerId)
  return event?.organizer || null
}

/**
 * Get events by organizer ID
 * @param {string} organizerId - Organizer ID
 * @returns {Array} Array of events by the organizer
 */
export function getEventsByOrganizer(organizerId) {
  return eventsData.filter(event => event.organizer?.id === organizerId)
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
