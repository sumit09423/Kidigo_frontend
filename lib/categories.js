import { getAllCategories as getAllCategoriesAPI, getCategoryById as getCategoryByIdAPI } from '@/API/categories/categories.client'

/**
 * Get all categories from API
 * @param {object} filters - Optional filters (page, limit, search)
 * @returns {Promise<Array>} Array of categories
 */
export async function getAllCategories(filters = {}) {
  try {
    console.log('Fetching categories from API with filters:', filters)
    const response = await getAllCategoriesAPI(filters)
    console.log('API Response:', response)
    
    if (response.status === 'success' && response.data?.categories) {
      const categories = response.data.categories
      console.log(`✅ Successfully fetched ${categories.length} categories from API`)
      return categories
    }
    
    console.warn('⚠️ Unexpected API response structure:', response)
    return []
  } catch (error) {
    console.error('❌ Error fetching categories from API:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      data: error.data
    })
    
    // Check if it's an authentication error
    if (error.status === 401 || error.status === 403) {
      console.error('🔒 Authentication error - API requires login')
    }
    
    throw error
  }
}

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object|null>} Category object or null if not found
 */
export async function getCategoryById(id) {
  try {
    console.log('Fetching category by ID from API:', id)
    const response = await getCategoryByIdAPI(id)
    console.log('API Response:', response)
    
    if (response.status === 'success' && response.data?.category) {
      console.log('Successfully fetched category from API')
      return response.data.category
    }
    
    console.warn('Category not found in API response')
    return null
  } catch (error) {
    console.error('Error fetching category from API:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      data: error.data
    })
    throw error
  }
}

/**
 * Map category name to icon component
 * This is a helper function to map category names to Lucide icons
 * @param {string} categoryName - Category name
 * @returns {object} Icon component or null
 */
export function getCategoryIcon(categoryName) {
  // Dynamic import of Lucide icons
  // This will be handled by the component that uses it
  return null
}

/**
 * Transform API category to button format for HorizontalScrollButtons
 * @param {object} category - Category from API
 * @param {number} index - Index of category in array (for color assignment)
 * @param {object} iconMap - Map of category names to icon components (fallback)
 * @returns {object} Button object with id, label, color, icon, categoryIcon
 */
export function transformCategoryToButton(category, index = 0, iconMap = {}) {
  const categoryName = category.category || ''
  const lowerName = categoryName.toLowerCase()
  const categoryIcon = category.categoryIcon || null
  
  // Log category icon info for debugging
  if (categoryIcon) {
    console.log(`Category "${categoryName}" has icon:`, categoryIcon)
  } else {
    console.log(`Category "${categoryName}" has no categoryIcon, using fallback icon`)
  }
  
  return {
    id: category.id || lowerName,
    label: categoryName,
    color: getCategoryColor(categoryName, index),
    icon: iconMap[lowerName] || iconMap[categoryName] || null, // Fallback Lucide icon
    categoryIcon: categoryIcon // Icon URL from API
  }
}

/**
 * Color palette for categories - ensures each category gets a different color
 */
const categoryColorPalette = [
  '#F0635A', // Red
  '#F59762', // Orange
  '#29D697', // Green
  '#4285F4', // Blue
  '#9B59B6', // Purple
  '#E74C3C', // Red variant
  '#3498DB', // Blue variant
  '#16A085', // Teal
  '#E67E22', // Orange variant
  '#1ABC9C', // Turquoise
  '#F39C12', // Gold
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#4CAF50', // Green variant
  '#FF9800', // Deep Orange
  '#9C27B0', // Deep Purple
  '#00ACC1', // Light Blue
  '#8BC34A', // Light Green
  '#FF5722', // Deep Orange variant
  '#607D8B', // Blue Grey
]

/**
 * Generate a consistent color for a category based on its name
 * Uses a simple hash function to ensure same category always gets same color
 * @param {string} categoryName - Category name
 * @param {number} index - Optional index for fallback
 * @returns {string} Color hex code
 */
export function getCategoryColor(categoryName, index = 0) {
  if (!categoryName) {
    return categoryColorPalette[index % categoryColorPalette.length]
  }
  
  // Simple hash function to convert category name to a number
  let hash = 0
  for (let i = 0; i < categoryName.length; i++) {
    const char = categoryName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index in color palette
  const colorIndex = Math.abs(hash) % categoryColorPalette.length
  return categoryColorPalette[colorIndex]
}
