'use client'

import Image from 'next/image'
import { Heart, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function MainEventCards({ 
  events = [], 
  title = 'Outdoors & Adventure',
  onSeeAll,
  seeAllUrl 
}) {
  const [wishlist, setWishlist] = useState(new Set())

  const toggleWishlist = (eventId) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(eventId)) {
        newWishlist.delete(eventId)
      } else {
        newWishlist.add(eventId)
      }
      return newWishlist
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()
    return { day, month }
  }

  // Default events if none provided
  const defaultEvents = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: '2024-07-15',
      time: '7:00 PM',
      location: 'Central Park',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format',
      price: '$45',
      category: 'concerts'
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: '2024-08-20',
      time: '9:00 AM',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop&auto=format',
      price: '$150',
      category: 'workshops'
    },
    {
      id: 3,
      title: 'Broadway Show',
      date: '2024-09-10',
      time: '8:00 PM',
      location: 'Theater District',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop&auto=format',
      price: '$120',
      category: 'theater'
    },
  ]

  const eventsToShow = events.length > 0 ? events : defaultEvents

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll()
    } else if (seeAllUrl) {
      window.location.href = seeAllUrl
    }
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-[23px] font-bold">{title}</h2>
        {(onSeeAll || seeAllUrl) && (
          <button
            onClick={handleSeeAll}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium text-xs md:text-[13px] flex-shrink-0"
          >
            <span>See All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {eventsToShow.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group w-full"
        >
          {/* Event Image */}
          <div className="relative h-48 sm:h-44 md:h-48 p-2 sm:p-2.5 md:p-3">
            <div className="relative w-full h-full overflow-hidden rounded-md sm:rounded-lg bg-gray-200">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority={event.id <= 4}
              />
              
              {/* Date - Left Side */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg text-center z-10">
                <div className="text-[10px] sm:text-xs font-bold text-gray-900 leading-none">
                  {formatDate(event.date).day}
                </div>
                <div className="text-[9px] sm:text-xs font-bold text-gray-700 uppercase mt-0.5 sm:mt-1">
                  {formatDate(event.date).month}
                </div>
              </div>

              {/* Wishlist Button - Right Side */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleWishlist(event.id)
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:bg-white transition-colors duration-200 z-10"
                aria-label="Add to wishlist"
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                    wishlist.has(event.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-700'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Event Details */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <h3 className="text-sm sm:text-[14px] font-medium text-gray-900 mb-1 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-xs sm:text-[13px] font-normal text-gray-600 line-clamp-1">
              {event.location}
            </p>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}