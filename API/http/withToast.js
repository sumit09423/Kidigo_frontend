/**
 * Toast notification wrapper for API calls
 * 
 * This utility wraps API calls with toast notifications for loading, success, and error states.
 * 
 * Usage:
 *   import { withToast } from '@/API/http/withToast';
 *   import { login } from '@/API/auth/auth.client';
 * 
 *   await withToast(
 *     login({ email, password }),
 *     {
 *       loading: 'Logging in...',
 *       success: 'Welcome back!',
 *       error: 'Login failed'
 *     }
 *   );
 * 
 * Note: You'll need to install a toast library like react-hot-toast or react-toastify
 * and create a toast utility that matches this interface.
 */

/**
 * Simple toast implementation using console for now
 * Replace this with actual toast library (react-hot-toast, react-toastify, etc.)
 */
const toast = {
  loading: (message) => {
    console.log(`⏳ ${message}`);
    return message; // Return ID for consistency
  },
  success: (message) => {
    console.log(`✅ ${message}`);
    return message;
  },
  error: (message) => {
    console.error(`❌ ${message}`);
    return message;
  },
  dismiss: (id) => {
    // No-op for console implementation
  },
};

/**
 * Wrapper function that adds toast notifications to API calls
 * @param {Promise} promise - The API call promise
 * @param {object} messages - Toast messages { loading, success, error }
 * @returns {Promise} The original promise
 */
export async function withToast(promise, messages = {}) {
  const {
    loading = 'Loading...',
    success = 'Success!',
    error = 'An error occurred',
  } = messages;

  const loadingId = toast.loading(loading);

  try {
    const result = await promise;
    
    // Check if response indicates success
    if (result?.status === 'success') {
      toast.dismiss(loadingId);
      toast.success(success || result?.message || 'Success!');
    } else {
      // API returned but status is not success
      toast.dismiss(loadingId);
      const errorMsg = result?.message || error;
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    return result;
  } catch (err) {
    toast.dismiss(loadingId);
    
    // Extract error message from API error object
    const errorMsg = err?.message || error;
    toast.error(errorMsg);
    
    throw err;
  }
}

/**
 * Toast promise helper (alternative API)
 * Similar to react-hot-toast's toast.promise
 */
export const toastPromise = (promise, messages) => {
  return withToast(promise, messages);
};

// Export toast instance for direct use if needed
export { toast };
