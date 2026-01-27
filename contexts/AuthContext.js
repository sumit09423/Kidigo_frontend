'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getAccessToken, removeAccessToken } from '@/API/http/client'
import { logout as apiLogout } from '@/API/auth/auth.client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing user session and token
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kidigo_user')
      const token = getAccessToken()
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Error parsing stored user:', error)
          // Clear corrupted data
          localStorage.removeItem('kidigo_user')
          removeAccessToken()
        }
      } else if (!token) {
        // No token means user is not authenticated, clear user data
        localStorage.removeItem('kidigo_user')
      }
      
      setIsLoading(false)
    }
  }, [])

  const login = (userData, token = null) => {
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('kidigo_user', JSON.stringify(userData))
      // Token is already stored by API client, but we can store it here too if provided
      if (token) {
        // API client handles token storage, but we ensure consistency
        localStorage.setItem('kidigo_token', token)
      }
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kidigo_user')
      // Clear token using API client function
      apiLogout()
    }
  }

  const isAuthenticated = () => {
    return !!user && !!getAccessToken()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
