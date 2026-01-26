'use client'

import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'

export default function SmallEventCards({ 
  upcomingEvents = [],
  savedEvents = [],
  myEvents = []
}) {
  // Default small events for sidebar
  const defaultUpcomingEvents = [
    {
      id: 1,
      title: 'Jazz Night',
      date: '2024-05-01',
      time: '2:00 PM',
      location: 'Blue Note',
      description: 'A virtual evening of smooth jazz',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=100&fit=crop',
      price: '$25'
    },
    {
      id: 2,
      title: 'Yoga Workshop',
      date: '2024-07-20',
      time: '8:00 AM',
      location: 'Wellness Center',
      description: 'Start your day with mindful movement',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=100&fit=crop',
      price: '$15'
    },
    {
      id: 3,
      title: 'Rock Concert',
      date: '2024-07-22',
      time: '7:00 PM',
      location: 'Arena',
      description: 'Experience the best rock bands live',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=100&fit=crop',
      price: '$60'
    },
    {
      id: 4,
      title: 'Wine Tasting',
      date: '2024-07-25',
      time: '6:00 PM',
      location: 'Vineyard',
      description: 'Discover fine wines from around the world',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150&h=100&fit=crop',
      price: '$35'
    },
    {
      id: 5,
      title: 'Book Reading',
      date: '2024-07-28',
      time: '3:00 PM',
      location: 'Library',
      description: 'Join us for an inspiring author reading',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=100&fit=crop',
      price: 'Free'
    },
    {
      id: 6,
      title: 'Basketball Game',
      date: '2024-08-01',
      time: '5:00 PM',
      location: 'Sports Arena',
      description: 'Watch the championship game live',
      image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=150&h=100&fit=crop',
      price: '$40'
    }
  ]

  const defaultSavedEvents = [
    {
      id: 7,
      title: 'Photography Class',
      date: '2024-08-05',
      time: '10:00 AM',
      location: 'Art Studio',
      description: 'Learn professional photography techniques',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=150&h=100&fit=crop',
      price: '$50'
    },
    {
      id: 8,
      title: 'Stand-up Comedy',
      date: '2024-08-10',
      time: '8:00 PM',
      location: 'Comedy Club',
      description: 'Laugh out loud with top comedians',
      image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=150&h=100&fit=crop',
      price: '$20'
    },
    {
      id: 9,
      title: 'Art Exhibition',
      date: '2024-08-15',
      time: '11:00 AM',
      location: 'Gallery',
      description: 'Explore contemporary art collections',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=100&fit=crop',
      price: '$30'
    }
  ]

  const defaultMyEvents = [
    {
      id: 10,
      title: 'Marathon Run',
      date: '2024-07-20',
      time: '6:00 AM',
      location: 'Riverside Park',
      description: 'Join thousands of runners for charity',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=100&fit=crop',
      price: '$35'
    },
    {
      id: 11,
      title: 'Music Festival',
      date: '2024-08-12',
      time: '12:00 PM',
      location: 'Concert Hall',
      description: 'Three days of amazing music and fun',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=150&h=100&fit=crop',
      price: '$75'
    }
  ]

  const upcoming = upcomingEvents.length > 0 ? upcomingEvents : defaultUpcomingEvents
  const saved = savedEvents.length > 0 ? savedEvents : defaultSavedEvents
  const my = myEvents.length > 0 ? myEvents : defaultMyEvents

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

  const EventCard = ({ event }) => {
    const dateTime = formatEventDate(event.date, event.time)
    
    return (
      <div
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