'use client'

import { useState, useEffect } from 'react'
import HorizontalScrollButtons from '@/components/HorizontalScrollButtons'
import CategorySkeleton from '@/components/CategorySkeleton'
import { getAllCategories, transformCategoryToButton } from '@/lib/categories'
import { LayoutGrid, Music, Activity, Film, Smile, UtensilsCrossed, Palette, Wrench } from 'lucide-react'

/**
 * Unified Category Filter Component
 * Handles loading categories from API, showing skeleton during load, and rendering category buttons
 * 
 * @param {Function} onCategoryClick - Callback when a category is clicked
 * @param {string} defaultSelected - Default selected category ID
 * @param {string} selected - Controlled selected category ID
 * @param {string} className - Additional CSS classes
 */
export default function CategoryFilter({
  onCategoryClick,
  defaultSelected = 'all',
  selected = null,
  className = '',
}) {
  const [categoryButtons, setCategoryButtons] = useState([])
  const [loading, setLoading] = useState(true)

  // Complete icon mapping for categories (used across all pages)
  const iconMap = {
    'all': LayoutGrid,
    'music': Music,
    'concerts': Music,
    'sports': Activity,
    'theater': Film,
    'comedy': Smile,
    'food': UtensilsCrossed,
    'art': Palette,
    'arts': Palette,
    'workshops': Wrench,
  }

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        const categories = await getAllCategories({ limit: 50 })
        
        // Transform categories to button format with index for color assignment
        // Always include "All Events" button with icon at the beginning
        const buttons = [
          { id: 'all', label: 'All Events', color: '#6B7280', icon: LayoutGrid },
          ...categories.map((cat, index) => transformCategoryToButton(cat, index, iconMap))
        ]
        
        setCategoryButtons(buttons)
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback to "All Events" button with icon
        setCategoryButtons([
          { id: 'all', label: 'All Events', color: '#6B7280', icon: LayoutGrid }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  // Show skeleton while loading
  if (loading) {
    return (
      <div className={className}>
        <CategorySkeleton count={5} />
      </div>
    )
  }

  // Show category buttons once loaded
  return (
    <div className={className}>
      <HorizontalScrollButtons
        buttons={categoryButtons}
        onButtonClick={onCategoryClick}
        defaultSelected={defaultSelected}
        selected={selected}
      />
    </div>
  )
}
