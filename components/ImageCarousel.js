'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function ImageCarousel({ 
  images = [], 
  title,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  height = 'h-60',
  className = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayInterval, images.length])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Title */}
    

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden rounded-xl">
        {/* Images Container */}
        <div className={`relative ${height}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={typeof image === 'string' ? image : image.url || image.src}
                alt={typeof image === 'string' ? `Slide ${index + 1}` : image.alt || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay Content */}
              {typeof image !== 'string' && image.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                  <div className="w-full p-6 text-white">
                    {image.title && (
                      <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-lg">{image.description}</p>
                    )}
                    {image.buttonText && (
                      <button className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                        {image.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {showDots && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
