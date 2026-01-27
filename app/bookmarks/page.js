'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bookmark, RefreshCw } from 'lucide-react'
import MainEventCards from '@/components/MainEventCards'
import { getBookmarks } from '@/lib/bookmarks'
import { useAuth } from '@/contexts/AuthContext'
import { getAccessToken } from '@/API/http/client'
import EventCardSkeleton from '@/components/EventCardSkeleton'

export default function BookmarksPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBookmarks = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('Please login to view your bookmarks')
      setLoading(false)
      return
    }

    // Verify token exists
    const token = getAccessToken()
    if (!token) {
      setError('Authentication token not found. Please login again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Loading bookmarks for user:', user?.email)
      console.log('Token exists:', !!token)
      const savedEvents = await getBookmarks()
      console.log('Bookmarks loaded successfully:', savedEvents?.length)
      setBookmarks(savedEvents || [])
    } catch (err) {
      console.error('Error loading bookmarks:', err)
      console.error('Error details:', {
        status: err?.status,
        message: err?.message,
        data: err?.data
      })
      
      // Handle different error types
      if (err?.status === 401 || err?.status === 403) {
        setError('Please login to view your bookmarks')
      } else if (err?.status === 0) {
        setError('Network error. Please check your connection and ensure the backend API is running.')
      } else if (err?.status === 404) {
        setError('Bookmarks endpoint not found. Please contact support.')
      } else if (err?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        // Show the actual error message if available
        const errorMessage = err?.message || err?.data?.message || 'Failed to load bookmarks. Please try again later.'
        setError(errorMessage)
      }
      setBookmarks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookmarks()
  }, [isAuthenticated, user])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated() && !loading) {
      // Optionally redirect to login or show login prompt
      // router.push('/?login=true')
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Back Button and Title */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-[#F0635A]" />
            <h1 className="text-2xl font-bold text-gray-900">Saved Events</h1>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium mb-2">{error}</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">Debug Info</summary>
                <div className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded">
                  <p>User: {user?.email || 'Not logged in'}</p>
                  <p>Authenticated: {isAuthenticated() ? 'Yes' : 'No'}</p>
                  <p>Token: {getAccessToken() ? 'Present' : 'Missing'}</p>
                  <p>Check browser console for more details</p>
                </div>
              </details>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={loadBookmarks}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              {error.includes('login') && (
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <EventCardSkeleton count={6} />
          </div>
        ) : bookmarks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            {/* Bookmark Illustration */}
            <div className="relative mb-6">
              <Bookmark className="w-32 h-32 text-gray-300" />
            </div>

            {/* Empty State Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Saved Events Yet
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Start bookmarking events you&apos;re interested in to see them here. Click the bookmark icon on any event to save it.
            </p>

            {/* Explore Events Button */}
            <button
              onClick={() => router.push('/events')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>EXPLORE EVENTS</span>
            </button>
          </div>
        ) : (
          /* Bookmarks List */
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {bookmarks.length} {bookmarks.length === 1 ? 'event' : 'events'} saved
              </p>
            </div>
            <MainEventCards 
              events={bookmarks} 
              title="Your Saved Events"
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
