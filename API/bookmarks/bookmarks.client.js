/**
 * Bookmarks API Client
 * Functions for all bookmark-related API calls
 * 
 * See BOOKMARK_API_DOCUMENTATION.md for detailed endpoint documentation
 */

import { api } from '../http/client';
import { BOOKMARKS_ENDPOINTS } from '../http/endpoints';

/**
 * Get all saved events (bookmarks) for the authenticated user
 * @returns {Promise<object>} { status, message, data: { savedEvents, count } }
 */
export async function getBookmarks() {
  const response = await api.get(BOOKMARKS_ENDPOINTS.LIST);
  return response;
}

/**
 * Add an event to bookmarks
 * @param {string} eventId - Event ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { savedEventsCount } }
 */
export async function addBookmark(eventId) {
  const response = await api.post(BOOKMARKS_ENDPOINTS.ADD(eventId));
  return response;
}

/**
 * Remove an event from bookmarks
 * @param {string} eventId - Event ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { savedEventsCount } }
 */
export async function removeBookmark(eventId) {
  const response = await api.delete(BOOKMARKS_ENDPOINTS.REMOVE(eventId));
  return response;
}

/**
 * Toggle bookmark status (add if not bookmarked, remove if bookmarked)
 * @param {string} eventId - Event ID (MongoDB ObjectId)
 * @param {boolean} isCurrentlyBookmarked - Current bookmark status
 * @returns {Promise<object>} { status, message, data: { savedEventsCount } }
 */
export async function toggleBookmark(eventId, isCurrentlyBookmarked) {
  if (isCurrentlyBookmarked) {
    return await removeBookmark(eventId);
  } else {
    return await addBookmark(eventId);
  }
}
