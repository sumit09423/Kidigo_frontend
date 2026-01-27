/**
 * Events API Client
 * Functions for all event-related API calls
 * 
 * See EVENT_API_DOCUMENTATION.md for detailed endpoint documentation
 */

import { api } from '../http/client';
import { EVENTS_ENDPOINTS } from '../http/endpoints';

/**
 * Get all events with optional filters
 * @param {object} filters - Optional filters object
 * @param {string} filters.cityId - Filter by city ID (MongoDB ObjectId)
 * @param {string} filters.categoryId - Filter by category ID (MongoDB ObjectId)
 * @param {string} filters.dateFilter - Filter by date: 'Today', 'ThisWeekend', or 'YYYY-MM-DD'
 * @param {number} filters.minAge - Minimum age filter (0-18)
 * @param {number} filters.maxAge - Maximum age filter (0-18)
 * @param {string} filters.organizerId - Filter by organizer/vendor ID
 * @param {string} filters.search - Search in event title, description, and tags
 * @param {boolean} filters.isPublished - Filter by published status (default: true)
 * @param {number} filters.page - Page number for pagination (default: 1)
 * @param {number} filters.limit - Number of events per page (default: 10)
 * @returns {Promise<object>} { status, message, data: { events, pagination, filters } }
 */
export async function getAllEvents(filters = {}) {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Only add filters that are provided
  if (filters.cityId) {
    queryParams.append('cityId', filters.cityId);
  }
  if (filters.categoryId) {
    queryParams.append('categoryId', filters.categoryId);
  }
  if (filters.dateFilter) {
    queryParams.append('dateFilter', filters.dateFilter);
  }
  if (filters.minAge !== undefined && filters.minAge !== null) {
    queryParams.append('minAge', filters.minAge.toString());
  }
  if (filters.maxAge !== undefined && filters.maxAge !== null) {
    queryParams.append('maxAge', filters.maxAge.toString());
  }
  if (filters.organizerId) {
    queryParams.append('organizerId', filters.organizerId);
  }
  if (filters.search) {
    queryParams.append('search', filters.search);
  }
  if (filters.isPublished !== undefined && filters.isPublished !== null) {
    queryParams.append('isPublished', filters.isPublished.toString());
  }
  if (filters.page) {
    queryParams.append('page', filters.page.toString());
  }
  if (filters.limit) {
    queryParams.append('limit', filters.limit.toString());
  }

  const endpoint = queryParams.toString() 
    ? `${EVENTS_ENDPOINTS.LIST}?${queryParams.toString()}`
    : EVENTS_ENDPOINTS.LIST;

  const response = await api.get(endpoint);
  return response;
}

/**
 * Get event by ID
 * @param {string} eventId - Event ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { event } }
 */
export async function getEventById(eventId) {
  const response = await api.get(EVENTS_ENDPOINTS.DETAILS(eventId));
  return response;
}

/**
 * Get events by category
 * @param {string} categoryId - Category ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { events } }
 */
export async function getEventsByCategory(categoryId) {
  const response = await api.get(`/api/events/category/${categoryId}`);
  return response;
}

/**
 * Get events by organizer
 * @param {string} organizerId - Organizer/Vendor ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { events } }
 */
export async function getEventsByOrganizer(organizerId) {
  const response = await api.get(`/api/events/organizer/${organizerId}`);
  return response;
}

/**
 * Get events by city
 * @param {string} cityId - City ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { events } }
 */
export async function getEventsByCity(cityId) {
  const response = await api.get(`/api/events/city/${cityId}`);
  return response;
}
