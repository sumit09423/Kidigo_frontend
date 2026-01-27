'use client'

/**
 * Skeleton loader for small event cards (sidebar)
 */
export default function SmallEventCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-2 md:space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
        >
          <div className="flex gap-2 md:gap-3 p-2 md:p-3">
            {/* Image Skeleton */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="flex-1 min-w-0">
              {/* Title Skeleton */}
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              
              {/* Date Skeleton */}
              <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
              
              {/* Description Skeleton */}
              <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mt-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
