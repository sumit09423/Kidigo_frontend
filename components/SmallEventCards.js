'use client'

import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'

export default function SmallEventCards({ events = [] }) {
  // Default small events for sidebar
  const defaultEvents = [
    {
      id: 1,
      title: 'Jazz Night',
      date: '2024-07-18',
      location: 'Blue Note',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=100&fit=crop',
      price: '$25'
    },
    {
      id: 2,
      title: 'Yoga Workshop',
      date: '2024-07-20',
      location: 'Wellness Center',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=100&fit=crop',
      price: '$15'
    },
    {
      id: 3,
      title: 'Rock Concert',
      date: '2024-07-22',
      location: 'Arena',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=100&fit=crop',
      price: '$60'
    },
    {
      id: 4,
      title: 'Wine Tasting',
      date: '2024-07-25',
      location: 'Vineyard',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150&h=100&fit=crop',
      price: '$35'
    },
    {
      id: 5,
      title: 'Book Reading',
      date: '2024-07-28',
      location: 'Library',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=100&fit=crop',
      price: 'Free'
    },
    {
      id: 6,
      title: 'Basketball Game',
      date: '2024-08-01',
      location: 'Sports Arena',
      image: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=150&h=100&fit=crop',
      price: '$40'
    },
    {
      id: 7,
      title: 'Photography Class',
      date: '2024-08-05',
      location: 'Art Studio',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=150&h=100&fit=crop',
      price: '$50'
    },
    {
      id: 8,
      title: 'Stand-up Comedy',
      date: '2024-08-10',
      location: 'Comedy Club',
      image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=150&h=100&fit=crop',
      price: '$20'
    }
  ]

  const eventsToShow = events.length > 0 ? events : defaultEvents

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>

      <div className="space-y-3">
        {eventsToShow.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer group"
          >
            <div className="flex gap-3 p-3">
              {/* Event Image */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {event.title}
                </h4>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                    {event.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="pt-4">
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
          View All Events
        </button>
      </div>
    </div>
  )
}