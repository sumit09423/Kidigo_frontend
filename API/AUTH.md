# Kidigo Auth API – Flow & Reference

**For Frontend Developers**

This document describes the **Authentication API** flow, endpoints, request/response formats, and how to use the JWT for protected routes.

---

## Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:5000` |
| Production  | `https://api.kidigo.com` |

All Auth endpoints live under **`/api/auth`**.

---

## High-Level Flow

```
┌─────────────┐     Register      ┌─────────────┐     OTP Email      ┌─────────────┐
│   Sign Up   │ ───────────────►  │  Unverified │ ◄────────────────  │   Inbox     │
│  (email,    │   POST /register  │    User     │                    │             │
│  password)  │                   └──────┬──────┘                    └─────────────┘
└─────────────┘                          │                                    │
                                         │ Verify OTP                         │
                                         │ POST /verify-otp                   │
                                         ▼                                    │
┌─────────────┐     Login         ┌─────────────┐     Resend OTP      ┌───────┐
│   Sign In   │ ◄───────────────  │  Verified   │ ─────────────────►  │ Inbox │
│ (email,     │   POST /login     │ User/Vendor │  POST /resend-otp   └───────┘
│  password)  │                   └─────────────┘       (if needed)
└─────────────┘
        │
        │  Response includes JWT
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Use JWT in header for protected routes:  Authorization: Bearer <token>      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sequence Overview

1. **Register** → User signs up with email, password (and optional role). Account is **unverified**. OTP is sent to email.
2. **Verify OTP** → User submits email + 6-digit OTP. Account becomes **verified**. API returns **JWT** + user.
3. **Login** → User (or Vendor) signs in with email + password. Only **verified** users can log in. API returns **JWT** + user.
4. **Resend OTP** → If user didn’t receive OTP or it expired, they request a new one. **60-second cooldown** between requests.

**Login** supports both **Users** (from `/api/auth/register`) and **Vendors** (from `/api/vendors/register`). Same endpoint; backend resolves identity.

---

## Using the JWT (Protected Routes)

After **Login** or **Verify OTP**, the client receives a `token`. Send it on every request to protected routes:

```http
Authorization: Bearer <your-jwt-token>
```

**Example**

```http
GET /api/users/me HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

- **Missing token** → `401` – `Access denied. No token provided.`
- **Invalid/expired token** → `401` – e.g. `Invalid token. Please login again.` / `Token has expired. Please login again.`
- **Valid token** → Request proceeds; `req.user` is populated (e.g. `id`, `email`, `role`, `isVendor`).

JWT expiry is configured via `JWT_EXPIRE` (e.g. `7d`). When the token expires, the user must **login** again (or **verify-otp** if still in verification flow).

---

## Standard Response Shapes

### Success

```json
{
  "status": "success",
  "message": "<human-readable message>",
  "data": { ... }
}
```

`data` is omitted when there’s nothing to return (e.g. resend-otp success).

### Error

```json
{
  "status": "error",
  "message": "<human-readable message>"
}
```

### Validation Error (400)

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "msg": "<message>", "path": "<field>", ... }
  ]
}
```

`errors` is the raw array from validation; typically `path` (or `param`) and `msg` are useful for UI.

---

## Validation Rules (Auth)

| Field     | Rules |
|----------|--------|
| **email** | Valid email, normalized to lowercase |
| **password** | Required, min 6 chars, at least one lowercase, one uppercase, one number |
| **role**  | Optional; one of `user`, `admin`, `vendor`. Default `user` |
| **otp**   | Exactly 6 digits |

---

## Endpoints

### 1. Register

Create a new **user** account. User is **unverified** until OTP is verified. OTP is sent by email (async; registration succeeds even if email fails).

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/auth/register` | No |

**Request body**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "role": "user"
}
```

- `email`: required, valid email  
- `password`: required, min 6 chars, 1 lowercase, 1 uppercase, 1 number  
- `role`: optional, `user` | `admin` | `vendor`, default `user`

**Success response** `201 Created`

```json
{
  "status": "success",
  "message": "User registered successfully. Please check your email for verification code.",
  "data": {
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "email": "user@example.com",
      "role": "user",
      "isVerified": false,
      "createdAt": "2023-07-20T10:30:00.000Z"
    }
  }
}
```

**Error responses**

| Status | Meaning |
|--------|---------|
| `400` | Validation failed (invalid email, weak password, etc.) |
| `409` | User with this email already exists |
| `500` | Internal server error |

---

### 2. Verify OTP

Verify the 6-digit OTP sent to the user’s email. Marks user as **verified** and returns a **JWT**. Store the token and use it for subsequent authenticated requests.

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/auth/verify-otp` | No |

**Request body**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

- `email`: required, same as used in register  
- `otp`: required, exactly 6 digits

**Success response** `200 OK`

```json
{
  "status": "success",
  "message": "Email verified successfully. Welcome!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "email": "user@example.com",
      "role": "user",
      "isVerified": true,
      "verifiedAt": "2023-07-20T10:35:00.000Z"
    }
  }
}
```

**Error responses**

| Status | Message (examples) |
|--------|--------------------|
| `400` | Invalid OTP / OTP expired / No OTP found / User already verified / Invalid format |
| `404` | User not found |
| `500` | Internal server error |

- **OTP expiry**: 10 minutes. If expired, use **Resend OTP** and then verify again.

---

### 3. Login

