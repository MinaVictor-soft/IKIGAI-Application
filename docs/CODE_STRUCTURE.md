# IKIGAI Quest - Code Structure & Architecture

**Technical guide for developers - System design, folder structure, and key components**

---

## 📖 Table of Contents

1. [System Architecture](#system-architecture)
2. [Project Structure](#project-structure)
3. [Backend Services](#backend-services)
4. [Frontend Applications](#frontend-applications)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Key Technologies](#key-technologies)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     IKIGAI Quest System                     │
└─────────────────────────────────────────────────────────────┘

User Interfaces:
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │   Web App    │  │  Mobile App  │  │  Admin Panel │
  │  (React)     │  │ (React Native)  │  (React)     │
  └──────┬───────┘  └────────┬──────┘  └──────┬───────┘
         │                   │                │
         └───────────────────┼────────────────┘
                    ┌────────▼────────┐
                    │   REST API      │
                    │  (Node.js)      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐  ┌─────▼─────┐  ┌──────▼──────┐
         │ Database│  │ Middleware │  │  Services   │
         │(PostgreSQL)  │(Auth,etc) │  │(Quiz,Sports)│
         └──────────┘  └───────────┘  └─────────────┘
```

---

## Project Structure

### Root Directory
```
IKIGAI/
├── backend/                 # Node.js Express API
├── web-app/                 # React web application
├── admin-dashboard/         # React admin panel
├── mobile-app/              # React Native app
├── docs/                    # Documentation (4 consolidated files)
├── package.json             # Root dependencies
└── README.md
```

---

## Backend Services

### Structure: `backend/`

```
backend/
├── src/
│   ├── app.ts               # Express app setup
│   ├── config/              # Configuration files
│   │   ├── database.ts      # PostgreSQL connection
│   │   ├── env.ts           # Environment variables
│   │   └── swagger.ts       # API documentation
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   ├── upload.ts        # File uploads
│   │   └── validate.ts      # Input validation
│   │
│   ├── modules/             # Business logic
│   │   ├── admin/           # Admin endpoints
│   │   ├── auth/            # Login/Register
│   │   ├── attendance/      # QR scanning
│   │   ├── bonus/           # Bonus system
│   │   ├── publications/    # Content library
│   │   ├── quiz/            # Quiz system
│   │   ├── sports/          # Sports module
│   │   └── xp/              # XP & leaderboard
│   │
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Helper functions
│       ├── asyncHandler.ts
│       ├── audit.ts
│       ├── params.ts
│       └── response.ts
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Data seeding
│
├── package.json
└── tsconfig.json
```

### Key Backend Modules

#### 1. Auth Module (`src/modules/auth/`)
- **Purpose**: User authentication and registration
- **Endpoints**:
  - POST `/auth/register` - Create account
  - POST `/auth/login` - Login with credentials
  - POST `/auth/logout` - Logout
  - GET `/auth/me` - Get current user
- **Key Features**:
  - JWT token generation
  - Password hashing (bcryptjs)
  - Role-based access control

#### 2. Quiz Module (`src/modules/quiz/`)
- **Purpose**: Quiz management and submission
- **Endpoints**:
  - GET `/quiz/available` - List quizzes
  - GET `/quiz/:id` - Get quiz details
  - POST `/quiz/:id/submit` - Submit answers
  - GET `/quiz/:id/result` - Get previous result
- **Key Features**:
  - Question management
  - Automatic scoring
  - XP calculation
  - Result tracking

#### 3. Attendance Module (`src/modules/attendance/`)
- **Purpose**: QR code scanning and attendance
- **Endpoints**:
  - POST `/attendance/scan` - Scan QR code
  - GET `/attendance/sessions` - List sessions
- **Key Features**:
  - QR code validation
  - Attendance tracking
  - XP awarding
  - Session management

#### 4. XP Module (`src/modules/xp/`)
- **Purpose**: XP tracking and leaderboards
- **Endpoints**:
  - GET `/xp/history` - User XP history
  - GET `/xp/leaderboard` - Individual rankings
  - GET `/xp/tribes` - Team rankings
  - POST `/xp/award` - Award XP (admin)
- **Key Features**:
  - XP calculation
  - Leaderboard ranking
  - Performance statistics

#### 5. Sports Module (`src/modules/sports/`)
- **Purpose**: Sports matches and results
- **Endpoints**:
  - GET `/sports/matches` - List matches
  - GET `/sports/matches/:id` - Match details
  - POST `/sports/matches` - Create match
  - POST `/sports/matches/:id/result` - Record result
- **Key Features**:
  - Match scheduling
  - Score tracking
  - Team management
  - Rankings

---

## Frontend Applications

### Web App: `web-app/`

```
web-app/src/
├── App.tsx                  # Main router
├── index.css               # Global styles
├── main.tsx                # Entry point
│
├── pages/                  # Page components
│   ├── HomePage.tsx        # Dashboard
│   ├── LoginPage.tsx       # Authentication
│   ├── RegisterPage.tsx
│   ├── QuizzesPage.tsx     # Quiz list
│   ├── QuizPlayPage.tsx    # Quiz taker (NEW)
│   ├── LeaderboardPage.tsx # Rankings (NEW)
│   ├── ScannerPage.tsx     # QR scanner
│   ├── EventsPage.tsx      # Events
│   ├── LibraryPage.tsx     # Content
│   ├── SportsPage.tsx      # Sports
│   ├── ProfilePage.tsx     # User profile
│   ├── InfoPage.tsx        # Help
│   └── LoadingPage.tsx     # Loading screen
│
├── components/             # Reusable components
│   ├── Sidebar.tsx         # Navigation
│   └── ... other components
│
├── contexts/               # State management
│   ├── AuthContext.tsx     # Authentication state
│   └── LangContext.tsx     # Language/i18n
│
├── layouts/                # Layout components
│   └── MainLayout.tsx      # Main layout wrapper
│
├── lib/                    # Utilities
│   ├── api.ts              # Axios config
│   └── storage.ts          # Local storage
│
├── i18n/                   # Internationalization
│   ├── locales/
│   │   ├── en.json         # English
│   │   └── ar.json         # Arabic (RTL)
│   └── config.ts
│
└── types/                  # TypeScript types
```

**Tech Stack:**
- React 19.2.6
- Vite 8.0.12
- TypeScript 6.0.2
- Tailwind CSS 4.3.0
- React Router v6
- Axios (HTTP)
- React Query (state)
- i18next (translations)
- React Hot Toast (notifications)

### Mobile App: `mobile-app/`

```
mobile-app/src/
├── screens/                # Page screens
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── QuizListScreen.tsx
│   ├── QuizPlayScreen.tsx
│   ├── LeaderboardScreen.tsx
│   ├── ScannerScreen.tsx
│   ├── EventsScreen.tsx
│   ├── LibraryScreen.tsx
│   ├── SportsScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── InfoScreen.tsx
│   └── ... other screens
│
├── navigation/             # Navigation config
│   └── AppNavigator.tsx    # Route setup
│
├── components/             # Reusable components
│   ├── ConferenceHeader.tsx
│   ├── ConferenceFooter.tsx
│   └── ... other components
│
├── contexts/               # State management
│   ├── AuthContext.tsx
│   ├── LangContext.tsx
│   └── ViewedContext.tsx
│
├── hooks/                  # Custom hooks
│   └── useApi.ts           # API calls
│
├── lib/                    # Utilities
│   ├── api.ts
│   └── storage.ts
│
├── i18n/                   # Translations
│   └── translations.ts
│
├── config/                 # Config
│   └── constants.ts
│
└── types/                  # TypeScript types
```

**Tech Stack:**
- React Native 0.85.3
- Expo 56.0.8
- TypeScript 6.0.2
- React Navigation 7.2.5
- Axios (HTTP)
- React Query (state)
- Expo Barcode Scanner (QR)
- i18next (translations)

---

## Database Schema

### Core Tables

#### Users
```typescript
User {
  id: String (PK)
  email: String (unique)
  password: String (hashed)
  name: String
  avatar?: String (URL)
  role: USER | STAFF | ADMIN | SUPER_ADMIN
  xp: Int (default: 0)
  tribe?: String (FK)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Quizzes
```typescript
Quiz {
  id: String (PK)
  title: String
  description?: String
  category: String
  timeLimit?: Int (seconds)
  passingScore: Int (default: 50)
  xpReward: Int
  createdBy: String (FK User)
  createdAt: DateTime
  updatedAt: DateTime
}

Question {
  id: String (PK)
  quizId: String (FK Quiz)
  text: String
  options: String[] (JSON)
  correctAnswer: String
  explanation?: String
  points: Int (default: 1)
  order: Int
}

QuizSubmission {
  id: String (PK)
  userId: String (FK User)
  quizId: String (FK Quiz)
  answers: Object (JSON)
  score: Int
  xpEarned: Int
  submittedAt: DateTime
}
```

#### Attendance
```typescript
AttendanceSession {
  id: String (PK)
  eventId: String
  qrCode: String (unique)
  createdBy: String (FK User)
  createdAt: DateTime
  expiresAt: DateTime
}

Attendance {
  id: String (PK)
  userId: String (FK User)
  sessionId: String (FK Session)
  xpEarned: Int
  scannedAt: DateTime
}
```

#### XP & Achievements
```typescript
XpHistory {
  id: String (PK)
  userId: String (FK User)
  amount: Int
  reason: String
  source: "QUIZ" | "ATTENDANCE" | "BONUS" | "MANUAL"
  sourceId?: String
  createdAt: DateTime
}

Tribe {
  id: String (PK)
  name: String
  description?: String
  totalXp: Int
  memberCount: Int
  createdAt: DateTime
}
```

---

## API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Current user

### Quizzes
- `GET /quiz/available` - List available
- `GET /quiz/:id` - Get details
- `POST /quiz/:id/submit` - Submit answers
- `GET /quiz/:id/result` - Get result
- `GET /quiz/submissions` - My submissions
- `POST /quiz` - Create (admin)
- `PUT /quiz/:id` - Update (admin)
- `DELETE /quiz/:id` - Delete (admin)

### Attendance (QR)
- `POST /attendance/scan` - Scan code
- `GET /attendance/sessions` - List sessions
- `POST /attendance/sessions` - Create session (admin)

### XP & Leaderboard
- `GET /xp/history` - User history
- `GET /xp/leaderboard` - Individual rankings
- `GET /xp/tribes` - Team rankings
- `POST /xp/award` - Award XP (admin)

### Sports
- `GET /sports/matches` - List matches
- `GET /sports/matches/:id` - Get match
- `POST /sports/matches` - Create (admin)
- `POST /sports/matches/:id/result` - Record result

### Publications
- `GET /publications` - List all
- `GET /publications/:id` - Get details
- `POST /publications` - Upload (admin)
- `DELETE /publications/:id` - Delete (admin)

### Admin
- `GET /admin/users` - List users
- `PUT /admin/users/:id` - Update user
- `POST /admin/users/:id/role` - Change role
- `GET /admin/analytics` - Analytics
- `GET /admin/reports` - Reports

---

## Key Technologies

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2.1
- **Database**: PostgreSQL 13+
- **ORM**: Prisma 7.8.0
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Hashing**: bcryptjs
- **Rate Limit**: express-rate-limit
- **Docs**: Swagger/OpenAPI

### Frontend (Web)
- **Framework**: React 19.2.6
- **Build**: Vite 8.0.12
- **Language**: TypeScript 6.0.2
- **Routing**: React Router v6
- **HTTP**: Axios
- **State**: React Context + React Query
- **Styles**: Tailwind CSS 4.3.0
- **i18n**: i18next (EN, AR)
- **UI**: Lucide React (icons)
- **Notifications**: React Hot Toast

### Frontend (Mobile)
- **Framework**: React Native 0.85.3
- **Platform**: Expo 56.0.8
- **Language**: TypeScript 6.0.2
- **HTTP**: Axios
- **State**: React Context + React Query
- **QR Scanning**: Expo Barcode Scanner
- **Navigation**: React Navigation 7.2.5
- **i18n**: i18next

### DevOps
- **Hosting**: Replit (deployment)
- **Version Control**: Git/GitHub
- **Package Manager**: npm
- **Build Tools**: Vite, TypeScript

---

## Development Workflow

### 1. Setup
```bash
# Backend
cd backend
npm install
npm run dev  # Start on port 3000

# Web App
cd web-app
npm install
npm run dev  # Start on port 5174

# Admin
cd admin-dashboard
npm install
npm run dev  # Start on port 5173

# Mobile
cd mobile-app
npm install
expo start    # Start on port 8081
```

### 2. Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost/ikigai
JWT_SECRET=your_secret_key
NODE_ENV=development
```

**Web App (.env):**
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Development Commands

**Backend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run test` - Run tests

**Web App:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run type-check` - Check types

**Mobile:**
- `expo start` - Start development
- `expo build` - Build APK/IPA

---

## Deployment Notes

- Backend runs on port 3000
- Web app runs on port 5174
- Admin dashboard runs on port 5173
- Mobile app available via Expo or native builds
- All services connect via REST API
- Database required: PostgreSQL 13+

---

**Last Updated**: June 5, 2026
**Version**: 1.0

