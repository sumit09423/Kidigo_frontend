# Event API Documentation

This document provides comprehensive documentation for all Event API endpoints, including validation rules and response types.

## Base URL
```
/api/events
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Create Event
**POST** `/api/events`

Create a new event (Vendor only).

#### Authorization
- **Required**: Yes
- **Role**: Vendor only

#### Request Body

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| `eventTitle` | string | Yes | - Not empty<br>- Max length: 200 characters<br>- Trimmed |
| `categoryId` | string (MongoDB ObjectId) | Yes | - Valid MongoDB ObjectId format |
| `eventDate` | string (ISO 8601) | Yes | - Valid ISO 8601 date format |
| `locationLink` | string (URL) | Yes | - Not empty<br>- Must be valid HTTP/HTTPS URL<br>- Trimmed |
| `imageLink` | string (URL) | Yes | - Not empty<br>- Must be valid HTTP/HTTPS URL<br>- Trimmed |
| `cityId` | string (MongoDB ObjectId) | Yes | - Valid MongoDB ObjectId format |
| `ageGroup` | object | Yes | - Required object<br>- `minAge`: integer, 0-18<br>- `maxAge`: integer, 0-18<br>- `minAge` must be ≤ `maxAge` |
| `capacity` | integer | Yes | - Not empty<br>- Minimum: 1 |
| `ticketLimit` | integer | Yes | - Not empty<br>- Minimum: 1<br>- Must be ≤ capacity |
| `description` | string | Yes | - Not empty<br>- Max length: 5000 characters<br>- Trimmed |
| `price` | number (float) | Yes | - Not empty<br>- Minimum: 0 (cannot be negative) |
| `tags` | array of strings | No | - Optional<br>- Must be an array<br>- Max 20 tags |

#### Request Example
```json
{
  "eventTitle": "Summer Art Workshop",
  "categoryId": "507f1f77bcf86cd799439011",
  "eventDate": "2026-07-15T10:00:00.000Z",
  "locationLink": "https://maps.google.com/...",
  "imageLink": "https://example.com/image.jpg",
  "cityId": "507f1f77bcf86cd799439012",
  "ageGroup": {
    "minAge": 5,
    "maxAge": 12
  },
  "capacity": 50,
  "ticketLimit": 40,
  "description": "A fun summer art workshop for kids",
  "price": 25.99,
  "tags": ["art", "workshop", "summer"]
}
```

#### Success Response (201 Created)
```json
{
  "status": "success",
  "message": "Event created successfully",
  "data": {
    "event": {
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
      "sold": 0,
      "availableTickets": 40,
      "description": "A fun summer art workshop for kids",
      "price": 25.99,
      "isActive": true,
      "isPublished": false,
      "createdAt": "2026-01-27T10:00:00.000Z",
      "updatedAt": "2026-01-27T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "eventTitle",
      "message": "Event title is required",
      "location": "body"
    },
    {
      "field": "ageGroup.minAge",
      "message": "Minimum age must be between 0 and 18",
      "location": "body"
    }
  ]
}
```

**403 Forbidden - Not a Vendor**
```json
{
  "status": "error",
  "message": "Only vendors can create events"
}
```

**403 Forbidden - Vendor Not Approved**
```json
{
  "status": "error",
  "message": "Vendor must be approved and active to create events"
}
```

**404 Not Found - Category Not Found**
```json
{
  "status": "error",
  "message": "Category not found"
}
```

**404 Not Found - City Not Found**
```json
{
  "status": "error",
  "message": "City not found"
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

### 2. Get Event by ID
**GET** `/api/events/:id`

Get event details by ID.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | - Valid MongoDB ObjectId format |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Event details retrieved successfully",
  "data": {
    "event": {
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
  }
}
```

#### Error Responses

**400 Bad Request - Invalid ID Format**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "id",
      "message": "Invalid ID format",
      "location": "params"
    }
  ]
}
```

**404 Not Found**
```json
{
  "status": "error",
  "message": "Event not found"
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

### 3. Get All Events
**GET** `/api/events`

Get all events with optional filters and pagination.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of events per page |
| `categoryId` | string (MongoDB ObjectId) | No | - | Filter by category ID |
| `dateFilter` | string | No | - | Filter by date: `Today`, `ThisWeekend`, or `YYYY-MM-DD` format |
| `cityId` | string (MongoDB ObjectId) | No | - | Filter by city ID |
| `minAge` | integer | No | - | Minimum age filter (0-18) |
| `maxAge` | integer | No | - | Maximum age filter (0-18) |
| `organizerId` | string (MongoDB ObjectId) | No | - | Filter by organizer/vendor ID |
| `search` | string | No | - | Search in event title, description, and tags |
| `isPublished` | boolean | No | true | Filter by published status (default: only published events) |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Events retrieved successfully",
  "data": {
    "events": [
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
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalEvents": 47,
      "hasNextPage": true,
      "hasPrevPage": false,
      "limit": 10
    },
    "filters": {
      "categoryId": null,
      "dateFilter": null,
      "cityId": null,
      "minAge": null,
      "maxAge": null,
      "organizerId": null,
      "search": null
    }
  }
}
```

#### Error Responses

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

### 4. Get Events by Category
**GET** `/api/events/category/:categoryId`

Get all events filtered by category.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `categoryId` | string | Yes | - Valid MongoDB ObjectId format |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Events retrieved successfully",
  "data": {
    "events": [
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
    ]
  }
}
```

#### Error Responses

**400 Bad Request - Invalid Category ID**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "categoryId",
      "message": "Invalid category ID format",
      "location": "params"
    }
  ]
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

### 5. Get Events by Organizer
**GET** `/api/events/organizer/:organizerId`

Get all events organized by a specific vendor/organizer.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `organizerId` | string | Yes | - Valid MongoDB ObjectId format |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Events retrieved successfully",
  "data": {
    "events": [
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
    ]
  }
}
```

