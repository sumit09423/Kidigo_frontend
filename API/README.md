# API Client Documentation

This folder contains the API client implementation for the Kidigo frontend application.

## Structure

```
API/
├── README.md                 # This file
├── AUTH.md                   # Auth API documentation (endpoints, flows)
├── auth/
│   └── auth.client.js        # Auth API functions
└── http/
    ├── client.js             # Base HTTP client (fetch wrapper)
    ├── endpoints.js          # Central endpoint definitions
    └── withToast.js          # Toast notification utilities
```

## Quick Start

### 1. Import API functions

```javascript
import { register, login, verifyOtp, resendOtp } from '@/API/auth/auth.client';
```

### 2. Make API calls

```javascript
// Register
const response = await register({
  email: 'user@example.com',
  password: 'Password123',
  role: 'user' // optional
});

// Verify OTP
const verifyResponse = await verifyOtp({
  email: 'user@example.com',
  otp: '123456'
});

// Login
const loginResponse = await login({
  email: 'user@example.com',
  password: 'Password123'
});

// Token is automatically stored in localStorage after login/verifyOtp
```

### 3. Use with toast notifications (optional)

```javascript
import { withToast } from '@/API/http/withToast';
import { login } from '@/API/auth/auth.client';

await withToast(
  login({ email, password }),
  {
    loading: 'Logging in...',
    success: 'Welcome back!',
    error: 'Login failed. Please try again.'
  }
);
```

## Configuration

### Environment Variables

Set the API base URL in your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

For production:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.kidigo.com
```

### Default Base URL

If `NEXT_PUBLIC_API_BASE_URL` is not set, defaults to `http://localhost:5000`.

## Token Management

The API client automatically:
- **Stores** JWT tokens in `localStorage` after successful login/verifyOtp
- **Attaches** tokens to all API requests via `Authorization: Bearer <token>` header
- **Removes** tokens when you call `logout()`

### Manual Token Management

```javascript
import { getAccessToken, setAccessToken, removeAccessToken } from '@/API/http/client';

// Get token
const token = getAccessToken();

// Set token manually
setAccessToken('your-token-here');

// Remove token
removeAccessToken();
```

## Error Handling

All API functions throw errors with this structure:

```javascript
{
  status: 400,              // HTTP status code
  message: "Error message",  // User-friendly message
  errors: [...],            // Validation errors (if any)
  data: {...}               // Full error response
}
```

### Example Error Handling

```javascript
try {
  await login({ email, password });
} catch (error) {
  if (error.status === 401) {
    // Invalid credentials
    console.error('Login failed:', error.message);
  } else if (error.status === 400 && error.errors) {
    // Validation errors
    error.errors.forEach(err => {
      console.error(`${err.path}: ${err.msg}`);
    });
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

## Available Functions

### Auth (`API/auth/auth.client.js`)

- `register(payload)` - Register new user
- `verifyOtp(payload)` - Verify email OTP
- `login(payload)` - Login user/vendor
- `resendOtp(payload)` - Resend OTP email
- `logout()` - Clear token (no API call)
- `testEmail()` - Test email config (debug)

See `API/AUTH.md` for detailed endpoint documentation.

## Adding New API Modules

1. **Create endpoint definitions** in `API/http/endpoints.js`:
   ```javascript
   export const NEW_MODULE_ENDPOINTS = {
     LIST: '/api/new-module',
     DETAILS: (id) => `/api/new-module/${id}`,
   };
   ```

2. **Create client file** `API/new-module/new-module.client.js`:
   ```javascript
   import { api } from '../http/client';
   import { NEW_MODULE_ENDPOINTS } from '../http/endpoints';

   export async function getList() {
     return await api.get(NEW_MODULE_ENDPOINTS.LIST);
   }
   ```

3. **Use in components**:
   ```javascript
   import { getList } from '@/API/new-module/new-module.client';
   ```

## Toast Notifications

The `withToast` utility provides a simple way to add loading/success/error notifications.

**Current implementation**: Uses `console.log` (for development)

**To use a real toast library** (e.g., react-hot-toast):

1. Install: `npm install react-hot-toast`
2. Update `API/http/withToast.js` to use the library
3. Add `<Toaster />` component to your layout

Example with react-hot-toast:
```javascript
import toast from 'react-hot-toast';

export async function withToast(promise, messages) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: (err) => err?.message || messages.error,
  });
}
```

## TypeScript Support (Future)

If migrating to TypeScript, add type definitions:

```typescript
// API/types/api.d.ts
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string;
  msg: string;
}
```
