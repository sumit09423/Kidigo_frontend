# Category GET API Documentation

This document provides comprehensive documentation for all Category GET API endpoints, including validation rules and response types.

## Base URL
```
/api/categories
```

## Authentication
**Note**: Currently, GET endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

**Note**: Consider making these endpoints public (no authentication required) similar to Event GET endpoints for better user experience.

---

## Endpoints

### 1. Get Category by ID
**GET** `/api/categories/:id`

Get category details by ID.

#### Authorization
- **Required**: Yes (Currently requires authentication)
- **Role**: Any authenticated user

#### Path Parameters

| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | - Valid MongoDB ObjectId format (24-character hexadecimal string) |

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Category details retrieved successfully",
  "data": {
    "category": {
      "id": "507f1f77bcf86cd799439011",
      "category": "Arts & Crafts",
      "categoryIcon": "https://example.com/icons/arts-crafts.png",
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

**401 Unauthorized - Missing or Invalid Token**
```json
{
  "status": "error",
  "message": "Unauthorized - Invalid or missing token"
}
```

**404 Not Found**
```json
{
  "status": "error",
  "message": "Category not found"
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

### 2. Get All Categories
**GET** `/api/categories`

Get all categories with optional pagination and search filters.

#### Authorization
- **Required**: Yes (Currently requires authentication)
- **Role**: Any authenticated user

#### Query Parameters

| Parameter | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| `page` | integer | No | 1 | - Minimum: 1 | Page number for pagination |
| `limit` | integer | No | 10 | - Minimum: 1<br>- Maximum: 100 | Number of categories per page |
| `search` | string | No | - | - Case-insensitive search | Search categories by name |

#### Request Examples

**Get all categories (first page)**
```
GET /api/categories
```

**Get categories with pagination**
```
GET /api/categories?page=2&limit=20
```

**Search categories by name**
```
GET /api/categories?search=arts
```

**Combined filters**
```
GET /api/categories?page=1&limit=15&search=math
```

#### Success Response (200 OK)

**Response with categories:**
```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "507f1f77bcf86cd799439011",
        "category": "Arts & Crafts",
        "categoryIcon": "https://example.com/icons/arts-crafts.png",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "category": "Mathematics",
        "categoryIcon": "https://example.com/icons/math.png",
        "createdAt": "2026-01-26T09:00:00.000Z",
        "updatedAt": "2026-01-26T09:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "category": "Sports",
        "categoryIcon": "https://example.com/icons/sports.png",
        "createdAt": "2026-01-25T08:00:00.000Z",
        "updatedAt": "2026-01-25T08:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCategories": 47,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Response with no categories (empty result):**
```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 0,
      "totalCategories": 0,
      "hasNextPage": false,
      "hasPrevPage": false
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
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Authentication required or invalid token |
| 404 | Not Found - Category not found |
| 500 | Internal Server Error - Server error |

## Validation Rules Summary

### Path Parameters

1. **Category ID (`id`)**:
   - **Type**: String
   - **Format**: MongoDB ObjectId
   - **Validation**: Must be a valid 24-character hexadecimal string
   - **Example**: `507f1f77bcf86cd799439011`

### Query Parameters

1. **Page (`page`)**:
   - **Type**: Integer
   - **Default**: 1
   - **Validation**: Minimum value is 1
   - **Description**: Page number for pagination (1-based)

2. **Limit (`limit`)**:
   - **Type**: Integer
   - **Default**: 10
   - **Validation**: 
     - Minimum value: 1
     - Maximum value: 100
   - **Description**: Number of categories per page

3. **Search (`search`)**:
   - **Type**: String
   - **Required**: No
   - **Validation**: Case-insensitive search
   - **Description**: Searches category names using case-insensitive regex matching
   - **Example**: `search=arts` will match "Arts & Crafts", "Fine Arts", etc.

## Response Data Structure

### Category Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Category's MongoDB ObjectId |
| `category` | string | Category name (max 100 characters) |
| `categoryIcon` | string | URL or path to category icon (max 500 characters) |
| `createdAt` | string (ISO 8601) | Category creation timestamp |
| `updatedAt` | string (ISO 8601) | Category last update timestamp |

### Pagination Object

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | integer | Current page number |
| `totalPages` | integer | Total number of pages |
| `totalCategories` | integer | Total number of categories matching the query |
| `hasNextPage` | boolean | Whether there is a next page |
| `hasPrevPage` | boolean | Whether there is a previous page |

## Business Rules

1. **Sorting**: Categories are sorted by `createdAt` in descending order (newest first)

2. **Search Functionality**:
   - Search is case-insensitive
   - Searches only in the `category` field (category name)
   - Uses regex pattern matching: `{ $regex: search, $options: 'i' }`

3. **Pagination**:
   - Pagination is 1-based (first page is page 1)
   - Default page size is 10 categories
   - Maximum page size is 100 categories
   - If page number exceeds total pages, returns empty array with pagination info

4. **Empty Results**:
   - If no categories match the search criteria, returns empty array
   - Pagination object still reflects the total count (0)

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are MongoDB ObjectIds (24-character hexadecimal strings)
- Category names are trimmed and have a maximum length of 100 characters
- Category icon URLs have a maximum length of 500 characters
- Search is performed using MongoDB regex with case-insensitive option
- Categories are sorted by creation date (newest first)

## Example Use Cases

### Use Case 1: Get All Categories for Category Selection
```
GET /api/categories?limit=50
```
Use this to display all available categories in a dropdown or list.

### Use Case 2: Search for Specific Category
```
GET /api/categories?search=sports
```
Use this to find categories matching a search term.

### Use Case 3: Paginated Category List
```
GET /api/categories?page=2&limit=20
```
Use this for paginated category browsing.

### Use Case 4: Get Single Category Details
```
GET /api/categories/507f1f77bcf86cd799439011
```
Use this to get detailed information about a specific category.
