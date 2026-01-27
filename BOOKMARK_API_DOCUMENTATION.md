# Bookmark API Documentation

This document provides comprehensive documentation for all Bookmark API endpoints, including validation rules, request/response examples, and error handling.

## Base URL
```
/api/users/me/bookmarks
```

## Authentication

All bookmark endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get User's Saved Events (Bookmarks)
**GET** `/api/users/me/bookmarks`

Retrieve all saved events (bookmarks) for the authenticated user.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Request Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Saved events retrieved successfully",
  "data": {
    "savedEvents": [
      {
        "id": "507f1f77bcf86cd799439013",
        "eventTitle": "Summer Art Workshop",
        "category": {
          "id": "507f1f77bcf86cd799439011",
          "name": "Arts & Crafts"
        },
        "organizer": {
          "id": "507f1f77bcf86cd799439014",
          "name": "Art Studio Inc."
        },
        "eventDate": "2026-07-15T10:00:00.000Z",
        "locationLink": "https://maps.google.com/...",
        "imageLink": "https://example.com/image.jpg",
        "city": {
          "id": "507f1f77bcf86cd799439012",
          "name": "New York"
        },
        "tags": ["art", "workshop", "summer"],
        "ageGroup": {
          "minAge": 5,
          "maxAge": 12
        },
        "capacity": 50,
        "ticketLimit": 40,
        "sold": 15,
        "availableTickets": 25,
        "description": "A fun summer art workshop for kids",
        "price": 25.99,
        "isActive": true,
        "isPublished": true,
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439015",
        "eventTitle": "Science Fair 2026",
        "category": {
          "id": "507f1f77bcf86cd799439016",
          "name": "Science & Technology"
        },
        "organizer": {
          "id": "507f1f77bcf86cd799439017",
          "name": "Science Center"
        },
        "eventDate": "2026-08-20T14:00:00.000Z",
        "locationLink": "https://maps.google.com/...",
        "imageLink": "https://example.com/science.jpg",
        "city": {
          "id": "507f1f77bcf86cd799439012",
          "name": "New York"
        },
        "tags": ["science", "education", "fair"],
        "ageGroup": {
          "minAge": 8,
          "maxAge": 15
        },
        "capacity": 100,
        "ticketLimit": 80,
        "sold": 45,
        "availableTickets": 35,
        "description": "Annual science fair showcasing student projects",
        "price": 15.00,
        "isActive": true,
        "isPublished": true,
        "createdAt": "2026-01-25T09:00:00.000Z",
        "updatedAt": "2026-01-26T11:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

#### Empty Response (200 OK - No Bookmarks)
```json
{
  "status": "success",
  "message": "Saved events retrieved successfully",
  "data": {
    "savedEvents": [],
    "count": 0
  }
}
```

#### Error Responses

**401 Unauthorized - Missing Token**
```json
{
  "status": "error",
  "message": "Unauthorized - Invalid or missing token"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "status": "error",
  "message": "Unauthorized - Invalid or missing token"
}
```

**404 Not Found - User Not Found**
```json
{
  "status": "error",
  "message": "User not found"
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 2. Add Event to Bookmarks
**POST** `/api/users/me/bookmarks/:eventId`

Add an event to the authenticated user's saved events (bookmarks).

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `eventId` | string | Yes | - Valid MongoDB ObjectId format (24-character hexadecimal string)<br>- Event must exist<br>- Event must be active |

#### Request Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Request Example
```
POST /api/users/me/bookmarks/507f1f77bcf86cd799439013
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Event bookmarked successfully",
  "data": {
    "savedEventsCount": 3
  }
}
```

#### Error Responses

**400 Bad Request - Missing Event ID**
```json
{
  "status": "error",
  "message": "Event ID is required"
}
```

**400 Bad Request - Invalid Event ID Format**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "eventId",
      "message": "Invalid event ID format",
      "location": "params"
    }
  ]
}
```

**401 Unauthorized - Missing or Invalid Token**
```json
{
  "status": "error",
  "message": "Unauthorized - Invalid or missing token"
}
```

**404 Not Found - Event Not Found**
```json
{
  "status": "error",
  "message": "Event not found"
}
```

**404 Not Found - User Not Found**
```json
{
  "status": "error",
  "message": "User not found"
}
```

**409 Conflict - Event Already Bookmarked**
```json
{
  "status": "error",
  "message": "Event already bookmarked"
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 3. Remove Event from Bookmarks
**DELETE** `/api/users/me/bookmarks/:eventId`

Remove an event from the authenticated user's saved events (bookmarks).

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `eventId` | string | Yes | - Valid MongoDB ObjectId format (24-character hexadecimal string) |

#### Request Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Request Example
```
DELETE /api/users/me/bookmarks/507f1f77bcf86cd799439013
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Bookmark removed successfully",
  "data": {
    "savedEventsCount": 2
  }
}
```

#### Error Responses

**400 Bad Request - Missing Event ID**
```json
{
  "status": "error",
  "message": "Event ID is required"
}
```

**400 Bad Request - Invalid Event ID Format**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "eventId",
      "message": "Invalid event ID format",
      "location": "params"
    }
  ]
}
```

**400 Bad Request - Event Not Bookmarked**
```json
{
  "status": "error",
  "message": "Event is not bookmarked"
}
```

**401 Unauthorized - Missing or Invalid Token**
```json
{
  "status": "error",
  "message": "Unauthorized - Invalid or missing token"
}
```

**404 Not Found - User Not Found**
```json
{
  "status": "error",
  "message": "User not found"
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 4. Get User Profile with Saved Events
**GET** `/api/auth/me`

Get authenticated user's profile including saved events. This endpoint has been updated to include saved events in the response.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Request Headers
```
Authorization: Bearer <your_jwt_token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "User details retrieved successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439010",
      "email": "user@example.com",
      "role": "user",
      "isVerified": true,
      "profileImage": "https://example.com/profile.jpg",
      "savedEvents": [
        {
          "id": "507f1f77bcf86cd799439013",
          "eventTitle": "Summer Art Workshop",
          "category": {
            "id": "507f1f77bcf86cd799439011",
            "name": "Arts & Crafts"
          },
          "organizer": {
            "id": "507f1f77bcf86cd799439014",
            "name": "Art Studio Inc."
          },
          "eventDate": "2026-07-15T10:00:00.000Z",
          "locationLink": "https://maps.google.com/...",
          "imageLink": "https://example.com/image.jpg",
          "city": {
            "id": "507f1f77bcf86cd799439012",
            "name": "New York"
          },
          "tags": ["art", "workshop", "summer"],
          "ageGroup": {
            "minAge": 5,
            "maxAge": 12
          },
          "capacity": 50,
          "ticketLimit": 40,
          "sold": 15,
          "availableTickets": 25,
          "description": "A fun summer art workshop for kids",
          "price": 25.99,
          "isActive": true,
          "isPublished": true,
          "createdAt": "2026-01-27T10:00:00.000Z",
          "updatedAt": "2026-01-27T10:00:00.000Z"
        }
      ],
      "savedEventsCount": 1,
      "createdAt": "2026-01-20T08:00:00.000Z",
      "updatedAt": "2026-01-27T10:00:00.000Z"
    }
  }
}
```

#### Success Response - No Saved Events (200 OK)
```json
{
  "status": "success",
  "message": "User details retrieved successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439010",
      "email": "user@example.com",
      "role": "user",
      "isVerified": true,
      "profileImage": null,
      "savedEvents": [],
      "savedEventsCount": 0,
      "createdAt": "2026-01-20T08:00:00.000Z",
      "updatedAt": "2026-01-27T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

**401 Unauthorized - Missing or Invalid Token**
```json
{
  "status": "error",
  "message": "Unauthorized - Invalid or missing token"
}
```

**404 Not Found - User Not Found**
```json
{
  "status": "error",
  "message": "User not found"
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## Response Structure

### Success Response Format
All successful responses follow this structure:
```json
{
  "status": "success",
  "message": "<success_message>",
  "data": {
    // Response-specific data
  }
}
```

### Error Response Format
All error responses follow this structure:
```json
{
  "status": "error",
  "message": "<error_message>",
  "errors": [  // Optional - only for validation errors
    {
      "field": "<field_name>",
      "message": "<error_message>",
      "location": "<params|body|query>"
    }
  ]
}
```

## Notes for Frontend Developers

### Important Points:
1. **Authentication Required**: All bookmark endpoints require a valid JWT token in the Authorization header.

2. **Event ID Format**: Event IDs must be valid MongoDB ObjectId format (24-character hexadecimal string).

3. **Saved Events Array**: The `savedEvents` array in responses only includes active events. Deleted or inactive events are automatically filtered out.

4. **Duplicate Bookmarks**: Attempting to bookmark an already bookmarked event will return a 409 Conflict error.

5. **Removing Non-existent Bookmarks**: Attempting to remove a bookmark that doesn't exist will return a 400 Bad Request error.

6. **User Profile Endpoint**: The `GET /api/auth/me` endpoint now includes `savedEvents` and `savedEventsCount` in the response, so you can display saved events immediately after login without making a separate API call.

### Recommended Frontend Flow:

1. **On User Login/Profile Load**:
   - Call `GET /api/auth/me` to get user profile with saved events
   - Display saved events in the "Saved Events" section

2. **When User Clicks Bookmark Icon**:
   - Check if event is already bookmarked (check `savedEvents` array)
   - If not bookmarked: Call `POST /api/users/me/bookmarks/:eventId`
   - If bookmarked: Call `DELETE /api/users/me/bookmarks/:eventId`
   - Update local state/UI accordingly

3. **Refresh Saved Events**:
   - After adding/removing a bookmark, you can either:
     - Update local state based on the response
     - Call `GET /api/users/me/bookmarks` to refresh the list
     - Call `GET /api/auth/me` to refresh the entire user profile

### Example Frontend Implementation (Pseudo-code):

```javascript
// Check if event is bookmarked
const isBookmarked = user.savedEvents.some(event => event.id === eventId);

// Toggle bookmark
const toggleBookmark = async (eventId) => {
  try {
    if (isBookmarked) {
      // Remove bookmark
      await fetch(`/api/users/me/bookmarks/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } else {
      // Add bookmark
      await fetch(`/api/users/me/bookmarks/${eventId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    // Refresh user profile or update local state
    await refreshUserProfile();
  } catch (error) {
    // Handle error
    console.error('Bookmark operation failed:', error);
  }
};
```

---

## Status Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Operation completed successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication token |
| 404 | Not Found - Resource (user/event) not found |
| 409 | Conflict - Event already bookmarked (for POST) |
| 500 | Internal Server Error - Server-side error |

---

## Testing Examples

### cURL Examples

**Get Saved Events:**
```bash
curl -X GET "http://localhost:3000/api/users/me/bookmarks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Add Bookmark:**
```bash
curl -X POST "http://localhost:3000/api/users/me/bookmarks/507f1f77bcf86cd799439013" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Remove Bookmark:**
```bash
curl -X DELETE "http://localhost:3000/api/users/me/bookmarks/507f1f77bcf86cd799439013" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get User Profile with Saved Events:**
```bash
curl -X GET "http://localhost:3000/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Changelog

### Version 1.0.0 (2026-01-27)
- Initial release of Bookmark API
- Added GET `/api/users/me/bookmarks` endpoint
- Added POST `/api/users/me/bookmarks/:eventId` endpoint
- Added DELETE `/api/users/me/bookmarks/:eventId` endpoint
- Updated GET `/api/auth/me` to include saved events