#### Error Responses

**400 Bad Request - Invalid Organizer ID**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "organizerId",
      "message": "Invalid organizer ID format",
      "location": "params"
    }
  ]
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

### 6. Get Events by City
**GET** `/api/events/city/:cityId`

Get all events filtered by city.

#### Authorization
- **Required**: Yes
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `cityId` | string | Yes | - Valid MongoDB ObjectId format |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Events retrieved successfully",
  "data": {
    "events": [
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
    ]
  }
}
```

#### Error Responses

**400 Bad Request - Invalid City ID**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "cityId",
      "message": "Invalid city ID format",
      "location": "params"
    }
  ]
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

### 7. Update Event
**PUT** `/api/events/:id`

Update event details (Organizer only - must be the event organizer).

#### Authorization
- **Required**: Yes
- **Role**: Organizer (must be the event organizer)

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | - Valid MongoDB ObjectId format |

#### Request Body
All fields are optional. Only include fields you want to update.

| Field | Type | Required | Validation Rules |
|-------|------|----------|-----------------|
| `eventTitle` | string | No | - Max length: 200 characters<br>- Trimmed |
| `categoryId` | string (MongoDB ObjectId) | No | - Valid MongoDB ObjectId format |
| `eventDate` | string (ISO 8601) | No | - Valid ISO 8601 date format |
| `locationLink` | string (URL) | No | - Must be valid HTTP/HTTPS URL<br>- Trimmed |
| `imageLink` | string (URL) | No | - Must be valid HTTP/HTTPS URL<br>- Trimmed |
| `cityId` | string (MongoDB ObjectId) | No | - Valid MongoDB ObjectId format |
| `tags` | array of strings | No | - Must be an array<br>- Max 20 tags |
| `ageGroup` | object | No | - If provided, must be an object<br>- `minAge`: integer, 0-18 (optional)<br>- `maxAge`: integer, 0-18 (optional) |
| `capacity` | integer | No | - Minimum: 1 |
| `ticketLimit` | integer | No | - Minimum: 1<br>- Must be ≤ capacity |
| `description` | string | No | - Max length: 5000 characters<br>- Trimmed |
| `price` | number (float) | No | - Minimum: 0 (cannot be negative) |
| `isPublished` | boolean | No | - Must be a boolean value |

**Note**: The following fields cannot be updated:
- `_id` / `id`
- `createdAt`
- `updatedAt`
- `organizerId` (organizer cannot be changed)
- `sold` (sold tickets should be updated via separate endpoint)

#### Request Example
```json
{
  "eventTitle": "Updated Summer Art Workshop",
  "price": 29.99,
  "isPublished": true,
  "description": "Updated description for the workshop"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Event updated successfully",
  "data": {
    "event": {
      "id": "507f1f77bcf86cd799439013",
      "eventTitle": "Updated Summer Art Workshop",
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
      "description": "Updated description for the workshop",
      "price": 29.99,
      "isActive": true,
      "isPublished": true,
      "createdAt": "2026-01-27T10:00:00.000Z",
      "updatedAt": "2026-01-27T11:30:00.000Z"
    }
  }
}
```

#### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price cannot be negative",
      "location": "body"
    }
  ]
}
```

