'use client'

import { useState } from 'react'

// Color palette for buttons - all work well with white text
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
  className = ''
}) {
  const [selectedButton, setSelectedButton] = useState(defaultSelected)

  const handleClick = (button) => {
    setSelectedButton(button.id || button.label)
    if (onButtonClick) {
      onButtonClick(button)
    }
  }

  // Default buttons if none provided
  const defaultButtons = [
    { id: 'all', label: 'All' },
    { id: 'category1', label: 'Category 1' },
    { id: 'category2', label: 'Category 2' },
    { id: 'category3', label: 'Category 3' },
    { id: 'category4', label: 'Category 4' },
  ]

  const buttonsToRender = buttons.length > 0 ? buttons : defaultButtons

  return (
    <div className={`w-full relative ${className}`}>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-2">
          {buttonsToRender.map((button, index) => {
            const buttonColor = button.color || buttonColors[index % buttonColors.length]
            
            return (
              <button
                key={button.id || button.label}
                onClick={() => handleClick(button)}
                style={{
                  backgroundColor: buttonColor,
                  borderRadius: '20.9626px',
                }}
                className={`
                  flex-shrink-0 px-4 py-2 mx-1
                  font-medium text-sm transition-all duration-200
                  whitespace-nowrap text-white
                  hover:opacity-90
                `}
              >
                {button.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
