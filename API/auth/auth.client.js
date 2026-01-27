/**
 * Authentication API Client
 * Functions for all auth-related API calls
 * 
 * See API/AUTH.md for detailed endpoint documentation
 */

import { api } from '../http/client';
import { AUTH_ENDPOINTS } from '../http/endpoints';
import { setAccessToken, removeAccessToken } from '../http/client';

/**
 * Register a new user
 * @param {object} payload - { email, password, role? }
 * @returns {Promise<object>} { status, message, data: { user } }
 */
export async function register(payload) {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER, payload);
  return response;
}

/**
 * Verify OTP sent to user's email
 * @param {object} payload - { email, otp }
 * @returns {Promise<object>} { status, message, data: { token, user } }
 */
export async function verifyOtp(payload) {
  const response = await api.post(AUTH_ENDPOINTS.VERIFY_OTP, payload);
  
  // Store token if verification successful
  if (response.status === 'success' && response.data?.token) {
    setAccessToken(response.data.token);
  }
  
  return response;
}

/**
 * Login user or vendor
 * @param {object} payload - { email, password }
 * @returns {Promise<object>} { status, message, data: { token, user } }
 */
export async function login(payload) {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, payload);
  
  // Store token if login successful
  if (response.status === 'success' && response.data?.token) {
    setAccessToken(response.data.token);
  }
  
  return response;
}

/**
 * Resend OTP to user's email
 * @param {object} payload - { email }
 * @returns {Promise<object>} { status, message }
 */
export async function resendOtp(payload) {
  const response = await api.post(AUTH_ENDPOINTS.RESEND_OTP, payload);
  return response;
}

/**
 * Logout user (clears token from storage)
 * Note: Backend doesn't have a logout endpoint since JWT is stateless
 * This just clears the token from localStorage
 */
export function logout() {
  removeAccessToken();
}

/**
 * Test email configuration (debug endpoint)
 * @returns {Promise<object>} { status, message, data }
 */
export async function testEmail() {
  const response = await api.get(AUTH_ENDPOINTS.TEST_EMAIL);
  return response;
}
