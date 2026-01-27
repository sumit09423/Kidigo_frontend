'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Bell, ChevronDown, Menu, X, User, LogIn, MapPin } from 'lucide-react'
import AuthModal from './AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { useLocation } from '@/contexts/LocationContext'

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function Navbar() {
  const { user: loggedInUser, logout } = useAuth()
  const { location } = useLocation()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [imageError, setImageError] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState('login')
  
  // Debounce search query (500ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [loggedInUser?.profileImage])

  // Handle search - navigate to events page with search query
  const handleSearch = (query) => {
    if (!query || !query.trim()) {
      router.push('/events')
      return
    }
    
    const trimmedQuery = query.trim()
    router.push(`/events?search=${encodeURIComponent(trimmedQuery)}`)
  }

  // Handle search input key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  // Handle search button click
  const handleSearchClick = () => {
    handleSearch(searchQuery)
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Extract first name from email address
  const getFirstNameFromEmail = (email) => {
    if (!email) return 'User'
    
    // Extract the part before @
    const emailPrefix = email.split('@')[0]
    
    // Extract first name (part before dot, or entire prefix if no dot)
    const firstName = emailPrefix.split('.')[0]
    
    // Capitalize first letter
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
  }

  // Get display name - prioritize name, then first name from email
  const getDisplayName = () => {
    if (loggedInUser?.name) {
      // If name exists, extract first name from it
      const firstName = loggedInUser.name.split(' ')[0]
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    }
    if (loggedInUser?.email) {
      return getFirstNameFromEmail(loggedInUser.email)
    }
    return 'User'
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Larger size */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo/logo.png"
              alt="Kidigo Logo"
              width={120}
              height={90}
              className="w-16 h-12 sm:w-20 sm:h-15 md:w-24 md:h-18 lg:w-[120px] lg:h-[90px] object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4 flex-1 justify-end">
            {/* Location Display */}
            {location?.city && (
              <div className="flex items-center space-x-1.5 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-medium text-purple-700 whitespace-nowrap">
                  {location.city}
                </span>
              </div>
            )}
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Events, Workshops, Classes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="block w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSearchClick}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Notification Bell */}
            {loggedInUser && (
              <Link
                href="/notifications"
                className="relative w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {/* Notification Badge */}
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Link>
            )}

            {/* User Profile with Dropdown or Login Button */}
            {loggedInUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    {loggedInUser?.profileImage && !imageError ? (
                      <Image
                        src={loggedInUser.profileImage}
                        alt={loggedInUser.name || loggedInUser.email || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10 border-2 border-gray-200"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  {/* User Name - Always visible */}
                  <span className="text-sm font-semibold text-gray-900">
                    {getDisplayName()}
                  </span>
                  {/* Down Arrow */}
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Events
                      </Link>
                      <Link
                        href="/bookmarks"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Saved Events
                      </Link>
                      <Link
                        href="/notifications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Notifications
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalView('login')
                  setIsAuthModalOpen(true)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <Menu className="block h-6 w-6" />
              ) : (
                <X className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {/* Mobile Location Display */}
            {location?.city && (
              <div className="flex items-center space-x-2 px-3 py-2 mb-3 bg-purple-50 rounded-lg border border-purple-200">
                <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-medium text-purple-700">
                  {location.city}
                </span>
              </div>
            )}
            
            {/* Mobile Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search for Events, Workshops, Classes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSearchClick}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-500 block px-3 py-2 text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {loggedInUser ? (
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    {loggedInUser?.profileImage && !imageError ? (
                      <Image
                        src={loggedInUser.profileImage}
                        alt={loggedInUser.name || loggedInUser.email || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10 border-2 border-gray-200"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {getDisplayName()}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalView('login')
                    setIsAuthModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal - Unified Login/Signup/Verification/Reset Password */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </nav>
  )
}