**403 Forbidden - Not the Organizer**
```json
{
  "status": "error",
  "message": "Only the event organizer can update this event"
}
```

**404 Not Found - Event Not Found**
```json
{
  "status": "error",
  "message": "Event not found"
}
```

**404 Not Found - Category Not Found**
```json
{
  "status": "error",
  "message": "Category not found"
}
```

**404 Not Found - City Not Found**
```json
{
  "status": "error",
  "message": "City not found"
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

### 8. Delete Event
**DELETE** `/api/events/:id`

Delete an event (Organizer only - must be the event organizer).

#### Authorization
- **Required**: Yes
- **Role**: Organizer (must be the event organizer)

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | - Valid MongoDB ObjectId format |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Event deleted successfully"
}
```

#### Error Responses

**400 Bad Request - Invalid ID Format**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "id",
      "message": "Invalid ID format",
      "location": "params"
    }
  ]
}
```

**403 Forbidden - Not the Organizer**
```json
{
  "status": "error",
  "message": "Only the event organizer can delete this event"
}
```

**404 Not Found**
```json
{
  "status": "error",
  "message": "Event not found"
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

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "message": "Success message",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    // Validation errors (if applicable)
  ]
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Validation Rules Summary

### Common Validations

1. **MongoDB ObjectId**: Must be a valid 24-character hexadecimal string
2. **URLs**: Must start with `http://` or `https://`
3. **ISO 8601 Dates**: Must be in format `YYYY-MM-DDTHH:mm:ss.sssZ`
4. **Age Range**: Must be between 0 and 18
5. **String Lengths**: 
   - Event title: Max 200 characters
   - Description: Max 5000 characters
   - Tags: Max 20 tags
6. **Numbers**: 
   - Capacity: Minimum 1
   - Ticket Limit: Minimum 1, must be ≤ capacity
   - Price: Minimum 0 (cannot be negative)
   - Sold tickets: Cannot exceed ticket limit

### Business Rules

1. **Event Creation**: 
   - Only vendors can create events
   - Vendor must be approved and active
   - Category, City, and Vendor must exist

2. **Event Updates/Deletes**:
   - Only the event organizer can update/delete their events
   - Organizer cannot be changed after creation

3. **Ticket Management**:
   - `sold` tickets cannot exceed `ticketLimit`
   - `ticketLimit` cannot exceed `capacity`
   - `availableTickets` = `ticketLimit` - `sold`

4. **Age Group**:
   - `minAge` must be ≤ `maxAge`
   - Both must be between 0 and 18

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are MongoDB ObjectIds (24-character hexadecimal strings)
- All prices are in decimal format (e.g., 25.99)
- Events are sorted by `eventDate` (ascending) by default
- By default, only active and published events are returned in list endpoints
- Pagination is 1-based (first page is page 1)
