'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useLocation } from '@/contexts/LocationContext'

// Reverse geocoding function to get city from coordinates
async function getCityFromCoordinates(lat, lng) {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    // Using zoom=10 to get city-level information
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Kidigo Event Platform' // Required by Nominatim
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }
    
    const data = await response.json()
    const address = data.address || {}
    const displayName = data.display_name || ''
    
    // Helper function to check if a string is an administrative division
    const isAdministrativeDivision = (str) => {
      if (!str) return true
      const lower = str.toLowerCase()
      return lower.includes('taluka') || 
             lower.includes('tehsil') || 
             lower.includes('district') ||
             lower.includes('county') ||
             lower.includes('subdistrict') ||
             lower.includes('block')
    }
    
    // Priority order for extracting city name
    // For Indian locations, we need to be careful about administrative divisions
    let city = null
    
    // First, try city_district (often contains main city in India)
    if (address.city_district && !isAdministrativeDivision(address.city_district)) {
      city = address.city_district
    }
    // Then try city
    else if (address.city && !isAdministrativeDivision(address.city)) {
      city = address.city
    }
    // Then try town
    else if (address.town && !isAdministrativeDivision(address.town)) {
      city = address.town
    }
    // Then try municipality
    else if (address.municipality && !isAdministrativeDivision(address.municipality)) {
      city = address.municipality
    }
    
    // If we still don't have a good city name, parse from display_name
    if (!city || isAdministrativeDivision(city)) {
      const parts = displayName.split(',').map(p => p.trim())
      
      // Common Indian city names to look for in display_name
      const majorIndianCities = [
        'Ahmedabad', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
        'Kolkata', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur',
        'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
        'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
        'Rajkot', 'Varanasi', 'Srinagar', 'Amritsar', 'Chandigarh'
      ]
      
      // Check if any major city name appears in display_name
      for (const part of parts) {
        for (const majorCity of majorIndianCities) {
          if (part.toLowerCase().includes(majorCity.toLowerCase()) && 
              !isAdministrativeDivision(part)) {
            city = majorCity
            break
          }
        }
        if (city) break
      }
      
      // If still no city, try to extract from display_name parts
      if (!city || isAdministrativeDivision(city)) {
        // Usually city appears in the first few parts before state
        for (let i = 0; i < Math.min(parts.length, 4); i++) {
          const part = parts[i]
          // Skip if it's a number, postal code, or administrative division
          if (part && 
              !/^\d+$/.test(part) && 
              !isAdministrativeDivision(part) &&
              part.length > 2 &&
              !part.toLowerCase().includes('india')) {
            city = part
            break
          }
        }
      }
    }
    
    // Final fallback: use state if no city found (but prefer city over state)
    if (!city || isAdministrativeDivision(city)) {
      // Try state, but only if it's a known major city that's also a state name
      const stateAsCity = address.state
      if (stateAsCity && 
          (stateAsCity.toLowerCase().includes('delhi') || 
           stateAsCity.toLowerCase().includes('mumbai'))) {
        city = stateAsCity
      } else {
        city = address.state || address.county || 'Unknown Location'
      }
    }
    
    // Clean up the city name
    if (city && city !== 'Unknown Location') {
      city = city.trim()
      // Remove "Taluka", "Tehsil" etc. if they appear
      city = city.replace(/\s*(taluka|tehsil|district|county)\s*/gi, '').trim()
      
      // Capitalize properly
      city = city.split(' ').map(word => {
        if (word.length === 0) return word
        // Handle special cases like "Mc" or "O'"
        if (word.length > 1 && word[1] === word[1].toUpperCase()) {
          return word
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }).join(' ')
    }
    
    return city || 'Unknown Location'
  } catch (error) {
    console.error('Error getting city from coordinates:', error)
    throw error
  }
}

export default function LocationModal() {
  const { location, saveLocation, hasRequestedLocation, setHasRequestedLocation, isLoading: contextLoading } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Show modal if location hasn't been requested yet and context is loaded
    if (!contextLoading && !hasRequestedLocation && !location) {
      setIsOpen(true)
    }
  }, [contextLoading, hasRequestedLocation, location])

  const handleGetLocation = () => {
    setIsGettingLocation(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Get city name from coordinates
          const city = await getCityFromCoordinates(latitude, longitude)
          
          // Save location
          saveLocation(city, { lat: latitude, lng: longitude })
          
          // Close modal
          setIsOpen(false)
        } catch (err) {
          console.error('Error getting city:', err)
          setError('Failed to determine your city. Please try again.')
          setIsGettingLocation(false)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        let errorMessage = 'Failed to get your location. '
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please allow location access to see events near you.'
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.'
            break
          case err.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.'
            break
          default:
            errorMessage += 'An unknown error occurred.'
        }
        
        setError(errorMessage)
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handleSkip = () => {
    setHasRequestedLocation(true)
    setIsOpen(false)
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!isOpen || contextLoading) return null

  return (
    <>
      {/* Glassy blur backdrop */}
      <div
        className="fixed inset-0 z-[100] backdrop-blur-md bg-black/20 transition-opacity duration-300"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 pointer-events-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4 mt-2">
            <Image
              src="/assets/logo/logo.png"
              alt="Kidigo Logo"
              width={120}
              height={90}
              className="w-20 h-auto object-contain"
              priority
            />
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Help Us Find Events Near You
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Allow us to access your location to show you events happening in your city
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 text-center">
                We use your location to personalize your experience and show you relevant events nearby.
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    Allow Location Access
                  </>
                )}
              </button>

              <button
                onClick={handleSkip}
                disabled={isGettingLocation}
                className="w-full py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip for Now
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              You can change this later in your settings
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
