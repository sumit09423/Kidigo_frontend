/**
 * Central endpoint definitions for all API routes
 * Update these paths if backend routes change
 */

export const AUTH_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  VERIFY_OTP: '/api/auth/verify-otp',
  LOGIN: '/api/auth/login',
  RESEND_OTP: '/api/auth/resend-otp',
  TEST_EMAIL: '/api/auth/test-email',
};

export const EVENTS_ENDPOINTS = {
  LIST: '/api/events',
  DETAILS: (id) => `/api/events/${id}`,
  CREATE: '/api/events',
  UPDATE: (id) => `/api/events/${id}`,
  DELETE: (id) => `/api/events/${id}`,
};

export const USERS_ENDPOINTS = {
  ME: '/api/users/me',
  PROFILE: '/api/users/profile',
  UPDATE_PROFILE: '/api/users/profile',
};

export const VENDORS_ENDPOINTS = {
  REGISTER: '/api/vendors/register',
  PROFILE: '/api/vendors/profile',
};
