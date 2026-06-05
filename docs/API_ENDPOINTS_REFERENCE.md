# 🔌 API Endpoints Reference

**Complete REST API Documentation for IKIGAI Quest Backend**

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Quizzes](#quizzes)
- [XP & Leaderboard](#xp--leaderboard)
- [Attendance & QR](#attendance--qr)
- [Sports](#sports)
- [Publications](#publications)
- [Admin](#admin)
- [Response Format](#response-format)
- [Error Codes](#error-codes)

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER",
      "xp": 500,
      "level": 2,
      "createdAt": "2026-01-15T10:30:00Z"
    },
    "expiresIn": 86400
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepass123",
  "name": "Jane Doe",
  "phone": "+1234567890"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "role": "USER"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400
  }
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👥 Users

### Get Current User
```http
GET /api/users/me
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "xp": 500,
    "level": 2,
    "tribe": {
      "id": "uuid",
      "name": "Team A",
      "totalXp": 10000
    },
    "avatar": "https://...",
    "phone": "+1234567890",
    "joinedAt": "2026-01-15T10:30:00Z"
  }
}
```

### Update User Profile
```http
PATCH /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+9876543210",
  "avatar": "base64_image_data"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Updated",
    "phone": "+9876543210"
  }
}
```

### Get User by ID (Admin)
```http
GET /api/users/{userId}
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "success": true,
  "data": { /* user object */ }
}
```

### List All Users (Admin)
```http
GET /api/users?page=1&limit=20&role=USER&search=john
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "success": true,
  "data": [
    { /* user objects */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Delete User (Admin)
```http
DELETE /api/users/{userId}
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Change Password
```http
POST /api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}

Response (200 OK):
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 📚 Quizzes

### Get Available Quizzes
```http
GET /api/quiz/available?page=1&limit=10&category=science
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "General Science Quiz",
      "description": "Test your science knowledge",
      "category": "science",
      "difficulty": "MEDIUM",
      "timeLimit": 600,
      "totalQuestions": 10,
      "xpReward": 100,
      "image": "https://...",
      "createdAt": "2026-01-10T10:00:00Z",
      "status": "PUBLISHED",
      "attempts": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Get Quiz Details
```http
GET /api/quiz/{quizId}
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "General Science Quiz",
    "description": "Test your science knowledge",
    "category": "science",
    "difficulty": "MEDIUM",
    "timeLimit": 600,
    "totalQuestions": 10,
    "xpReward": 100,
    "image": "https://...",
    "questions": [
      {
        "id": "uuid",
        "question": "What is H2O?",
        "options": [
          "Hydrogen and Oxygen",
          "Water molecule",
          "Chemical compound",
          "All of the above"
        ],
        "type": "MULTIPLE_CHOICE",
        "order": 1
      }
    ],
    "createdBy": {
      "id": "uuid",
      "name": "Admin"
    }
  }
}
```

### Submit Quiz
```http
POST /api/quiz/{quizId}/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "uuid-1",
      "answer": "option_2"
    },
    {
      "questionId": "uuid-2",
      "answer": "option_1"
    }
  ]
}

Response (200 OK):
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "score": 8,
    "maxScore": 10,
    "percentage": 80,
    "passed": true,
    "xpAwarded": 80,
    "completedAt": "2026-06-05T15:30:00Z"
  }
}
```

### Get Quiz Result
```http
GET /api/quiz/{quizId}/result
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "submissionId": "uuid",
    "quizId": "uuid",
    "score": 8,
    "maxScore": 10,
    "percentage": 80,
    "passed": true,
    "xpAwarded": 80,
    "answers": [
      {
        "questionId": "uuid",
        "question": "What is H2O?",
        "userAnswer": "option_2",
        "correctAnswer": "option_2",
        "isCorrect": true
      }
    ],
    "completedAt": "2026-06-05T15:30:00Z"
  }
}
```

### Get My Quiz Submissions
```http
GET /api/quiz/my-submissions?page=1&limit=10
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "quiz": {
        "id": "uuid",
        "title": "Science Quiz",
        "category": "science"
      },
      "score": 8,
      "maxScore": 10,
      "percentage": 80,
      "xpAwarded": 80,
      "submittedAt": "2026-06-05T15:30:00Z"
    }
  ],
  "pagination": { }
}
```

### Create Quiz (Admin/Staff)
```http
POST /api/quiz
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "New Quiz",
  "description": "Quiz description",
  "category": "science",
  "difficulty": "MEDIUM",
  "timeLimit": 600,
  "xpReward": 100,
  "image": "base64_image_data",
  "questions": [
    {
      "question": "What is H2O?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 2",
      "type": "MULTIPLE_CHOICE",
      "order": 1
    }
  ]
}

Response (201 Created):
{
  "success": true,
  "data": { /* quiz object */ }
}
```

### Update Quiz (Admin)
```http
PATCH /api/quiz/{quizId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Quiz Title",
  "xpReward": 150
}

Response (200 OK):
{
  "success": true,
  "data": { /* updated quiz */ }
}
```

### Delete Quiz (Admin)
```http
DELETE /api/quiz/{quizId}
Authorization: Bearer {admin_token}

Response (200 OK):
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

---

## 🏆 XP & Leaderboard

### Get Leaderboard
```http
GET /api/xp/leaderboard?limit=50&period=MONTH
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "John Doe",
      "avatar": "https://...",
      "xp": 5000,
      "level": 5,
      "tribe": "Team A",
      "dailyXp": 500,
      "weeklyXp": 2000,
      "monthlyXp": 5000
    },
    {
      "rank": 2,
      "userId": "uuid",
      "name": "Jane Smith",
      "avatar": "https://...",
      "xp": 4800,
      "level": 5,
      "tribe": "Team B",
      "dailyXp": 450,
      "weeklyXp": 1900,
      "monthlyXp": 4800
    }
  ]
}
```

### Get Tribe Leaderboard
```http
GET /api/xp/tribes?limit=20
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "tribeId": "uuid",
      "name": "Team A",
      "totalXp": 50000,
      "members": 25,
      "averageXpPerMember": 2000,
      "level": 10
    }
  ]
}
```

### Get User XP History
```http
GET /api/xp/history?userId={userId}&limit=30
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "xpAmount": 100,
      "sourceType": "QUIZ",
      "sourceId": "uuid",
      "description": "Quiz: Science 101",
      "earnedAt": "2026-06-05T15:30:00Z"
    },
    {
      "id": "uuid",
      "xpAmount": 50,
      "sourceType": "SESSION",
      "sourceId": "uuid",
      "description": "Attendance: Morning Session",
      "earnedAt": "2026-06-05T09:00:00Z"
    }
  ]
}
```

### Get My Stats
```http
GET /api/xp/my-stats
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "totalXp": 2500,
    "level": 3,
    "currentRank": 15,
    "dailyXp": 250,
    "weeklyXp": 1200,
    "monthlyXp": 2500,
    "quizzesCompleted": 10,
    "averageScore": 85,
    "streakDays": 5,
    "tribe": {
      "id": "uuid",
      "name": "Team A",
      "rank": 3
    }
  }
}
```

---

## 📍 Attendance & QR

### Create Attendance Session
```http
POST /api/attendance/sessions
Authorization: Bearer {staff_token}
Content-Type: application/json

