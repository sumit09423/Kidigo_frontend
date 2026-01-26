'use client'

import { useState, useEffect } from 'react'

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
      <div
        className="overflow-x-auto scrollbar-hide scroll-smooth"
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY
        }}
      >
        <div className="flex gap-2 pb-1">
          {buttonsToRender.map((button, index) => {
            const buttonColor = button.color ?? buttonColors[index % buttonColors.length]
            const Icon = button.icon
            const id = button.id ?? button.label
            const isSelected = selectedButton === id

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
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {button.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
