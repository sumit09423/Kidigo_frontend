/**
 * Example usage of Auth API Client
 * 
 * This file demonstrates how to use the auth API functions in your components.
 * Copy and adapt these patterns to your actual components.
 */

import { register, login, verifyOtp, resendOtp, logout, forgotPassword, resetPassword, getUserDetails } from './auth.client';
import { withToast } from '../http/withToast';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// Example 1: Register with toast notifications
// ============================================
export async function handleRegister(email, password, role = 'user') {
  try {
    const response = await withToast(
      register({ email, password, role }),
      {
        loading: 'Creating your account...',
        success: 'Account created! Please check your email for verification code.',
        error: 'Registration failed. Please try again.',
      }
    );

    // Response structure:
    // {
    //   status: 'success',
    //   message: 'User registered successfully...',
    //   data: { user: { id, email, role, isVerified: false, ... } }
    // }

    return response.data.user;
  } catch (error) {
    // Handle validation errors
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`Validation error: ${err.path} - ${err.msg}`);
      });
    }
    throw error;
  }
}

// ============================================
// Example 2: Verify OTP and auto-login
// ============================================
export async function handleVerifyOtp(email, otp, onSuccess) {
  try {
    const response = await withToast(
      verifyOtp({ email, otp }),
      {
        loading: 'Verifying code...',
        success: 'Email verified! Welcome!',
        error: 'Invalid or expired code. Please try again.',
      }
    );

    // Token is automatically stored by verifyOtp function
    // Response structure:
    // {
    //   status: 'success',
    //   message: 'Email verified successfully...',
    //   data: {
    //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    //     user: { id, email, role, isVerified: true, ... }
    //   }
    // }

    // Update AuthContext
    if (onSuccess) {
      onSuccess(response.data.user, response.data.token);
    }

    return response.data;
  } catch (error) {
    if (error.status === 400) {
      // OTP expired or invalid
      console.error('OTP Error:', error.message);
    }
    throw error;
  }
}

// ============================================
// Example 3: Login with AuthContext integration
// ============================================
export async function handleLogin(email, password, authContext) {
  try {
    const response = await withToast(
      login({ email, password }),
      {
        loading: 'Logging in...',
        success: 'Welcome back!',
        error: 'Invalid email or password.',
      }
    );

    // Token is automatically stored by login function
    // Response structure:
    // {
    //   status: 'success',
    //   message: 'Login successful',
    //   data: {
    //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    //     user: { id, email, role, isVerified: true, ... }
    //   }
    // }

    // Update AuthContext
    if (authContext) {
      authContext.login(response.data.user, response.data.token);
    }

    return response.data;
  } catch (error) {
    if (error.status === 401) {
      // Invalid credentials or email not verified
      console.error('Login Error:', error.message);
    }
    throw error;
  }
}

// ============================================
// Example 4: Resend OTP with cooldown handling
// ============================================
export async function handleResendOtp(email, setCooldown) {
  try {
    const response = await withToast(
      resendOtp({ email }),
      {
        loading: 'Sending verification code...',
        success: 'Verification code sent! Please check your email.',
        error: 'Failed to send code. Please try again.',
      }
    );

    // Start 60-second cooldown
    if (setCooldown) {
      let seconds = 60;
      setCooldown(seconds);
      const interval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
          setCooldown(seconds);
        } else {
          setCooldown(0);
          clearInterval(interval);
        }
      }, 1000);
    }

    return response;
  } catch (error) {
    if (error.status === 429) {
      // Too many requests - cooldown active
      console.error('Cooldown active:', error.message);
    } else if (error.status === 400) {
      // User already verified
      console.error('User already verified');
    }
    throw error;
  }
}

// ============================================
// Example 5: Logout
// ============================================
export function handleLogout(authContext) {
  // Clear token and user data
  logout();
  
  // Update AuthContext
  if (authContext) {
    authContext.logout();
  }
}

// ============================================
// Example 6: React Component Usage
// ============================================
/*
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { handleLogin, handleRegister, handleVerifyOtp } from '@/API/auth/example-usage';

export default function LoginComponent() {
  const { login, logout, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(email, password, { login });
      // User is now logged in, redirect or update UI
    } catch (error) {
      // Error is already shown via toast
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
*/

// ============================================
// Example 7: Forgot Password
// ============================================
export async function handleForgotPassword(email, setCooldown) {
  try {
    const response = await withToast(
      forgotPassword({ email }),
      {
        loading: 'Sending reset code...',
        success: 'If the email exists, a reset code has been sent.',
        error: 'Failed to send reset code. Please try again.',
      }
    );

    // Start 60-second cooldown
    if (setCooldown) {
      let seconds = 60;
      setCooldown(seconds);
      const interval = setInterval(() => {
        seconds--;
        if (seconds > 0) {
          setCooldown(seconds);
        } else {
          setCooldown(0);
          clearInterval(interval);
        }
      }, 1000);
    }

    return response;
  } catch (error) {
    if (error.status === 429) {
      // Too many requests - cooldown active
      console.error('Cooldown active:', error.message);
    } else if (error.status === 400) {
      // Validation error
      console.error('Validation error:', error.message);
    }
    throw error;
  }
}

// ============================================
// Example 8: Reset Password
// ============================================
export async function handleResetPassword(email, code, newPassword) {
  try {
    const response = await withToast(
      resetPassword({ email, code, newPassword }),
      {
        loading: 'Resetting password...',
        success: 'Password reset successfully! You can now login with your new password.',
        error: 'Failed to reset password. Please check your code and try again.',
      }
    );

    return response;
  } catch (error) {
    if (error.status === 400) {
      // Invalid code, expired code, or validation error
      if (error.errors) {
        error.errors.forEach(err => {
          console.error(`Validation error: ${err.field} - ${err.message}`);
        });
      } else {
        console.error('Reset error:', error.message);
      }
    }
    throw error;
  }
}

// ============================================
// Example 9: Get User Details (Profile Page)
// ============================================
export async function handleGetUserDetails(authContext) {
  try {
    const response = await getUserDetails();
    
    if (response.status === 'success' && response.data?.user) {
      const userData = response.data.user;
      
      // Update AuthContext with latest user data
      if (authContext && authContext.login) {
        authContext.login(userData);
      }
      
      return userData;
    }
    
    throw new Error('Failed to fetch user details');
  } catch (error) {
    if (error.status === 401) {
      // Token expired or invalid - user needs to login again
      console.error('Authentication error:', error.message);
      if (authContext && authContext.logout) {
        authContext.logout();
      }
    }
    throw error;
  }
}