{
  "name": "Morning Assembly",
  "description": "Daily morning assembly",
  "location": "Main Hall",
  "startTime": "2026-06-05T09:00:00Z",
  "endTime": "2026-06-05T09:30:00Z",
  "xpReward": 50
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": "uuid",
    "qrCode": "data:image/png;base64,...",
    "qrCodeText": "ATTENDANCE_SESSION_uuid",
    "name": "Morning Assembly",
    "startTime": "2026-06-05T09:00:00Z",
    "endTime": "2026-06-05T09:30:00Z"
  }
}
```

### Scan QR Code
```http
POST /api/attendance/scan
Authorization: Bearer {token}
Content-Type: application/json

{
  "qrCode": "ATTENDANCE_SESSION_uuid",
  "latitude": 25.1972,
  "longitude": 55.2744
}

Response (200 OK):
{
  "success": true,
  "data": {
    "attendanceId": "uuid",
    "sessionName": "Morning Assembly",
    "xpAwarded": 50,
    "scannedAt": "2026-06-05T09:15:00Z",
    "message": "Attendance marked successfully"
  }
}
```

### Get Active Sessions
```http
GET /api/attendance/active
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Morning Assembly",
      "location": "Main Hall",
      "startTime": "2026-06-05T09:00:00Z",
      "endTime": "2026-06-05T09:30:00Z",
      "remainingTime": 900,
      "attendanceCount": 25
    }
  ]
}
```

### Get My Attendance
```http
GET /api/attendance/my-attendance?month=06&year=2026
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "totalSessions": 20,
    "attendedSessions": 18,
    "missedSessions": 2,
    "attendancePercentage": 90,
    "totalXpEarned": 900,
    "attendanceHistory": [
      {
        "sessionId": "uuid",
        "sessionName": "Morning Assembly",
        "scannedAt": "2026-06-05T09:15:00Z",
        "xpEarned": 50
      }
    ]
  }
}
```

---

## ⚽ Sports

### Get All Matches
```http
GET /api/sports/matches?status=SCHEDULED&limit=20
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Football Championship",
      "sport": "FOOTBALL",
      "homeTeam": {
        "name": "Team A",
        "score": null
      },
      "awayTeam": {
        "name": "Team B",
        "score": null
      },
      "status": "SCHEDULED",
      "startTime": "2026-06-10T15:00:00Z",
      "venue": "Main Stadium",
      "image": "https://..."
    }
  ]
}
```

### Get Match Details
```http
GET /api/sports/matches/{matchId}
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Football Championship",
    "sport": "FOOTBALL",
    "homeTeam": {
      "id": "uuid",
      "name": "Team A",
      "score": 2,
      "players": ["Player 1", "Player 2", "Player 3"]
    },
    "awayTeam": {
      "id": "uuid",
      "name": "Team B",
      "score": 1,
      "players": []
    },
    "status": "LIVE",
    "startTime": "2026-06-10T15:00:00Z",
    "endTime": null,
    "venue": "Main Stadium",
    "description": "Championship match",
    "image": "https://...",
    "highlights": "video_url"
  }
}
```

### Create Match (Admin)
```http
POST /api/sports/matches
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "New Match",
  "sport": "FOOTBALL",
  "homeTeamId": "uuid",
  "awayTeamId": "uuid",
  "startTime": "2026-06-10T15:00:00Z",
  "venue": "Main Stadium",
  "description": "Championship match"
}

