'use client'

import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getUpcomingEvents, getAllEvents } from '@/lib/events'

export default function SmallEventCards({ 
  upcomingEvents = [],
  savedEvents = [],
  myEvents = []
}) {
  const router = useRouter()
  
  // Get events from JSON if not provided
  const allEvents = getAllEvents()
  
  // Get upcoming events, or fallback to recent events if none are upcoming
  const upcomingFromJson = getUpcomingEvents()
  const defaultUpcoming = upcomingFromJson.length > 0 
    ? upcomingFromJson.slice(0, 6)
    : allEvents.slice(0, 6) // Fallback to first 6 events if no upcoming events
  
  // For saved events, use a different set of events (e.g., featured or different category)
  const defaultSaved = allEvents
    .filter(event => event.featured)
    .slice(0, 3)
  
  // For my events, use another set (e.g., events user might be interested in)
  const defaultMy = allEvents
    .filter(event => event.status === 'upcoming')
    .slice(3, 5)
  
  // Use provided events or default from JSON
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

  const EventSection = ({ title, events }) => (
    <div className="space-y-3">
      <h3 className="text-base md:text-lg font-bold text-gray-900">{title}</h3>
      {events.length > 0 ? (
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
      <EventSection title="Upcoming Events" events={upcoming} />

      {/* Saved Events Section */}
      <EventSection title="Saved Events" events={saved} />

      {/* My Events Section */}
      <EventSection title="My Events" events={my} />
    </div>
  )
}