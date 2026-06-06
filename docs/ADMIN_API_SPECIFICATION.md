# Admin API Specification

## Overview
This document describes the admin management API endpoints for IKIGAI. These endpoints require authentication and specific role-based permissions.

## Authentication
All admin endpoints require:
- Valid JWT Bearer token in `Authorization` header
- Minimum role: STAFF (for most endpoints)
- SUPER_ADMIN role (for CMS, nav config, and certain user management operations)

## Role Hierarchy
```
ATTENDEE < STAFF < ADMIN < SUPER_ADMIN
```

### Permissions
- **SUPER_ADMIN**: All permissions
- **ADMIN**: User management (create, assign tribe, adjust XP, delete), Session management, Quiz management, Tribe management, Bonus management, Levels management
- **ADMIN Cannot**: Modify CMS settings, change navigation config, change user roles
- **STAFF**: Dashboard stats, User creation, Session management, Tribes management
- **ATTENDEE**: No admin access

## User Management Endpoints

### Create User
**Endpoint:** `POST /api/v1/admin/users`

**Permission:** STAFF+

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "ATTENDEE",
  "church": "St. Mary's Church",
  "diocese": "Cairo Diocese",
  "tribeId": "uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "ATTENDEE",
    "church": "St. Mary's Church",
    "diocese": "Cairo Diocese",
    "tribeId": "tribe-uuid",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Users
**Endpoint:** `GET /api/v1/admin/users`

**Permission:** STAFF+

**Query Parameters:**
- `page` (integer, default: 1) - Pagination page
- `limit` (integer, default: 50) - Results per page
- `role` (string, optional) - Filter by role (ATTENDEE, STAFF, ADMIN, SUPER_ADMIN)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "ATTENDEE",
      "tribe": { "id": "tribe-uuid", "name": "Tribe Name" },
      "xpPoints": 150,
      "level": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "pages": 5
  }
}
```

### Get User Detail
**Endpoint:** `GET /api/v1/admin/users/:userId`

**Permission:** STAFF+

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "ATTENDEE",
    "church": "St. Mary's Church",
    "diocese": "Cairo Diocese",
    "tribe": { "id": "tribe-uuid", "name": "Tribe Name" },
    "xpPoints": 150,
    "level": 3,
    "joinDate": "2024-01-15T10:30:00Z",
    "lastLogin": "2024-02-20T14:45:00Z",
    "statistics": {
      "sessionsAttended": 5,
      "quizzesCompleted": 12,
      "bonusPointsEarned": 50
    }
  }
}
```

### Change User Role
**Endpoint:** `PATCH /api/v1/admin/users/:userId/role`

**Permission:** SUPER_ADMIN

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**Valid Roles:**
- ATTENDEE
- STAFF
- ADMIN
- SUPER_ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "updatedAt": "2024-02-20T15:00:00Z"
  }
}
```

### Assign User to Tribe
**Endpoint:** `PATCH /api/v1/admin/users/:userId/tribe`

**Permission:** STAFF+

**Request Body:**
```json
{
  "tribeId": "tribe-uuid"
}
```

### Adjust User XP
**Endpoint:** `PATCH /api/v1/admin/users/:userId/xp`

**Permission:** STAFF+

**Request Body:**
```json
{
  "amount": 50,
  "reason": "Manual adjustment for exceptional participation"
}
```

### Reset User Password
**Endpoint:** `POST /api/v1/admin/users/:userId/reset-password`

**Permission:** STAFF+

**Request Body:**
```json
{
  "defaultPassword": "NewDefault123!"
}
```

### Delete User (Soft Delete)
**Endpoint:** `DELETE /api/v1/admin/users/:userId`

**Permission:** SUPER_ADMIN

### Get User Activity
**Endpoint:** `GET /api/v1/admin/users/:userId/activity`

**Permission:** STAFF+

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "SESSION_ATTENDED",
      "description": "Attended session: Technology Talk",
      "timestamp": "2024-02-20T14:00:00Z"
    },
    {
      "type": "QUIZ_COMPLETED",
      "description": "Completed quiz: Bible Knowledge Quiz",
      "score": 85,
      "timestamp": "2024-02-19T10:30:00Z"
    }
  ]
}
```

## CMS Configuration Endpoints