Response (201 Created):
{
  "success": true,
  "data": { /* match object */ }
}
```

---

## 📰 Publications

### Get Publications
```http
GET /api/publications?page=1&limit=20&search=tech
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Latest Tech News",
      "content": "Content preview...",
      "category": "TECHNOLOGY",
      "author": {
        "id": "uuid",
        "name": "Admin User"
      },
      "coverImage": "https://...",
      "publishedAt": "2026-06-05T10:00:00Z",
      "views": 150,
      "downloads": 25
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get Publication Details
```http
GET /api/publications/{publicationId}
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Latest Tech News",
    "content": "Full content here...",
    "category": "TECHNOLOGY",
    "author": {
      "id": "uuid",
      "name": "Admin User"
    },
    "coverImage": "https://...",
    "pdf": "https://...",
    "publishedAt": "2026-06-05T10:00:00Z",
    "views": 150,
    "downloads": 25
  }
}
```

### Create Publication (Admin)
```http
POST /api/publications
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

{
  "title": "New Article",
  "content": "Article content",
  "category": "TECHNOLOGY",
  "coverImage": <file>,
  "pdf": <file>
}

Response (201 Created):
{
  "success": true,
  "data": { /* publication object */ }
}
```

---

## 🛠️ Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## ⚠️ Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User doesn't have permission |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input data |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |
| EXTERNAL_SERVICE_ERROR | 502 | External service failed |

---

## 🔗 Rate Limits

- **Standard Endpoints**: 100 requests / 15 minutes
- **Authentication**: 5 requests / minute
- **File Upload**: 10 requests / hour
- **Admin Endpoints**: 200 requests / 15 minutes

---

## 📚 Authentication Headers

All authenticated endpoints require:
```
Authorization: Bearer {access_token}
```

Token expires in 24 hours. Use `/auth/refresh` to get a new token.

---

**Last Updated**: June 5, 2026  
**API Version**: 1.0.0  
**Base URL**: `http://localhost:3000/api`

