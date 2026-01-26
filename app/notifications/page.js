'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell } from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Bell Illustration */}
          <div className="relative mb-6">
            <div className="relative">
              <Bell className="w-32 h-32 text-gray-300" />
              {/* Notification Count Badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">0</span>
              </div>
            </div>
          </div>

          {/* Empty State Text */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No Notifications!
          </h2>
          <p className="text-gray-500 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor
          </p>
        </div>
      </div>
    </div>
  )
}