### Get CMS Config
**Endpoint:** `GET /api/v1/admin/config`

**Permission:** SUPER_ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "appName": "IKIGAI Quest",
    "appNameAr": "إيكيجاي كويست",
    "infoPageTitle": "About Us",
    "infoPageTitleAr": "عننا",
    "infoPageContent": "Welcome to IKIGAI Quest...",
    "infoPageContentAr": "مرحبا بك في إيكيجاي كويست..."
  }
}
```

### Update CMS Config
**Endpoint:** `PATCH /api/v1/admin/config`

**Permission:** SUPER_ADMIN

**Request Body:** (all fields optional)
```json
{
  "appName": "IKIGAI Quest 2024",
  "appNameAr": "إيكيجاي كويست 2024",
  "infoPageTitle": "About Our Program",
  "infoPageTitleAr": "عن برنامجنا",
  "infoPageContent": "Updated content here...",
  "infoPageContentAr": "محتوى محدث هنا..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "appName": "IKIGAI Quest 2024",
    "appNameAr": "إيكيجاي كويست 2024",
    "infoPageTitle": "About Our Program",
    "infoPageTitleAr": "عن برنامجنا",
    "infoPageContent": "Updated content here...",
    "infoPageContentAr": "محتوى محدث هنا..."
  }
}
```

## Navigation Configuration Endpoints

### Get Navigation Config
**Endpoint:** `GET /api/v1/admin/nav-config`

**Permission:** SUPER_ADMIN

**Response:**
```json
{
  "success": true,
  "data": {
    "web": [
      { "name": "home", "visible": true },
      { "name": "profile", "visible": true },
      { "name": "leaderboard", "visible": true },
      { "name": "events", "visible": true },
      { "name": "quizzes", "visible": true },
      { "name": "library", "visible": true },
      { "name": "sports", "visible": true },
      { "name": "scan", "visible": true },
      { "name": "info", "visible": true }
    ],
    "mobile": [
      { "name": "home", "visible": true },
      { "name": "profile", "visible": true },
      { "name": "leaderboard", "visible": true },
      { "name": "events", "visible": true },
      { "name": "quizzes", "visible": true },
      { "name": "library", "visible": true },
      { "name": "sports", "visible": true },
      { "name": "scan", "visible": true },
      { "name": "info", "visible": true }
    ]
  }
}
```

### Update Navigation Config
**Endpoint:** `PATCH /api/v1/admin/nav-config`

**Permission:** SUPER_ADMIN

**Request Body:**
```json
{
  "web": [
    { "name": "home", "visible": true },
    { "name": "profile", "visible": true },
    { "name": "leaderboard", "visible": false },
    { "name": "events", "visible": true },
    { "name": "quizzes", "visible": true },
    { "name": "library", "visible": true },
    { "name": "sports", "visible": false },
    { "name": "scan", "visible": true },
    { "name": "info", "visible": true }
  ],
  "mobile": [
    { "name": "home", "visible": true },
    { "name": "profile", "visible": true },
    { "name": "leaderboard", "visible": true },
    { "name": "events", "visible": true },
    { "name": "quizzes", "visible": true },
    { "name": "library", "visible": false },
    { "name": "sports", "visible": false },
    { "name": "scan", "visible": true },
    { "name": "info", "visible": true }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "web": [...],
    "mobile": [...]
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "User not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "EMAIL_EXISTS",
  "message": "Email already in use"
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "details": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

## Implementation Notes

### Phone Field
- Optional field in user creation
- Maximum length: 20 characters
- Format: Any phone format accepted (no validation)

### CMS Configuration
- All fields stored in SystemConfig table as key-value JSON pairs
- Updated by user ID is tracked in `updatedBy` field
- Changes take effect immediately for app/web clients

### Navigation Configuration
- Stored as JSON in SystemConfig table with key "navConfig"
- Platform-specific (web vs mobile)
- Default items include: home, profile, leaderboard, events, quizzes, library, sports, scan, info
- Visibility can be toggled independently per platform

### System Config (Legacy)
- Separate endpoints for individual key-value updates: `/admin/system-config/:key`
- Supports ADMIN and SUPER_ADMIN roles
- Use `/admin/config` for bulk CMS updates (SUPER_ADMIN only)
