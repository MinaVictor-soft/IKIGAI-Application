# 🎮 IKIGAI Quest - Gamified Conference Platform

> A complete, production-ready gamification platform for engaging conferences, events, and communities. Built with modern tech stack featuring web, mobile, and admin applications with comprehensive engagement features.

**Version**: 1.0.0 | **Status**: Production Ready | **Repository**: [GitHub](https://github.com/MinaVictor-soft/IKIGAI-APP)

---

## 📋 Quick Navigation

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Applications](#applications)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Development](#development)
- [Contributing](#contributing)

---

## 🎯 Overview

IKIGAI Quest is a comprehensive gamification platform that transforms passive conference attendance into an engaging experience through:

- 🎮 **Gamification Elements** - XP system, levels, achievements, leaderboards
- 📱 **Multi-Platform** - Web (React), Mobile (React Native), Admin Dashboard
- 🌍 **Internationalization** - Full Arabic & English support with RTL
- 🔐 **Enterprise Security** - JWT authentication, role-based access, audit logging
- ⚡ **High Performance** - Optimized React, Vite build, PostgreSQL with Prisma
- 📊 **Analytics** - Comprehensive metrics, engagement tracking, reporting

**Key Metrics:**
- 4 Applications (Backend API + Web + Mobile + Admin)
- 30+ REST API Endpoints
- 6 Backend Modules
- 11 Web Pages + 14 Mobile Screens
- 149 Committed Files
- 18,500+ Words of Documentation
- 100% Feature Parity Web/Mobile

---

## ✨ Complete Feature List

### 🎮 User Engagement Features

**Quiz System**
- Create and publish interactive quizzes
- Multiple question types (multiple choice, true/false, short answer)
- Real-time scoring and immediate feedback
- XP rewards based on performance
- Time-limited quiz sessions
- Previous attempt detection
- Detailed results and explanations

**Attendance Tracking**
- QR code-based attendance system
- GPS location verification
- Automated XP rewards
- Session scheduling and management
- Attendance history and analytics
- Daily/weekly/monthly reporting

**Leaderboard & Rankings**
- Individual user rankings by XP
- Team/Tribe leaderboards
- Real-time rank updates
- Medal system (🥇 🥈 🥉)
- Historical rankings
- Seasonal competitions

**Sports Tournaments**
- Match creation and scheduling
- Live score updates
- Team standings and statistics
- Player performance tracking
- Historical match records
- Tournament management

**Publications & Content**
- Article publishing system
- Content categorization
- PDF downloads
- View/download tracking
- Featured content
- Search and filtering

**Tribes/Teams**
- Group users into teams
- Team-based competitions
- Team leaderboards
- Member management
- Team statistics
- Collective achievements

**Events & Sessions**
- Event scheduling
- Session management
- Automatic QR generation
- Time-based activation
- Attendance verification
- Event analytics

**Achievements & Badges**
- XP-based leveling system
- Achievement unlocking
- Badge system
- Milestone tracking
- Level progression

### 🛠️ Admin Features

**User Management**
- Create/edit/delete users
- Bulk user operations
- Role assignment (USER, STAFF, ADMIN, SUPER_ADMIN)
- Tribe assignment
- Status management (active, inactive, suspended)
- XP adjustments
- User activity tracking

**Quiz Management**
- Quiz creation wizard
- Question bank management
- Quiz publishing/archiving
- Submission analytics
- Performance metrics
- Difficulty adjustment
- Bulk quiz operations

**Event Management**
- Session creation and scheduling
- QR code generation and management
- Attendance tracking
- Event cancellation/rescheduling
- Session analytics
- Batch event creation

**Sports Management**
- Tournament setup and management
- Match creation and updates
- Score management
- Team standings
- Player statistics
- Match analytics

**Content Management**
- Publication creation/editing
- Category management
- Featured content selection
- Media uploads
- Draft/publish workflow
- Content deletion

**Analytics Dashboard**
- User metrics (active users, growth, retention)
- Quiz analytics (completion rates, scores, difficulty)
- Event analytics (attendance, engagement)
- Sports analytics (match stats, team performance)
- XP distribution
- Engagement trends
- Custom reports

**System Configuration**
- Platform settings
- Email configuration
- API settings
- Security settings
- Database backups
- Audit logging

### 🔐 Technical Features

**Authentication & Security**
- JWT token-based authentication
- Refresh token mechanism
- bcryptjs password hashing
- Role-based access control (RBAC)
- Rate limiting on sensitive endpoints
- CORS configuration
- Password reset flow
- Email verification

**Internationalization**
- English and Arabic support
- RTL (right-to-left) layout
- Language context switching
- Translated UI elements
- Localized content

**Data Management**
- PostgreSQL database
- Prisma ORM with auto-migrations
- Database seeding
- Backup strategies
- Data audit trails
- Pagination support
- Search and filtering

**Performance**
- Vite build optimization (401 KB gzip)
- Lazy loading of components
- Image optimization
- API response caching
- Database query optimization
- Request rate limiting

---

## 🛠️ Complete Tech Stack

### Backend Services

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18+ | JavaScript execution |
| Framework | Express | 5.2.1 | Web framework |
| Language | TypeScript | 6.0.2 | Type safety |
| Database | PostgreSQL | 13+ | Data persistence |
| ORM | Prisma | 7.8.0 | Database abstraction |
| Auth | JWT + bcryptjs | - | Authentication |
| Validation | Zod | Latest | Input validation |
| API Docs | Swagger | 3.0 | API documentation |
| Logging | Winston/Pino | - | Application logging |
| Rate Limit | express-rate-limit | - | Rate limiting |

### Frontend - Web Application

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.2.6 | UI library |
| Build Tool | Vite | 8.0.12 | Build bundler |
| Language | TypeScript | 6.0.2 | Type safety |
| Styling | Tailwind CSS | 4.3.0 | Utility CSS |
| UI Components | Lucide React | - | Icons & components |
| State | React Context | - | State management |
| HTTP | Axios | - | API calls |
| i18n | i18next | - | Internationalization |
| Routing | React Router | 6.x | Client routing |

### Frontend - Mobile Application

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React Native | 0.85.3 | Mobile framework |
| Platform | Expo | 56.0.8 | Development platform |
| Language | TypeScript | 6.0.2 | Type safety |
| Navigation | React Navigation | 6.x | Screen navigation |
| Icons | Ionicons | - | Mobile icons |
| Camera | Expo Camera | - | QR scanning |
| Storage | AsyncStorage | - | Local storage |
| HTTP | Axios | - | API calls |
| i18n | i18next | - | Internationalization |

### Admin Dashboard

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.2.6 | UI library |
| Build Tool | Vite | 8.0.12 | Build bundler |
| Language | TypeScript | 6.0.2 | Type safety |
| Styling | Tailwind CSS | 4.3.0 | Utility CSS |
| State | React Context | - | State management |
| HTTP | Axios | - | API calls |
| i18n | i18next | - | Internationalization |

### DevOps & Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Version Control | Git & GitHub | Code management |
| Package Manager | npm | Dependency management |
| Database Host | PostgreSQL | Data storage |
| API Server Host | Node.js | Backend hosting |
| Frontend Host | Vite/nginx | Static hosting |
| Container | Docker (optional) | Containerization |
| CI/CD | GitHub Actions | Automation |

---

## 📁 Complete Project Structure

```
IKIGAI-APP/
│
├── 📁 backend/                          # REST API Server
│   ├── src/
│   │   ├── app.ts                       # Express app setup
│   │   │
│   │   ├── modules/                     # API modules
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts   # Login, register, refresh
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.types.ts
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── quiz.controller.ts
│   │   │   │   ├── quiz.routes.ts
│   │   │   │   ├── quiz.service.ts
│   │   │   │   └── quiz.types.ts
│   │   │   │
│   │   │   ├── attendance/              # QR scanning & sessions
│   │   │   │   ├── attendance.controller.ts
│   │   │   │   ├── attendance.routes.ts
│   │   │   │   ├── attendance.service.ts
│   │   │   │   └── attendance.types.ts
│   │   │   │
│   │   │   ├── xp/                      # Leaderboard & XP
│   │   │   │   ├── xp.controller.ts
│   │   │   │   ├── xp.routes.ts
│   │   │   │   ├── xp.service.ts
│   │   │   │   └── xp.types.ts
│   │   │   │
│   │   │   ├── sports/                  # Tournaments & matches
│   │   │   │   ├── sports.controller.ts
│   │   │   │   ├── sports.routes.ts
│   │   │   │   ├── sports.service.ts
│   │   │   │   └── sports.types.ts
│   │   │   │
│   │   │   ├── publications/            # Articles & content
│   │   │   │   ├── publications.controller.ts
│   │   │   │   ├── publications.routes.ts
│   │   │   │   ├── publications.service.ts
│   │   │   │   └── publications.types.ts
│   │   │   │
│   │   │   ├── admin/                   # Admin operations
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── admin.service.ts
│   │   │   │   └── admin.types.ts
│   │   │   │
│   │   │   └── bonus/                   # Bonus features
│   │   │       ├── bonus.controller.ts
│   │   │       ├── bonus.routes.ts
│   │   │       └── bonus.service.ts
│   │   │
│   │   ├── middleware/                  # Express middleware
│   │   │   ├── auth.ts                  # JWT verification
│   │   │   ├── errorHandler.ts          # Error handling
│   │   │   ├── rateLimiter.ts           # Rate limiting
│   │   │   ├── validate.ts              # Input validation
│   │   │   └── upload.ts                # File uploads
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts              # PostgreSQL config
│   │   │   ├── env.ts                   # Environment variables
│   │   │   └── swagger.ts               # API documentation
│   │   │
│   │   ├── types/                       # TypeScript interfaces
│   │   │   └── index.ts
│   │   │
│   │   └── utils/
│   │       ├── asyncHandler.ts
│   │       ├── response.ts              # Standard response format
│   │       ├── params.ts
│   │       └── audit.ts                 # Audit logging
│   │
│   ├── prisma/
│   │   ├── schema.prisma                # Database schema (18 tables)
│   │   ├── seed.ts                      # Sample data
│   │   ├── migrations/                  # Database migrations
│   │   └── .env.example
│   │
│   ├── uploads/                         # User uploads directory
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── 📁 web-app/                          # React Web Application
│   ├── src/
│   │   ├── App.tsx                      # Main router
│   │   ├── main.tsx                     # Entry point
│   │   ├── index.css                    # Global styles
│   │   │
│   │   ├── pages/                       # Page components (11 pages)
│   │   │   ├── HomePage.tsx             # Dashboard
│   │   │   ├── LoginPage.tsx            # Authentication
│   │   │   ├── RegisterPage.tsx         # Sign up
│   │   │   ├── ProfilePage.tsx          # User profile
│   │   │   ├── EventsPage.tsx           # Events listing
│   │   │   ├── LibraryPage.tsx          # Publications
│   │   │   ├── QuizzesPage.tsx          # Quiz list
│   │   │   ├── QuizPlayPage.tsx         # Quiz interface (NEW)
│   │   │   ├── LeaderboardPage.tsx      # Rankings (NEW)
│   │   │   ├── ScannerPage.tsx          # QR scanning (3 modes)
│   │   │   ├── SportsPage.tsx           # Tournaments
│   │   │   └── InfoPage.tsx             # Help & info
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.tsx              # Navigation
│   │   │   ├── Header.tsx               # Top bar
│   │   │   ├── Footer.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...other components
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx          # Auth state
│   │   │   └── LangContext.tsx          # Language/theme
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                   # Axios API client
│   │   │
│   │   ├── i18n/
│   │   │   ├── i18n.ts
│   │   │   └── locales/
│   │   │       ├── en.json              # English translations
│   │   │       └── ar.json              # Arabic translations
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── public/                          # Static assets
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── 📁 admin-dashboard/                  # React Admin Panel
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx        # Main dashboard
│   │   │   ├── UsersPage.tsx            # User management
│   │   │   ├── QuizzesPage.tsx          # Quiz management
│   │   │   ├── SessionsPage.tsx         # Event management
│   │   │   ├── EventsPage.tsx
│   │   │   ├── SportsPage.tsx           # Tournament management
│   │   │   ├── PublicationsPage.tsx     # Content management
│   │   │   ├── TribesPage.tsx           # Team management
│   │   │   ├── BonusPage.tsx            # Bonus management
│   │   │   ├── LevelsPage.tsx           # Level configuration
│   │   │   ├── LoginPage.tsx            # Admin login
│   │   │   └── AnalyticsPage.tsx        # Reports & analytics
│   │   │
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   └── lib/
│   │
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── 📁 mobile-app/                       # React Native Mobile App
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.ts
│   │   │
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx         # React Navigation setup
│   │   │
│   │   ├── screens/                     # Mobile screens (14 screens)
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EventsScreen.tsx
│   │   │   ├── LibraryScreen.tsx
│   │   │   ├── QuizListScreen.tsx
│   │   │   ├── QuizPlayScreen.tsx
│   │   │   ├── LeaderboardScreen.tsx
│   │   │   ├── ScannerScreen.tsx        # Native QR camera
│   │   │   ├── SportsScreen.tsx
│   │   │   ├── InfoScreen.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ConferenceHeader.tsx
│   │   │   ├── ConferenceFooter.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── ...more components
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── LangContext.tsx
│   │   │   └── ViewedContext.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useApi.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── i18n/
│   │   │   └── translations.ts
│   │   │
│   │   ├── config/
│   │   │   └── constants.ts
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── assets/                          # Images, fonts, etc
│   ├── app.json                         # Expo config
│   ├── eas.json                         # EAS build config
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── 📁 docs/                             # Comprehensive Documentation
│   ├── README.md                        # Documentation index
│   ├── API_ENDPOINTS_REFERENCE.md       # Complete API docs (30+ endpoints)
│   ├── ADMIN_DASHBOARD_COMPLETE_GUIDE.md # Admin operations guide
│   ├── DATABASE_SCHEMA_COMPLETE.md      # Database design & tables
│   ├── BUSINESS_GUIDE.md / .docx        # User & admin guide (5000+ words)
│   ├── CODE_STRUCTURE.md / .docx        # Architecture (4000+ words)
│   ├── TECHNICAL_DETAILS.md / .docx     # Implementation (5000+ words)
│   ├── DEPLOYMENT_REPLIT.md / .docx     # Deploy guide (4500+ words)
│   ├── IKIGAI_Quest_Product_Plan.md
│   ├── Security_Architecture.md
│   └── ...more documentation
│
├── .github/
│   └── workflows/                       # CI/CD workflows (optional)
│       └── build.yml
│
├── .gitignore
├── .env.example
├── .env.local.example
├── package.json                         # Root workspace config
├── README.md                            # This file
├── README_COMPLETE.md                   # Detailed README
├── GIT_PUSH_INSTRUCTIONS.md             # Git workflow guide
├── FILE_REFERENCE.md                    # Quick file reference
└── IMPLEMENTATION_COMPLETE.md           # Session summary

```

---

## 🚀 Quick Start

### ⚡ Deploy to Replit (30 seconds, Zero Configuration)

Want to get started immediately without installing anything locally?

**[👉 See QUICK_START.md for One-Click Replit Deployment 👈](QUICK_START.md)**

Just:
1. Go to https://replit.com
2. Import from GitHub: `https://github.com/MinaVictor-soft/IKIGAI-APP`
3. Click **Run**
4. Done! ✅ App runs automatically

---

### Local Development Setup

#### Prerequisites
```
Node.js 18+
PostgreSQL 13+
npm or yarn
Git
```

### 1. Clone Repository
```bash
git clone https://github.com/MinaVictor-soft/IKIGAI-APP.git
cd IKIGAI-APP
```

### 2. Install All Dependencies
```bash
npm install

cd backend && npm install && cd ..
cd web-app && npm install && cd ..
cd admin-dashboard && npm install && cd ..
cd mobile-app && npm install && cd ..
```

### 3. Setup Environment Variables

**backend/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ikigai_quest
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
PORT=3000
```

**web-app/.env.local**
```env
VITE_API_URL=http://localhost:3000/api
```

**admin-dashboard/.env.local**
```env
VITE_API_URL=http://localhost:3000/api
```

**mobile-app/.env**
```env
REACT_APP_API_URL=http://localhost:3000/api
```

### 4. Setup Database
```bash
cd backend
npx prisma db push
npx prisma db seed
cd ..
```

### 5. Start Development Servers

**Terminal 1: Backend**
```bash
cd backend && npm run dev
# Runs on http://localhost:3000
# API: http://localhost:3000/api
# Swagger: http://localhost:3000/api-docs
```

**Terminal 2: Web App**
```bash
cd web-app && npm run dev
# Runs on http://127.0.0.1:5174
```

**Terminal 3: Admin Dashboard**
```bash
cd admin-dashboard && npm run dev
# Runs on http://localhost:5173
```

**Terminal 4: Mobile App**
```bash
cd mobile-app && expo start
# Runs on http://localhost:8081
```

---

## 📱 Applications

### Web Application
- **Port:** 5174
- **Build Size:** 401 KB JS (127 KB gzip)
- **Pages:** 11
- **Features:** Full user engagement platform
- **Tech:** React 19 + Vite + TypeScript

**Commands:**
```bash
npm run dev          # Development
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

### Mobile Application
- **Platform:** iOS & Android via Expo
- **Screens:** 14
- **Special:** Native QR camera, offline support
- **Tech:** React Native 0.85 + Expo 56

**Commands:**
```bash
expo start           # Start dev
eas build            # Build for app stores
expo publish         # Publish to Expo
```

### Admin Dashboard
- **Port:** 5173
- **Purpose:** Platform management
- **Pages:** 12
- **Tech:** React 19 + Vite

**Commands:**
```bash
npm run dev          # Development
npm run build        # Production build
```

### Backend API
- **Port:** 3000
- **Endpoints:** 30+
- **Modules:** 6
- **Tech:** Express + TypeScript + PostgreSQL

**Commands:**
```bash
npm run dev          # Development with nodemon
npm run build        # Build TypeScript
npm start            # Production
npm run seed         # Seed database
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
```

### User Endpoints
```
GET    /users/me
PATCH  /users/me
GET    /users (admin)
POST   /users (admin)
PATCH  /users/:id (admin)
DELETE /users/:id (admin)
```

### Quiz Endpoints
```
GET    /quiz/available
GET    /quiz/:id
POST   /quiz/:id/submit
GET    /quiz/:id/result
GET    /quiz/my-submissions
POST   /quiz (admin)
PATCH  /quiz/:id (admin)
DELETE /quiz/:id (admin)
```

### XP & Leaderboard
```
GET    /xp/leaderboard
GET    /xp/tribes
GET    /xp/history
GET    /xp/my-stats
```

### Attendance
```
POST   /attendance/scan
GET    /attendance/active
GET    /attendance/my-attendance
POST   /attendance/sessions (staff)
GET    /attendance/sessions (staff)
```

### Sports
```
GET    /sports/matches
GET    /sports/matches/:id
POST   /sports/matches (admin)
PATCH  /sports/matches/:id (admin)
```

### Publications
```
GET    /publications
GET    /publications/:id
POST   /publications (admin)
PATCH  /publications/:id (admin)
DELETE /publications/:id (admin)
```

**Full API Reference:** See `docs/API_ENDPOINTS_REFERENCE.md`

---

## 📚 Complete Documentation

All documentation is in the `docs/` folder:

| Document | Purpose | Format | Size |
|----------|---------|--------|------|
| **API_ENDPOINTS_REFERENCE.md** | 30+ endpoints, all methods | MD | 24 KB |
| **ADMIN_DASHBOARD_COMPLETE_GUIDE.md** | Admin operations | MD | 35 KB |
| **DATABASE_SCHEMA_COMPLETE.md** | 18 tables, relationships | MD | 28 KB |
| **BUSINESS_GUIDE** | User & admin guide | MD + DOCX | 15 KB |
| **CODE_STRUCTURE** | Architecture | MD + DOCX | 14 KB |
| **TECHNICAL_DETAILS** | Implementation | MD + DOCX | 16 KB |
| **DEPLOYMENT_REPLIT** | Deploy guide | MD + DOCX | 13 KB |

**Total:** 18,500+ words, 8 main documents

---

## 🚀 Deployment

### Deploy to Replit

1. Create account at https://replit.com
2. Import repository
3. Set environment variables
4. Run migrations
5. Start server

**See:** `docs/DEPLOYMENT_REPLIT.md` for complete guide

### Deploy to Vercel (Web App)

```bash
npm install -g vercel
vercel
```

### Deploy to Heroku (Backend)

```bash
heroku login
heroku create ikigai-api
git push heroku main
```

### Docker Deployment

```bash
docker build -t ikigai-backend ./backend
docker run -p 3000:3000 ikigai-backend
```

---

## 🔧 Development

### Code Structure Best Practices

- **Backend:** Modular architecture with service layer
- **Frontend:** Component-based with custom hooks
- **Mobile:** Screen-based navigation with shared components
- **Admin:** Page-based dashboard with layouts

### Testing

```bash
# Backend
cd backend && npm test

# Web App
cd web-app && npm test

# Admin Dashboard
cd admin-dashboard && npm test

# Mobile
cd mobile-app && npm test
```

### Linting & Formatting

```bash
# Backend
npm run lint
npm run format

# Web App
npm run lint

# All
npm run lint:all
```

---

## 📝 Git Workflow

### Clone
```bash
git clone https://github.com/MinaVictor-soft/IKIGAI-APP.git
```

### Create Feature Branch
```bash
git checkout -b feature/new-feature
```

### Commit Changes
```bash
git add .
git commit -m "feat: Add new feature"
```

### Push & Pull Request
```bash
git push origin feature/new-feature
# Create PR on GitHub
```

### Merge
```bash
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
```

**See:** `GIT_PUSH_INSTRUCTIONS.md` for detailed workflow

---

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- Use TypeScript strictly
- Follow ESLint rules
- Add comments for complex logic
- Write unit tests
- Keep components small and focused

### Commit Messages

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Reorganize code
test: Add tests
chore: Update dependencies
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Files | 149 |
| Applications | 4 |
| Backend Endpoints | 30+ |
| Backend Modules | 6 |
| Web Pages | 11 |
| Mobile Screens | 14 |
| Admin Pages | 12 |
| Database Tables | 18 |
| Documentation Files | 14 |
| Total Lines of Code | 2,000+ |
| Documentation Words | 18,500+ |
| Languages Supported | 2 (EN, AR) |

---

## 🆘 Troubleshooting

### Backend Issues

**Cannot connect to database**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Run: npx prisma db push
```

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Web App Issues

**Module not found**
```bash
cd web-app
npm install
npm run dev
```

**Build fails**
```bash
npm run type-check
# Fix TypeScript errors
npm run build
```

### Mobile Issues

**Expo not working**
```bash
npm install -g expo-cli
expo start --clear
```

---

## 📞 Support & Contact

- **GitHub Issues:** [Report bugs](https://github.com/MinaVictor-soft/IKIGAI-APP/issues)
- **Discussions:** [Ask questions](https://github.com/MinaVictor-soft/IKIGAI-APP/discussions)
- **Email:** support@ikigai-quest.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ for engaging conferences and events

---

**Last Updated:** June 5, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

