'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null) // { city, coordinates: { lat, lng } }
  const [isLoading, setIsLoading] = useState(true)
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false)

  useEffect(() => {
    // Check localStorage for existing location
    if (typeof window !== 'undefined') {
      const storedLocation = localStorage.getItem('kidigo_location')
      const hasRequested = localStorage.getItem('kidigo_location_requested')
      
      if (storedLocation) {
        try {
          setLocation(JSON.parse(storedLocation))
        } catch (error) {
          console.error('Error parsing stored location:', error)
          localStorage.removeItem('kidigo_location')
        }
      }
      
      setHasRequestedLocation(hasRequested === 'true')
      setIsLoading(false)
    }
  }, [])

  const saveLocation = (city, coordinates) => {
    const locationData = { city, coordinates }
    setLocation(locationData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('kidigo_location', JSON.stringify(locationData))
      localStorage.setItem('kidigo_location_requested', 'true')
      setHasRequestedLocation(true)
    }
  }

  const clearLocation = () => {
    setLocation(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kidigo_location')
      localStorage.removeItem('kidigo_location_requested')
      setHasRequestedLocation(false)
    }
  }

  return (
    <LocationContext.Provider 
      value={{ 
        location, 
        saveLocation, 
        clearLocation, 
        isLoading, 
        hasRequestedLocation,
        setHasRequestedLocation 
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
