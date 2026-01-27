/**
 * Base HTTP client for API calls
 * Handles:
 * - Base URL configuration (dev/prod)
 * - JWT token attachment
 * - Common error handling
 * - Response parsing
 */

// Get base URL from environment or default to localhost
const getBaseURL = () => {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  }
  // Client-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
};

/**
 * Get JWT token from localStorage
 */
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kidigo_token');
};

/**
 * Store JWT token in localStorage
 */
export const setAccessToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kidigo_token', token);
};

/**
 * Remove JWT token from localStorage
 */
export const removeAccessToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kidigo_token');
};

/**
 * Create headers with authentication token
 */
const createHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Parse error response from API
 */
const parseError = async (response) => {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: response.statusText || 'An error occurred' };
  }

  return {
    status: response.status,
    message: errorData.message || errorData.error || 'An error occurred',
    errors: errorData.errors || null,
    data: errorData,
  };
};

/**
 * Main API client function
 * @param {string} endpoint - API endpoint path (e.g., '/api/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} Parsed response data
 */
export const apiClient = async (endpoint, options = {}) => {
  const baseURL = getBaseURL();
  const url = `${baseURL}${endpoint}`;

  const config = {
    ...options,
    headers: createHeaders(options.headers),
  };

  try {
    const response = await fetch(url, config);

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const error = await parseError(response);
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors or other fetch failures
    if (error.status) {
      // This is an API error we parsed
      throw error;
    }

    // Network error or other fetch failure
    throw {
      status: 0,
      message: error.message || 'Network error. Please check your connection.',
      errors: null,
      data: null,
    };
  }
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiClient(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, body, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (endpoint, body, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (endpoint, options = {}) =>
    apiClient(endpoint, { ...options, method: 'DELETE' }),
};
