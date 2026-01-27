'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Color palette for buttons - matches events page category design (all work well with white text)
const buttonColors = [
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
]

export default function HorizontalScrollButtons({
  buttons = [],
  onButtonClick,
  defaultSelected = null,
  selected: controlledSelected = null,
  className = '',
}) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected)
  const [imageErrors, setImageErrors] = useState({})

  // Controlled mode: use prop when provided; otherwise use internal state
  const isControlled = controlledSelected !== null && controlledSelected !== undefined
  const selectedButton = isControlled ? controlledSelected : internalSelected

  useEffect(() => {
    if (!isControlled && defaultSelected != null) {
      setInternalSelected(defaultSelected)
    }
  }, [defaultSelected, isControlled])

  const handleClick = (button) => {
    const id = button.id ?? button.label
    if (!isControlled) {
      setInternalSelected(id)
    }
    onButtonClick?.(button)
  }

  // No default buttons - categories should come from API
  const buttonsToRender = buttons.length > 0 ? buttons : []

  return (
    <div className={`w-full relative ${className}`}>
      <div
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY
        }}
      >
        <div className="flex gap-2 pb-1">
          {buttonsToRender.map((button, index) => {
            const buttonColor = button.color ?? buttonColors[index % buttonColors.length]
            const Icon = button.icon // Lucide icon component (fallback)
            const categoryIcon = button.categoryIcon // Icon URL from API
            const id = button.id ?? button.label
            const isSelected = selectedButton === id
            const imageError = imageErrors[id]

            return (
              <button
                key={id}
                onClick={() => handleClick(button)}
                style={{
                  backgroundColor: buttonColor,
                  borderRadius: '20.9626px',
                }}
                className={`
                  flex-shrink-0 px-4 py-2
                  font-medium text-sm transition-all duration-200
                  whitespace-nowrap text-white
                  hover:opacity-90
                  flex items-center gap-2
                  ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-50' : ''}
                `}
              >
                {/* Show categoryIcon from API if available, otherwise fallback to Lucide icon */}
                {(() => {
                  // Try categoryIcon first, then fallback to Lucide icon
                  if (categoryIcon && !imageError && categoryIcon.trim() !== '') {
                    const isSvg = categoryIcon.toLowerCase().includes('.svg') || 
                                  categoryIcon.toLowerCase().includes('svg') ||
                                  categoryIcon.toLowerCase().startsWith('data:image/svg')
                    
                    if (isSvg) {
                      // For SVG files, use img tag directly for better compatibility
                      return (
                        <img
                          src={categoryIcon}
                          alt={button.label}
                          className="w-4 h-4 shrink-0 object-contain"
                          onError={(e) => {
                            console.error(`Failed to load SVG category icon for ${button.label}:`, categoryIcon, e)
                            setImageErrors(prev => ({ ...prev, [id]: true }))
                          }}
                          onLoad={() => {
                            console.log(`✅ Successfully loaded SVG category icon for ${button.label}:`, categoryIcon)
                          }}
                        />
                      )
                    } else {
                      // For other image formats, use Next.js Image component
                      return (
                        <div className="relative w-4 h-4 shrink-0">
                          <Image
                            src={categoryIcon}
                            alt={button.label}
                            fill
                            className="object-contain"
                            sizes="16px"
                            onError={(e) => {
                              console.error(`Failed to load category icon for ${button.label}:`, categoryIcon)
                              setImageErrors(prev => ({ ...prev, [id]: true }))
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded category icon for ${button.label}:`, categoryIcon)
                            }}
                            unoptimized={true}
                          />
                        </div>
                      )
                    }
                  } else if (Icon) {
                    // Fallback to Lucide icon component
                    return <Icon className="w-4 h-4 shrink-0" />
                  }
                  // If no icon at all, show a placeholder
                  return <div className="w-4 h-4 shrink-0" />
                })()}
                {button.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
