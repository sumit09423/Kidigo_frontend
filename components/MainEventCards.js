'use client'

import Image from 'next/image'
import { ChevronRight, Bookmark, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import EventCardSkeleton from './EventCardSkeleton'
import { useAuth } from '@/contexts/AuthContext'
import { toggleBookmark, isEventBookmarked } from '@/lib/bookmarks'
import { withToast } from '@/API/http/withToast'

export default function MainEventCards({ 
  events = [], 
  title = 'Outdoors & Adventure',
  onSeeAll,
  seeAllUrl,
  variant = 'default', // 'default' or 'category'
  loading = false // Show skeleton when loading
}) {
  const router = useRouter()
  const { user, isAuthenticated, refreshUser } = useAuth()
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set())
  const [processingBookmarks, setProcessingBookmarks] = useState(new Set())

  // Initialize bookmarked events from user data
  useEffect(() => {
    if (user?.savedEvents && Array.isArray(user.savedEvents)) {
      const bookmarkedIds = new Set(user.savedEvents.map(event => event.id))
      setBookmarkedEvents(bookmarkedIds)
    }
  }, [user])

  const handleToggleBookmark = async (eventId, e) => {
    e.stopPropagation()
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Optionally show login modal or redirect
      alert('Please login to bookmark events')
      return
    }

    // Prevent multiple clicks while processing
    if (processingBookmarks.has(eventId)) {
      return
    }

    const isCurrentlyBookmarked = bookmarkedEvents.has(eventId)

    // Optimistically update UI
    setBookmarkedEvents(prev => {
      const newSet = new Set(prev)
      if (isCurrentlyBookmarked) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
    setProcessingBookmarks(prev => new Set(prev).add(eventId))

    try {
      await withToast(
        toggleBookmark(eventId, isCurrentlyBookmarked),
        {
          loading: isCurrentlyBookmarked ? 'Removing bookmark...' : 'Adding bookmark...',
          success: isCurrentlyBookmarked ? 'Bookmark removed' : 'Event bookmarked',
          error: 'Failed to update bookmark'
        }
      )
      
      // Refresh user data to get updated bookmarks
      if (refreshUser) {
        await refreshUser()
      }
    } catch (error) {
      // Revert optimistic update on error
      setBookmarkedEvents(prev => {
        const newSet = new Set(prev)
        if (isCurrentlyBookmarked) {
          newSet.add(eventId)
        } else {
          newSet.delete(eventId)
        }
        return newSet
      })
    } finally {
      setProcessingBookmarks(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()
    return { day, month }
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
        return `${location.venue} • ${location.city}, ${location.country || ''}`
      }
      return location.venue || ''
    }
    return ''
  }

  const eventsToShow = events

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll()
    } else if (seeAllUrl) {
      router.push(seeAllUrl)
    } else {
      router.push('/events')
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
      {loading && eventsToShow.length === 0 ? (
        <EventCardSkeleton count={3} />
      ) : eventsToShow.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new events</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 transition-opacity duration-200 ${loading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        {eventsToShow.map((event) => (
        <div
          key={event.id}
          onClick={() => router.push(`/events/${event.id}`)}
          className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group w-full"
        >
          {/* Event Image */}
          <div className={`relative h-48 sm:h-44 md:h-48 p-2 sm:p-2.5 md:p-3`}>
            <div className={`relative w-full h-full overflow-hidden rounded-md sm:rounded-lg bg-gray-200`}>
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
                <div className="text-[10px] sm:text-xs font-bold text-[#F0635A] leading-none">
                  {formatDate(event.date).day}
                </div>
                <div className="text-[9px] sm:text-xs font-bold text-[#F0635A] uppercase mt-0.5 sm:mt-1">
                  {formatDate(event.date).month}
                </div>
              </div>

              {/* Bookmark Button - Right Side */}
              <button
                onClick={(e) => handleToggleBookmark(event.id, e)}
                disabled={processingBookmarks.has(event.id)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white p-1.5 sm:p-2 rounded z-10 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Bookmark event"
              >
                <Bookmark 
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                    bookmarkedEvents.has(event.id)
                      ? 'fill-[#F0635A] text-[#F0635A]'
                      : 'text-[#F0635A]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Event Details */}
          <div className={`${variant === 'category' ? 'px-3 sm:px-4 pb-3 sm:pb-4' : 'px-3 sm:px-4 pb-3 sm:pb-4'}`}>
            <h3 className={`${variant === 'category' ? 'text-sm sm:text-[14px] font-medium mb-1 line-clamp-2' : 'text-sm sm:text-[14px] font-medium mb-1 line-clamp-2'} text-gray-900`}>
              {event.title}
            </h3>
            {variant === 'category' ? (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-[13px] font-normal text-gray-600 line-clamp-1">
                  {formatLocation(event.location)}
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-[13px] font-normal text-gray-600 line-clamp-1">
                {formatLocation(event.location)}
              </p>
            )}
          </div>
        </div>
      ))}
        </div>
      )}
    </div>
  )
}