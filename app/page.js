'use client'

import HorizontalScrollButtons from '@/components/HorizontalScrollButtons'
import MainEventCards from '@/components/MainEventCards'
import SmallEventCards from '@/components/SmallEventCards'
import ImageCarousel from '@/components/ImageCarousel'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Category Filter Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HorizontalScrollButtons
            buttons={[
              { id: 'all', label: 'All Events' },
              { id: 'concerts', label: 'Concerts' },
              { id: 'sports', label: 'Sports' },
              { id: 'theater', label: 'Theater' },
              { id: 'comedy', label: 'Comedy' },
              { id: 'food', label: 'Food & Drink' },
              { id: 'art', label: 'Art & Culture' },
              { id: 'workshops', label: 'Workshops' },
            ]}
            onButtonClick={(button) => {
              console.log('Selected category:', button)
              // Add your filter logic here
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
                seeAllUrl="/events"
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
                  events={[
                    {
                      id: 4,
                      title: 'Marathon Run 2024',
                      date: '2024-07-20',
                      time: '6:00 AM',
                      location: 'Riverside Park',
                      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&auto=format',
                      price: '$35',
                      category: 'sports'
                    },
                    {
                      id: 5,
                      title: 'Yoga in the Park',
                      date: '2024-07-25',
                      time: '8:00 AM',
                      location: 'Central Park',
                      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&auto=format',
                      price: '$20',
                      category: 'sports'
                    },
                    {
                      id: 6,
                      title: 'Basketball Tournament',
                      date: '2024-08-05',
                      time: '2:00 PM',
                      location: 'Sports Complex',
                      image: 'https://images.unsplash.com/photo-1519861531473-92002622ca7b?w=800&h=600&fit=crop&auto=format',
                      price: '$15',
                      category: 'sports'
                    },
                  ]}
                  seeAllUrl="/events"
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
