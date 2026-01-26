'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Bookmark, Calendar, MapPin, User, Share2, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getEventById } from '@/lib/events'

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const eventData = getEventById(params.id)
    if (eventData) {
      setEvent(eventData)
    } else {
      // Event not found, redirect or show error
      router.push('/events')
    }
    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading event details...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/events')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    return { day, month, year }
  }

  const dateInfo = formatDate(event.date)

  const handleBookmark = (e) => {
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const handleInvite = () => {
    // Handle invite/share functionality
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      }).catch(console.error)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Event link copied to clipboard!')
    }
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleBuyTicket = () => {
    // Navigate to ticket purchase page or open modal
    console.log('Buy ticket clicked')
    // router.push(`/events/${event.id}/tickets`)
  }

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${event.location.venue}, ${event.location.address}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }


  const shortDescription = event.description.substring(0, 150)
  const needsTruncation = event.description.length > 150

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-semibold">Event Details</span>
        </button>

        {/* Hero Image Section - Contained */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] mb-6 rounded-xl overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Bookmark Button - Top Right */}
          <button
            onClick={handleBookmark}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors z-10"
            aria-label="Bookmark event"
          >
            <Bookmark 
              className={`w-5 h-5 transition-colors ${
                isBookmarked ? 'fill-[#F0635A] text-[#F0635A]' : 'text-gray-700'
              }`}
            />
          </button>

          {/* Organizer Section - Bottom Left */}
          <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg border border-white/20 z-10 flex items-center gap-3">
            <button
              onClick={() => router.push(`/organizers/${event.organizer.id}`)}
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-90 transition-opacity"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-white/30">
                <Image
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white drop-shadow-md">{event.organizer.name}</p>
                <p className="text-xs text-white/80 drop-shadow-sm">Organizer</p>
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleFollow()
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 whitespace-nowrap backdrop-blur-sm border border-white/30 ${
                isFollowing
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-white/30 text-white hover:bg-white/40'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Event Title + Invite Row */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {event.title}
            </h1>
            <button
              onClick={handleInvite}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 flex-shrink-0 self-start sm:self-center"
            >
              <Share2 className="w-4 h-4" />
              Invite
            </button>
          </div>
          
          {/* Date and Location Row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Date & Time */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {dateInfo.day} {dateInfo.month}, {dateInfo.year}
                </p>
                <p className="text-sm text-gray-600">
                  {event.dayOfWeek}, {event.time}
                </p>
              </div>
            </div>

            {/* Location - Left Side with Date */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">{event.location.venue}</p>
                  <p className="text-sm text-gray-600">{event.location.address}</p>
                </div>
                <button
                  onClick={handleOpenMaps}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  <MapPin className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Stats and Tags */}
        {(event.category || event.capacity || event.ticketsSold || event.tags) && (
          <div className="mb-8 flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200">
            {event.category && (
              <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                {event.category}
              </div>
            )}
            {event.capacity && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{event.capacity.toLocaleString()}</span> Capacity
              </div>
            )}
            {event.ticketsSold && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{event.ticketsSold.toLocaleString()}</span> Tickets Sold
              </div>
            )}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Event Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About Event</h2>
          <p className="text-gray-700 leading-relaxed">
            {showFullDescription || !needsTruncation
              ? event.description
              : `${shortDescription}...`}
          </p>
          {needsTruncation && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-700 mt-2 font-medium"
            >
              {showFullDescription ? 'Read Less' : 'Read More...'}
            </button>
          )}
        </div>

        {/* Buy Ticket Section */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleBuyTicket}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <span>
              {event.price === 0 || event.currency === 'Free' 
                ? 'GET FREE TICKET' 
                : `BUY TICKET ${event.currency} ${event.price}`}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
