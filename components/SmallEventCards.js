'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getUpcomingEvents, getAllEvents, buildEventFilters } from '@/lib/events'
import { useLocation } from '@/contexts/LocationContext'
import { useAuth } from '@/contexts/AuthContext'
import { getBookmarks } from '@/lib/bookmarks'
import SmallEventCardSkeleton from './SmallEventCardSkeleton'

export default function SmallEventCards({ 
  upcomingEvents = [],
  savedEvents = [],
  myEvents = []
}) {
  const router = useRouter()
  const { location } = useLocation()
  const { isAuthenticated } = useAuth()
  const [defaultUpcoming, setDefaultUpcoming] = useState([])
  const [defaultSaved, setDefaultSaved] = useState([])
  const [defaultMy, setDefaultMy] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true)
        
        // Build filters - include cityId if available
        const filters = buildEventFilters(location)
        
        const [upcoming, all, bookmarks] = await Promise.all([
          getUpcomingEvents(),
          getAllEvents(filters),
          // Try to load bookmarks if user is authenticated, otherwise return empty array
          isAuthenticated() ? getBookmarks().catch(() => []) : Promise.resolve([])
        ])
        
        console.log('Loaded sidebar events:', { 
          upcoming: upcoming?.length, 
          all: all?.length,
          bookmarks: bookmarks?.length 
        })
        
        // Get upcoming events, or fallback to recent events if none are upcoming
        const upcomingList = upcoming.length > 0 
          ? upcoming.slice(0, 6)
          : (all || []).slice(0, 6) // Fallback to first 6 events if no upcoming events
        
        setDefaultUpcoming(upcomingList)
        
        // For saved events, use actual bookmarks if available, otherwise fallback to featured events
        const saved = bookmarks && bookmarks.length > 0
          ? bookmarks.slice(0, 3)
          : (all || [])
              .filter(event => event.featured)
              .slice(0, 3)
        
        setDefaultSaved(saved)
        
        // For my events, use another set (e.g., events user might be interested in)
        const my = (all || [])
          .filter(event => event.status === 'upcoming')
          .slice(3, 5)
        
        setDefaultMy(my)
      } catch (error) {
        console.error('Error loading events:', error)
        // Don't show alert here as it's a sidebar component
        setDefaultUpcoming([])
        setDefaultSaved([])
        setDefaultMy([])
      } finally {
        setLoading(false)
      }
    }
    
    loadEvents()
  }, [location, isAuthenticated])
  
  // Use provided events or default from API
  const upcoming = upcomingEvents.length > 0 ? upcomingEvents : defaultUpcoming
  const saved = savedEvents.length > 0 ? savedEvents : defaultSaved
  const my = myEvents.length > 0 ? myEvents : defaultMy

  // Helper function to format date: "1st May - Sat - 2:00 PM"
  const formatEventDate = (dateString, time) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const daySuffix = ['th', 'st', 'nd', 'rd'][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ]
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' })
    const formattedTime = time || '2:00 PM'
    
    return `${day}${daySuffix} ${month} - ${dayOfWeek} - ${formattedTime}`
  }

  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location
    }
    if (location && typeof location === 'object') {
      if (location.address) {
        return location.address
      }
      if (location.venue && location.city) {
        return `${location.venue} • ${location.city}`
      }
      return location.venue || ''
    }
    return ''
  }

  const EventCard = ({ event }) => {
    const dateTime = formatEventDate(event.date, event.time)
    const locationText = formatLocation(event.location)
    
    return (
      <div
        onClick={() => router.push(`/events/${event.id}`)}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group"
      >
      <div className="flex gap-2 md:gap-3 p-2 md:p-3">
        {/* Event Image */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
              {event.title}
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-start gap-1">
                <Calendar className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{dateTime}</span>
              </div>

              {event.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const EventSection = ({ title, events, loading: sectionLoading, skeletonCount = 3 }) => (
    <div className="space-y-3">
      <h3 className="text-base md:text-lg font-bold text-gray-900">{title}</h3>
      {sectionLoading ? (
        <SmallEventCardSkeleton count={skeletonCount} />
      ) : events.length > 0 ? (
        <div className="space-y-2 md:space-y-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          No events found
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Upcoming Events Section */}
      <EventSection title="Upcoming Events" events={upcoming} loading={loading} skeletonCount={6} />

      {/* Saved Events Section */}
      <EventSection title="Saved Events" events={saved} loading={loading} skeletonCount={3} />

      {/* My Events Section */}
      <EventSection title="My Events" events={my} loading={loading} skeletonCount={2} />
    </div>
  )
}