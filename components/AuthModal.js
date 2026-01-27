'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { handleLogin, handleRegister, handleVerifyOtp, handleResendOtp, handleForgotPassword, handleResetPassword } from '@/API/auth/example-usage'

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const { login } = useAuth()
  const [currentView, setCurrentView] = useState(initialView) // 'login' | 'signup' | 'verification' | 'forgotPassword' | 'resetPassword'
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // Verification form state
  const [verificationData, setVerificationData] = useState({
    code: ''
  })

  // Track email used during signup for verification step
  const [signupEmailForVerification, setSignupEmailForVerification] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  
  // Forgot password form state
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  })
  const [forgotPasswordCooldown, setForgotPasswordCooldown] = useState(0)
  
  // Reset password form state (after receiving code)
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView)
      // Reset all forms
      setLoginData({ email: '', password: '' })
      setSignupData({ fullName: '', email: '', password: '', confirmPassword: '' })
      setVerificationData({ code: '' })
      setForgotPasswordData({ email: '' })
      setResetPasswordData({ email: '', code: '', newPassword: '', confirmPassword: '' })
      setErrors({})
      setResendCooldown(0)
      setForgotPasswordCooldown(0)
    }
  }, [isOpen, initialView])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateLogin = () => {
    const newErrors = {}
    if (!loginData.email) newErrors.email = 'Email is required'
    if (!loginData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    
    setIsLoading(true)
    try {
      await handleLogin(loginData.email, loginData.password, { login })
      onClose()
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: error?.message || 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  // Signup handlers
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateSignup = () => {
    const newErrors = {}

    if (!signupData.fullName) newErrors.fullName = 'Full name is required'

    if (!signupData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!signupData.password) {
      newErrors.password = 'Password is required'
    } else {
      if (signupData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
      // Match backend rule: at least one lowercase, one uppercase, and one number
      const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
      if (!complexityRegex.test(signupData.password)) {
        newErrors.password =
          'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      }
    }

    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    if (!validateSignup()) return
    
    setIsLoading(true)
    try {
      const user = await handleRegister(signupData.email, signupData.password, 'user')
      setSignupEmailForVerification(user?.email || signupData.email)
      setCurrentView('verification')
    } catch (error) {
      console.error('Signup error:', error)

      const fieldErrors = {}

      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          // Support both formats: backend uses 'field' and 'message', some validators use 'path' and 'msg'
          const fieldName = err.field || err.path;
          const errorMessage = err.message || err.msg;
          if (fieldName && errorMessage) {
            fieldErrors[fieldName] = errorMessage
          }
        })
      }

      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        submit: error?.message || 'An error occurred during signup',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Verification handlers
  const handleVerificationChange = (e) => {
    const { name, value } = e.target
    setVerificationData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateVerification = () => {
    const newErrors = {}
    const code = verificationData.code?.trim() || ''

    if (!code) {
      newErrors.code = 'Verification code is required'
    } else {
      if (!/^\d+$/.test(code)) {
        newErrors.code = 'Verification code must contain only digits'
      } else if (code.length !== 6) {
        // Match backend wording
        newErrors.code = 'OTP must be exactly 6 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    if (!validateVerification()) return

    setIsLoading(true)
    try {
      const email = signupEmailForVerification || signupData.email
      await handleVerifyOtp(email, verificationData.code.trim(), (user, token) => {
        // Persist to AuthContext when verification succeeds
        login(user, token)
      })
      onClose()
    } catch (error) {
      console.error('Verification error:', error)

      const fieldErrors = {}

      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          // Support both formats: backend uses 'field' and 'message', some validators use 'path' and 'msg'
          const fieldName = err.field || err.path;
          const errorMessage = err.message || err.msg;
          
          // Map backend 'otp' or 'code' field -> frontend 'code' field
          if ((fieldName === 'otp' || fieldName === 'code') && errorMessage) {
            fieldErrors.code = errorMessage
          } else if (fieldName && errorMessage) {
            fieldErrors[fieldName] = errorMessage
          }
        })
      }

      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        submit: error?.message || 'Invalid verification code',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerificationCode = async () => {
    const email = signupEmailForVerification || signupData.email
    if (!email || resendCooldown > 0 || isLoading) return

    try {
      await handleResendOtp(email, setResendCooldown)
    } catch (error) {
      console.error('Resend OTP error:', error)
      setErrors((prev) => ({
        ...prev,
        submit: error?.message || 'Unable to resend verification code',
      }))
    }
  }

  // Forgot password handlers
  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target
    setForgotPasswordData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForgotPassword = () => {
    const newErrors = {}
    if (!forgotPasswordData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordData.email)) {
      newErrors.email = 'Please provide a valid email address'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validateForgotPassword()) return
    
    setIsLoading(true)
    try {
      await handleForgotPassword(forgotPasswordData.email, setForgotPasswordCooldown)
      // Move to reset password view with email pre-filled
      setResetPasswordData(prev => ({ ...prev, email: forgotPasswordData.email }))
      setCurrentView('resetPassword')
    } catch (error) {
      console.error('Forgot password error:', error)
      
      const fieldErrors = {}
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          const fieldName = err.field || err.path;
          const errorMessage = err.message || err.msg;
          if (fieldName && errorMessage) {
            fieldErrors[fieldName] = errorMessage
          }
        })
      }
      
      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        submit: error?.message || 'Failed to send reset code',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password handlers
  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target
    setResetPasswordData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateResetPassword = () => {
    const newErrors = {}

    if (!resetPasswordData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetPasswordData.email)) {
      newErrors.email = 'Please provide a valid email address'
    }

    const code = resetPasswordData.code?.trim() || ''
    if (!code) {
      newErrors.code = 'Reset code must be exactly 6 digits'
    } else {
      if (!/^\d+$/.test(code)) {
        newErrors.code = 'Reset code must contain only numbers'
      } else if (code.length !== 6) {
        newErrors.code = 'Reset code must be exactly 6 digits'
      }
    }

    if (!resetPasswordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      if (resetPasswordData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters long'
      }
      const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
      if (!complexityRegex.test(resetPasswordData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      }
    }

    if (!resetPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validateResetPassword()) return
    
    setIsLoading(true)
    try {
      await handleResetPassword(
        resetPasswordData.email,
        resetPasswordData.code.trim(),
        resetPasswordData.newPassword
      )
      // Success - redirect to login
      setCurrentView('login')
      setErrors({})
      // Show success message
      setErrors({ submit: 'Password reset successfully! Please login with your new password.' })
    } catch (error) {
      console.error('Reset password error:', error)
      
      const fieldErrors = {}
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          const fieldName = err.field || err.path;
          const errorMessage = err.message || err.msg;
          if (fieldName && errorMessage) {
            fieldErrors[fieldName] = errorMessage
          }
        })
      }
      
      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        submit: error?.message || 'Failed to reset password',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Render Login View
  const renderLoginView = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Sign in</h3>

      {/* Email Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            placeholder="Email"
            className={`w-full pl-12 pr-4 py-3.5 border-2 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.email ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            placeholder="Your password"
            className={`w-full pl-12 pr-12 py-3.5 border-2 ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.password ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 z-10"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 ${
              rememberMe ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                rememberMe ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-sm text-gray-700 whitespace-nowrap">Remember Me</span>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('forgotPassword')}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap"
        >
          Forgot Password?
        </button>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide mb-5"
      >
        {isLoading ? 'Signing in...' : 'SIGN IN'}
        <ArrowRight className="h-5 w-5 bg-white/20 rounded-full p-1" />
      </button>

      {/* OR separator */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-5">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-gray-700 font-medium">Login with Google</span>
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-gray-700 font-medium">Login with Facebook</span>
        </button>
      </div>

      {/* Sign up link */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('signup')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  )

  // Render Signup View
  const renderSignupView = () => (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
      {/* Full Name Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="fullName"
            value={signupData.fullName}
            onChange={handleSignupChange}
            placeholder="Full name"
            className={`w-full pl-12 pr-4 py-3.5 border-2 ${
              errors.fullName ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.fullName ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="name"
          />
        </div>
        {errors.fullName && <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>}
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={signupData.email}
            onChange={handleSignupChange}
            placeholder="Email"
            className={`w-full pl-12 pr-4 py-3.5 border-2 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.email ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={signupData.password}
            onChange={handleSignupChange}
            placeholder="Your password"
            className={`w-full pl-12 pr-12 py-3.5 border-2 ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.password ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 z-10"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Confirm Password Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={signupData.confirmPassword}
            onChange={handleSignupChange}
            placeholder="Confirm password"
            className={`w-full pl-12 pr-12 py-3.5 border-2 ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 z-10"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide mb-5"
      >
        {isLoading ? 'Signing up...' : 'SIGN UP'}
        <ArrowRight className="h-5 w-5 bg-white/20 rounded-full p-1" />
      </button>

      {/* OR separator */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-5">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-gray-700 font-medium">Login with Google</span>
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-gray-700 font-medium">Login with Facebook</span>
        </button>
      </div>

      {/* Sign in link */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )

  // Render Verification View
  const renderVerificationView = () => (
    <form onSubmit={handleVerificationSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Verify Your Account</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter the verification code sent to {signupEmailForVerification || signupData.email}
      </p>

      <div className="mb-4">
        <input
          type="text"
          name="code"
          value={verificationData.code}
          onChange={handleVerificationChange}
          placeholder="Enter verification code"
          maxLength="6"
          className={`w-full px-4 py-3.5 border-2 ${
            errors.code ? 'border-red-300' : 'border-gray-300'
          } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
            errors.code ? 'focus:ring-red-500' : 'focus:ring-purple-500'
          } focus:border-purple-500 transition-all bg-white text-center text-2xl tracking-widest`}
          required
        />
        {errors.code && <p className="mt-1.5 text-sm text-red-600">{errors.code}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide mb-5"
      >
        {isLoading ? 'Verifying...' : 'VERIFY'}
        <ArrowRight className="h-5 w-5 bg-white/20 rounded-full p-1" />
      </button>

      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Didn&apos;t receive code?{' '}
          <button
            type="button"
            onClick={handleResendVerificationCode}
            disabled={resendCooldown > 0 || isLoading}
            className="text-purple-600 hover:text-purple-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
          </button>
        </p>
      </div>
    </form>
  )

  // Render Forgot Password View
  const renderForgotPasswordView = () => (
    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Forgot Password</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your email address and we&apos;ll send you a reset code.
      </p>

      {/* Email Input */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={forgotPasswordData.email}
            onChange={handleForgotPasswordChange}
            placeholder="Email"
            className={`w-full pl-12 pr-4 py-3.5 border-2 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.email ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || forgotPasswordCooldown > 0}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide mb-5"
      >
        {isLoading ? 'Sending...' : forgotPasswordCooldown > 0 ? `Resend in ${forgotPasswordCooldown}s` : 'SEND RESET CODE'}
        <ArrowRight className="h-5 w-5 bg-white/20 rounded-full p-1" />
      </button>

      {/* Back to login */}
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )

  // Render Reset Password View
  const renderResetPasswordView = () => (
    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Reset Password</h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter the reset code sent to {resetPasswordData.email || 'your email'} and your new password.
      </p>

      {/* Email Input (read-only, pre-filled) */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={resetPasswordData.email}
            onChange={handleResetPasswordChange}
            placeholder="Email"
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-lg placeholder-gray-400 text-gray-600 bg-gray-50 cursor-not-allowed"
            readOnly
            autoComplete="email"
          />
        </div>
      </div>

      {/* Reset Code Input */}
      <div className="mb-4">
        <input
          type="text"
          name="code"
          value={resetPasswordData.code}
          onChange={handleResetPasswordChange}
          placeholder="Enter 6-digit reset code"
          maxLength="6"
          className={`w-full px-4 py-3.5 border-2 ${
            errors.code ? 'border-red-300' : 'border-gray-300'
          } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
            errors.code ? 'focus:ring-red-500' : 'focus:ring-purple-500'
          } focus:border-purple-500 transition-all bg-white text-center text-2xl tracking-widest`}
          required
        />
        {errors.code && <p className="mt-1.5 text-sm text-red-600">{errors.code}</p>}
      </div>

      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            value={resetPasswordData.newPassword}
            onChange={handleResetPasswordChange}
            placeholder="New password"
            className={`w-full pl-12 pr-12 py-3.5 border-2 ${
              errors.newPassword ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.newPassword ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 z-10"
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.newPassword && <p className="mt-1.5 text-sm text-red-600">{errors.newPassword}</p>}
      </div>

      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={resetPasswordData.confirmPassword}
            onChange={handleResetPasswordChange}
            placeholder="Confirm password"
            className={`w-full pl-12 pr-12 py-3.5 border-2 ${
              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
            } rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 ${
              errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-purple-500'
            } focus:border-purple-500 transition-all bg-white`}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 z-10"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      {errors.submit && (
        <div className={`p-3 border rounded-lg mb-4 ${
          errors.submit.includes('successfully') 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm ${
            errors.submit.includes('successfully') 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>{errors.submit}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide mb-5"
      >
        {isLoading ? 'Resetting...' : 'RESET PASSWORD'}
        <ArrowRight className="h-5 w-5 bg-white/20 rounded-full p-1" />
      </button>

      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Didn&apos;t receive code?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('forgotPassword')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Resend code
          </button>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  )

  // Get header content based on current view
  const getHeaderContent = () => {
    switch (currentView) {
      case 'login':
        return {
          title: 'Welcome Back',
          subtitle: 'Enter your details below'
        }
      case 'signup':
        return {
          title: 'Sign Up',
          subtitle: 'Enter your details below'
        }
      case 'verification':
        return {
          title: 'Verify Your Account',
          subtitle: 'Enter the verification code'
        }
      case 'forgotPassword':
        return {
          title: 'Forgot Password',
          subtitle: 'Enter your email to receive a reset code'
        }
      case 'resetPassword':
        return {
          title: 'Reset Password',
          subtitle: 'Enter reset code and new password'
        }
      default:
        return {
          title: 'Welcome Back',
          subtitle: 'Enter your details below'
        }
    }
  }

  const headerContent = getHeaderContent()

  return (
    <>
      {/* Glassy blur backdrop */}
      <div
        className="fixed inset-0 z-[100] backdrop-blur-md bg-black/20 transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 md:p-10 pointer-events-auto relative transform transition-all duration-300 ease-out scale-100 opacity-100 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4 mt-2">
            <Image
              src="/assets/logo/logo.png"
              alt="Kidigo Logo"
              width={120}
              height={90}
              className="w-20 h-auto object-contain"
              priority
            />
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{headerContent.title}</h2>
            <p className="text-sm md:text-base text-gray-500">{headerContent.subtitle}</p>
          </div>

          {/* Content with smooth transition */}
          <div className="relative overflow-hidden min-h-[400px]">
            <div 
              key={currentView}
              className="transition-opacity duration-300 ease-in-out m-4  p-4"
            >
              {currentView === 'login' && renderLoginView()}
              {currentView === 'signup' && renderSignupView()}
              {currentView === 'verification' && renderVerificationView()}
              {currentView === 'forgotPassword' && renderForgotPasswordView()}
              {currentView === 'resetPassword' && renderResetPasswordView()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
