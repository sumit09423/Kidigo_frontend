'use client'

/**
 * Skeleton loader for event cards
 * Matches the design of MainEventCards component
 */
export default function EventCardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden w-full animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative h-48 sm:h-44 md:h-48 p-2 sm:p-2.5 md:p-3">
            <div className="relative w-full h-full rounded-md sm:rounded-lg bg-gray-200">
              {/* Date Badge Skeleton */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gray-300 rounded-md sm:rounded-lg w-12 h-12 sm:w-14 sm:h-14"></div>
              
              {/* Bookmark Button Skeleton */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-300 rounded-full w-8 h-8 sm:w-10 sm:h-10"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
            
            {/* Location Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
