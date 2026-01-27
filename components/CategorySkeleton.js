'use client'

/**
 * Skeleton loader for category buttons
 * Shows 5 skeleton buttons matching HorizontalScrollButtons design
 * Widths match typical category button sizes (including icon + text)
 */
export default function CategorySkeleton({ count = 5 }) {
  // Fixed widths that match actual category button sizes (icon + padding + text)
  // These widths represent common category names like "All Events", "Music", "Sports", etc.
  const skeletonWidths = [
    110, // "All Events" with icon
    95,  // "Music" with icon
    100, // "Sports" with icon
    90,  // "Arts" with icon
    105, // "Theater" with icon
  ]

  return (
    <div className="w-full relative">
      <div className="overflow-x-auto scrollbar-hide scroll-smooth">
        <div className="flex gap-2 pb-1">
          {Array.from({ length: count }).map((_, index) => {
            const width = skeletonWidths[index % skeletonWidths.length]
            return (
              <div
                key={index}
                className="flex-shrink-0 px-4 py-2 rounded-[20.9626px] bg-gray-200 animate-pulse flex items-center gap-2"
                style={{
                  width: `${width}px`,
                  height: '36px'
                }}
              >
                {/* Icon skeleton */}
                <div className="w-4 h-4 bg-gray-300 rounded shrink-0" />
                {/* Text skeleton */}
                <div className="h-4 bg-gray-300 rounded flex-1" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
