/**
 * Categories API Client
 * Functions for all category-related API calls
 * 
 * See CATEGORY_GET_API_DOCUMENTATION.md for detailed endpoint documentation
 */

import { api } from '../http/client';
import { CATEGORIES_ENDPOINTS } from '../http/endpoints';

/**
 * Get all categories with optional filters
 * @param {object} filters - Optional filters object
 * @param {number} filters.page - Page number for pagination (default: 1)
 * @param {number} filters.limit - Number of categories per page (default: 10, max: 100)
 * @param {string} filters.search - Search categories by name (case-insensitive)
 * @returns {Promise<object>} { status, message, data: { categories, pagination } }
 */
export async function getAllCategories(filters = {}) {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Only add filters that are provided
  if (filters.page) {
    queryParams.append('page', filters.page.toString());
  }
  if (filters.limit) {
    queryParams.append('limit', filters.limit.toString());
  }
  if (filters.search) {
    queryParams.append('search', filters.search);
  }

  const endpoint = queryParams.toString() 
    ? `${CATEGORIES_ENDPOINTS.LIST}?${queryParams.toString()}`
    : CATEGORIES_ENDPOINTS.LIST;

  const response = await api.get(endpoint);
  return response;
}

/**
 * Get category by ID
 * @param {string} categoryId - Category ID (MongoDB ObjectId)
 * @returns {Promise<object>} { status, message, data: { category } }
 */
export async function getCategoryById(categoryId) {
  const response = await api.get(CATEGORIES_ENDPOINTS.DETAILS(categoryId));
  return response;
}
