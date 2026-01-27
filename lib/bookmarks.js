import { getBookmarks as getBookmarksAPI, addBookmark as addBookmarkAPI, removeBookmark as removeBookmarkAPI, toggleBookmark as toggleBookmarkAPI } from '@/API/bookmarks/bookmarks.client'
import { transformEvent } from './events'

/**
 * Transform API bookmark event format to component format
 * Uses the same transformation as events since bookmarks return event objects
 * @param {object} apiEvent - Event from bookmark API
 * @returns {object} Transformed event object
 */
function transformBookmarkEvent(apiEvent) {
  return transformEvent(apiEvent)
}

/**
 * Get all bookmarks (saved events) for the authenticated user
 * @returns {Promise<Array>} Array of bookmarked events
 */
export async function getBookmarks() {
  try {
    console.log('Fetching bookmarks from API')
    const response = await getBookmarksAPI()
    console.log('Bookmarks API Response:', response)
    
    if (response.status === 'success' && response.data?.savedEvents) {
      const transformedBookmarks = response.data.savedEvents.map(transformBookmarkEvent).filter(Boolean)
      console.log(`✅ Successfully fetched ${transformedBookmarks.length} bookmarks from API`)
      return transformedBookmarks
    }
    
    // Handle empty bookmarks case (this is valid - user has no bookmarks)
    if (response.status === 'success' && response.data?.savedEvents && response.data.savedEvents.length === 0) {
      console.log('✅ User has no bookmarks')
      return []
    }
    
    console.warn('⚠️ Unexpected API response structure:', response)
    // If response is successful but structure is unexpected, return empty array instead of throwing
    if (response.status === 'success') {
      return []
    }
    
    // If response status is not success, throw an error
    throw new Error(response.message || 'Failed to fetch bookmarks')
  } catch (error) {
    console.error('❌ Error fetching bookmarks from API:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    })
    
    // Check if it's an authentication error
    if (error.status === 401 || error.status === 403) {
      console.error('🔒 Authentication error - User needs to login')
    }
    
    // Re-throw so calling code can handle it
    throw error
  }
}

/**
 * Add an event to bookmarks
 * @param {string} eventId - Event ID
 * @returns {Promise<object>} API response
 */
export async function addBookmark(eventId) {
  try {
    console.log('Adding bookmark for event:', eventId)
    const response = await addBookmarkAPI(eventId)
    console.log('Add bookmark API Response:', response)
    return response
  } catch (error) {
    console.error('❌ Error adding bookmark:', error)
    throw error
  }
}

/**
 * Remove an event from bookmarks
 * @param {string} eventId - Event ID
 * @returns {Promise<object>} API response
 */
export async function removeBookmark(eventId) {
  try {
    console.log('Removing bookmark for event:', eventId)
    const response = await removeBookmarkAPI(eventId)
    console.log('Remove bookmark API Response:', response)
    return response
  } catch (error) {
    console.error('❌ Error removing bookmark:', error)
    throw error
  }
}

/**
 * Toggle bookmark status
 * @param {string} eventId - Event ID
 * @param {boolean} isCurrentlyBookmarked - Current bookmark status
 * @returns {Promise<object>} API response
 */
export async function toggleBookmark(eventId, isCurrentlyBookmarked) {
  try {
    console.log('Toggling bookmark for event:', eventId, 'Currently bookmarked:', isCurrentlyBookmarked)
    const response = await toggleBookmarkAPI(eventId, isCurrentlyBookmarked)
    console.log('Toggle bookmark API Response:', response)
    return response
  } catch (error) {
    console.error('❌ Error toggling bookmark:', error)
    throw error
  }
}

/**
 * Check if an event is bookmarked
 * @param {string} eventId - Event ID
 * @param {Array} bookmarkedEvents - Array of bookmarked event objects
 * @returns {boolean} True if event is bookmarked
 */
export function isEventBookmarked(eventId, bookmarkedEvents = []) {
  if (!eventId || !bookmarkedEvents || bookmarkedEvents.length === 0) {
    return false
  }
  return bookmarkedEvents.some(event => event.id === eventId)
}
