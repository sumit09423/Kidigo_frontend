'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UserPlus, Star } from 'lucide-react'
import { useParams } from 'next/navigation'
import MainEventCards from '@/components/MainEventCards'
import { getOrganizerById, getEventsByOrganizer, getReviewsByOrganizer } from '@/lib/events'

export default function OrganizerProfilePage() {
  const params = useParams()
  const organizerId = params.id
  const [activeTab, setActiveTab] = useState('about')
  const [isFollowing, setIsFollowing] = useState(false)

  const organizer = getOrganizerById(organizerId)
  const organizerEvents = getEventsByOrganizer(organizerId)
  const reviews = getReviewsByOrganizer(organizerId)

  if (!organizer) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizer Not Found</h1>
          <p className="text-gray-600">The organizer you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </main>
    )
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  // Sample banner image - in production, this would come from organizer data
  const bannerImage = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=400&fit=crop&auto=format"

  // About content - using organizer bio if available, otherwise default content
  const aboutContent = {
    description: organizer.bio || "Founded by Vandana Badruka, Kalpataru is one of Hyderabad's most trusted creative learning spaces. Over two decades, it has grown from a music institute into a vibrant hub for arts, culture, and holistic learning.",
    offerings: [
      "Music (Indian & Western classical, vocals, instruments)",
      "Dance & Drama"
    ]
  }

  const tabs = [
    { id: 'about', label: 'ABOUT' },
    { id: 'events', label: 'EVENTS' },
    { id: 'reviews', label: 'REVIEWS' }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner Section with Profile Picture */}
      <div className="relative w-full h-64 md:h-80 bg-gray-200">
        <Image
          src={bannerImage}
          alt={`${organizer.name} banner`}
          fill
          className="object-cover"
          priority
        />
        
        {/* Profile Picture Overlay */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
            <Image
              src={organizer.avatar}
              alt={organizer.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="pt-16 md:pt-20 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Name and Follow Button */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              {organizer.name}
            </h1>
            <button
              onClick={handleFollow}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm
                transition-colors duration-200 whitespace-nowrap
                ${isFollowing 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              <UserPlus className="w-4 h-4" />
              {isFollowing ? 'Following' : '+ Follow'}
            </button>
          </div>

          {/* Follower Count */}
          <p className="text-center text-gray-600 text-sm md:text-base mb-8">
            {organizer.followers || 350} Followers
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-3 font-medium text-sm md:text-base
                  transition-colors duration-200 relative
                  ${activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pb-8">
            {activeTab === 'about' && (
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  {aboutContent.description}
                </p>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    ✨ What we offer
                  </h2>
                  <ul className="space-y-2">
                    {aboutContent.offerings.map((offering, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{offering}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                {organizerEvents.length > 0 ? (
                  <MainEventCards
                    events={organizerEvents}
                    title=""
                    variant="category"
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No events available at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={review.userAvatar}
                            alt={review.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{review.userName}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            
                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No reviews available yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