Authenticate **User** or **Vendor** with email + password. Only **verified** accounts can log in. Returns **JWT** and user (or vendor) info.

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/auth/login` | No |

**Request body**

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Success response** `200 OK` (user)

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "email": "user@example.com",
      "role": "user",
      "isVerified": true,
      "createdAt": "2023-07-20T10:30:00.000Z",
      "updatedAt": "2023-07-20T10:35:00.000Z",
      "lastLogin": "2023-07-20T12:00:00.000Z"
    }
  }
}
```

**Success response** `200 OK` (vendor)  
Same as above, with extra vendor fields:

```json
{
  "data": {
    "token": "...",
    "user": {
      "id": "...",
      "email": "vendor@example.com",
      "role": "vendor",
      "isVerified": true,
      "vendorName": "Acme Events",
      "businessName": "Acme Kids Events Ltd",
      "businessPhone": "+919876543210",
      "isActive": true,
      "isApproved": true,
      "createdAt": "...",
      "updatedAt": "...",
      "lastLogin": "..."
    }
  }
}
```

**Error responses**

| Status | Meaning |
|--------|---------|
| `400` | Validation failed |
| `401` | Invalid email or password / Email not verified |
| `500` | Internal server error |

- Vendors must be **verified** and **active**. If deactivated, a dedicated message is returned (e.g. account deactivated).

---

### 4. Resend OTP

Request a new OTP for an **unverified** user. Sends a new 6-digit code to the user’s email. **60-second cooldown** between resend requests.

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/auth/resend-otp` | No |

**Request body**

```json
{
  "email": "user@example.com"
}
```

**Success response** `200 OK`

```json
{
  "status": "success",
  "message": "Verification code sent successfully. Please check your email."
}
```

**Error responses**

| Status | Meaning |
|--------|---------|
| `400` | User already verified |
| `404` | User not found |
| `429` | Too many requests – e.g. “Please wait X seconds before requesting a new verification code” |
| `500` | Internal server error / Email send failed |

---

### 5. Test Email (Optional / Debug)

Checks email configuration (e.g. SMTP). Useful for debugging only; not needed for normal auth flow.

| Method | Path | Auth |
|--------|------|------|
| `GET` | `/api/auth/test-email` | No |

**Success response** `200 OK`

```json
{
  "status": "success",
  "message": "Email configuration test completed",
  "data": {
    "success": true,
    "message": "Email configuration is valid",
    "duration": 1250,
    "timestamp": "2023-07-20T10:30:00.000Z"
  }
}
```

---

## Flow Summary for FE

| Step | Action | Endpoint | Store / Use |
|------|--------|----------|-------------|
| 1 | Sign up | `POST /api/auth/register` | Show “Check email for OTP” |
| 2 | Enter OTP | `POST /api/auth/verify-otp` | Store `data.token` and `data.user`; use token in `Authorization` |
| 2b | No OTP / expired? | `POST /api/auth/resend-otp` | Respect 60s cooldown; then retry verify |
| 3 | Sign in | `POST /api/auth/login` | Store `data.token` and `data.user`; use token in `Authorization` |
| 4 | Call APIs | Any protected route | `Authorization: Bearer <token>` |

---

## Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | `POST` | Create user, send OTP |
| `/api/auth/verify-otp` | `POST` | Verify OTP, get JWT |
| `/api/auth/login` | `POST` | Login (user/vendor), get JWT |
| `/api/auth/resend-otp` | `POST` | Resend OTP (60s cooldown) |
| `/api/auth/test-email` | `GET` | Test email config (debug) |

- **Content-Type**: `application/json` for all `POST` bodies.  
- **Base path**: `/api`; auth under `/api/auth`.  
- **JWT**: Send as `Authorization: Bearer <token>` on protected routes.

---

## Mermaid Diagram (Auth Flow)

```mermaid
sequenceDiagram
    participant User
    participant AuthController
    participant AuthService
    participant UserModel
    participant EmailService
    participant Database

    Note over User,Database: Registration Flow
    User->>AuthController: POST /api/auth/register
    AuthController->>AuthService: registerUser(email, password)
    AuthService->>UserModel: Check if user exists
    UserModel->>Database: Query by email
    Database-->>UserModel: User not found
    AuthService->>UserModel: Create user (hash password)
    UserModel->>Database: Save user
    Database-->>UserModel: User created
    AuthService->>EmailService: Generate & send OTP
    EmailService->>User: Send OTP email
    AuthService-->>AuthController: User registered
    AuthController-->>User: Success response

    Note over User,Database: OTP Verification Flow
    User->>AuthController: POST /api/auth/verify-otp
    AuthController->>AuthService: verifyOTP(email, otp)
    AuthService->>UserModel: Find user with OTP
    UserModel->>Database: Query user
    Database-->>UserModel: User found
    AuthService->>UserModel: Compare OTP
    UserModel-->>AuthService: OTP valid
    AuthService->>UserModel: Update isVerified = true
    UserModel->>Database: Update user
    AuthService->>AuthService: Generate JWT token
    AuthService-->>AuthController: Token + user data
    AuthController-->>User: JWT token

    Note over User,Database: Login Flow
    User->>AuthController: POST /api/auth/login
    AuthController->>AuthService: loginUser(email, password)
    AuthService->>UserModel: Find user with password
    UserModel->>Database: Query user
    Database-->>UserModel: User found
    AuthService->>UserModel: Compare password
    UserModel-->>AuthService: Password valid
    AuthService->>AuthService: Generate JWT token
    AuthService-->>AuthController: Token + user data
    AuthController-->>User: JWT token
```

---

*Last updated: Jan 2025. For backend implementation details, see `src/routes/authRoutes.js`, `src/controllers/auth/authController.js`, and `src/services/authService.js`.*
