'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, ArrowRight, Activity, Music, Wrench, Palette } from 'lucide-react'
import HorizontalScrollButtons from '@/components/HorizontalScrollButtons'
import Link from 'next/link'

export default function MyEventsPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('upcoming') // 'upcoming' or 'past'

  // Category buttons - matching the design from the image
  const categoryButtons = [
    { 
      id: 'sports', 
      label: 'Sports', 
      color: '#F0635A',
      icon: Activity
    },
    { 
      id: 'music', 
      label: 'Music', 
      color: '#F59762',
      icon: Music
    },
    { 
      id: 'arts', 
      label: 'Arts', 
      color: '#29D697',
      icon: Wrench
    },
    { 
      id: 'art', 
      label: 'Art', 
      color: '#4285F4',
      icon: Palette
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Category Filter Section */}
      <section className="py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HorizontalScrollButtons
            buttons={categoryButtons}
            onButtonClick={(button) => {
              console.log('Selected category:', button)
            }}
            defaultSelected="sports"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Back Button and Title */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedTab === 'upcoming'
                ? 'bg-purple-300 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            UPCOMING
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedTab === 'past'
                ? 'bg-purple-300 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            PAST EVENTS
          </button>
        </div>

        {/* Content Area */}
        {selectedTab === 'upcoming' ? (
          /* Empty State for Upcoming Events */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            {/* Calendar Illustration */}
            <div className="relative mb-6">
              <Calendar className="w-32 h-32 text-red-500" />
              {/* Clock/Refresh Icon Overlay */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Empty State Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Upcoming Event
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Lorem ipsum dolor sit amet, consectetur
            </p>

            {/* Explore Events Button */}
            <Link
              href="/events"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Empty State for Past Events */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative mb-6">
              <Calendar className="w-32 h-32 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Past Events
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              You haven't attended any events yet
            </p>
            <Link
              href="/events"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>EXPLORE EVENTS</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
