'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CategoryFilter from '@/components/CategoryFilter'
import MainEventCards from '@/components/MainEventCards'
import SmallEventCards from '@/components/SmallEventCards'
import ImageCarousel from '@/components/ImageCarousel'
import { getFeaturedEvents, getAllEvents, buildEventFilters } from '@/lib/events'
import { useLocation } from '@/contexts/LocationContext'

export default function Home() {
  const router = useRouter()
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [sportsEvents, setSportsEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { location } = useLocation()

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true)
        
        // Build filters - include cityId if available
        const filters = buildEventFilters(location)
        
        const [featured, all] = await Promise.all([
          getFeaturedEvents(),
          getAllEvents(filters)
        ])
        
        console.log('Loaded events:', { featured: featured?.length, all: all?.length })
        
        setFeaturedEvents(featured || [])
        
        // Get sports events for the Sports & Fitness section
        const sports = (all || [])
          .filter(event => 
            event.category?.toLowerCase() === 'sports' || 
            event.subCategory?.toLowerCase() === 'sports' ||
            event.subCategory?.toLowerCase() === 'running' ||
            event.subCategory?.toLowerCase() === 'basketball'
          )
          .slice(0, 3)
        
        setSportsEvents(sports)
      } catch (error) {
        console.error('Error loading events:', error)
        // Show error to user instead of stub data
        alert(`Failed to load events: ${error.message || 'Unknown error'}. Please check your connection and try again.`)
        setFeaturedEvents([])
        setSportsEvents([])
      } finally {
        setLoading(false)
      }
    }
    
    loadEvents()
  }, [location])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Category Filter Section - same design as events page */}
      <section className="py-4 border-b border-gray-200 mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            onCategoryClick={(button) => {
              // Navigate to events page with selected category
              if (button.id === 'all') {
                router.push('/events', { scroll: false })
              } else {
                router.push(`/events?category=${button.id}`, { scroll: false })
              }
            }}
            defaultSelected="all"
          />
        </div>
      </section>

      {/* Events Layout Section */}
      <section className="pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Main Events Area */}
            <div className="w-full lg:w-4/5 lg:border-r lg:border-gray-200 lg:pr-8">
              <MainEventCards 
                title="Featured Events"
                events={featuredEvents}
                seeAllUrl="/events"
                loading={loading}
              />
              
              {/* Invite Friend Image Carousel */}
              <div className="mt-8 md:mt-12">
                <ImageCarousel
                  title="Invite Your Friends"
                  images={[
                    {
                      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
                      title: 'Invite Your Friends',
                      description: 'Share amazing events with your friends and earn rewards',
                      buttonText: 'Invite Now'
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop',
                      title: 'Share & Earn',
                      description: 'Get rewards when your friends join events through your invite',
                      buttonText: 'Start Sharing'
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=600&fit=crop',
                      title: 'Connect Together',
                      description: 'Experience events together with your friends and family',
                      buttonText: 'Connect Now'
                    }
                  ]}
                  height="h-64 md:h-80 lg:h-96"
                  autoPlay={true}
                  autoPlayInterval={4000}
                  showDots={true}
                  showArrows={true}
                />
              </div>
              
              {/* Sports & Fitness Section */}
              <div className="mt-8 md:mt-12">
                <MainEventCards 
                  title="Sports & Fitness"
                  events={sportsEvents}
                  seeAllUrl="/events"
                  loading={loading}
                />
              </div>
            </div>

            {/* Sidebar Area - Hidden on mobile/tablet, visible on desktop */}
            <div className="w-full lg:w-1/5">
              <div className="lg:sticky lg:top-24">
                <SmallEventCards />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
