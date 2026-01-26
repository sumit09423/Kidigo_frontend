'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()

  // Demo data for dependents
  const dependents = [
    {
      name: 'Prateik',
      gender: 'M',
      age: 12,
      interests: [
        { name: 'Sports', color: 'bg-blue-500' },
        { name: 'Robotics', color: 'bg-green-500' },
        { name: 'Art', color: 'bg-purple-500' },
        { name: 'Empathy', color: 'bg-red-500' },
        { name: 'Resilience', color: 'bg-orange-500' },
        { name: 'Communication', color: 'bg-purple-400' },
      ]
    },
    {
      name: 'Veda',
      gender: 'F',
      age: 7,
      interests: [
        { name: 'Dance', color: 'bg-red-500' },
        { name: 'Music', color: 'bg-orange-500' },
        { name: 'Science', color: 'bg-blue-500' },
        { name: 'Art', color: 'bg-purple-500' },
        { name: 'Growth Mindset', color: 'bg-teal-400' },
      ]
    }
  ]

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
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Main User Profile Section */}
        <div className="text-center mb-8">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile'}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-3xl text-gray-500">
                    {(user?.name || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Name */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {user?.name || 'User Name'}
          </h2>

          {/* Following Count and Edit Button */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-gray-600">24 Following</span>
            <button className="flex items-center gap-2 px-4 py-2 border border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Dependents Section */}
        <div className="space-y-6">
          {dependents.map((dependent, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              {/* Dependent Header */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {dependent.name} ({dependent.gender}, {dependent.age}yrs)
              </h3>

              {/* Interests Label */}
              <p className="text-sm font-medium text-gray-700 mb-3">Interests</p>

              {/* Interest Tags */}
              <div className="flex flex-wrap gap-2">
                {dependent.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className={`${interest.color} text-white px-4 py-1.5 rounded-full text-sm font-medium`}
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
