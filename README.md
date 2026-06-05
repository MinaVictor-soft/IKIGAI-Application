# IKIGAI Quest — Gamified Conference Platform

> A full-stack gamified conference engagement platform with admin dashboard, built for youth conferences.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express 5 + TypeScript |
| Database | PostgreSQL 18 + Prisma ORM |
| Frontend (Admin) | React 19 + Vite + Tailwind CSS + TanStack Query |
| Auth | JWT (access + refresh tokens, bcrypt) |
| i18n | Custom bilingual (Arabic/English), RTL support |

---

## Project Structure

```
IKIGAI/
├── backend/                 # Express API server (port 3000)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/       # Admin management endpoints
│   │   │   ├── auth/        # Authentication (register, login, refresh)
│   │   │   ├── attendance/  # QR attendance scanning
│   │   │   ├── bonus/       # Bonus QR generation & claims
│   │   │   ├── quiz/        # Quiz CRUD & submissions
│   │   │   ├── sports/      # Football tournament management
│   │   │   └── xp/          # XP leaderboard & awards
│   │   ├── middleware/      # Auth, validation, error handler
│   │   └── config/         # Swagger, DB config
│   └── prisma/              # Schema & migrations
├── admin-dashboard/         # React admin panel (port 5175)
│   └── src/
│       ├── pages/           # Dashboard, Users, Tribes, Sessions, Quizzes, XP, Bonus, Sports
│       ├── contexts/        # Auth, Language (AR/EN)
│       └── lib/             # API client, router
└── docs/                    # Architecture & design documents
```

---

## Features

### Backend API Modules

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | register, login, refresh, me | JWT-based auth with role-based access |
| **Admin** | 25+ endpoints | Full CRUD for all entities |
| **Sessions** | create, list, edit, status, QR regenerate | Conference session management |
| **Attendance** | scan QR | Idempotent QR-based attendance + auto XP award |
| **Quizzes** | create, questions, submit, status | Quiz engine with scoring & XP |
| **Bonus** | generate QR, claim, staff-award, deactivate | Bonus point distribution system |
| **Sports** | teams, players, matches, events, standings | Full football tournament |
| **XP** | leaderboard (individual + tribes) | XP tracking & rankings |
| **Levels** | CRUD, auto-assign, recalculate | Level progression system |

### Admin Dashboard Pages

| Page | Features |
|------|----------|
| **Dashboard** | Stats overview (users, sessions, attendance, XP, quizzes) |
| **Users** | List/create users, role filter, assign tribe, adjust XP, view activity (sessions/quizzes/bonus per user), bulk delete attendees |
| **Tribes** | Create/edit tribes, color picker, member count, total XP |
| **Sessions** | Create/edit sessions, activate/complete status, QR code display, view attendees list with XP stats |
| **Quizzes** | Create quizzes with questions (MCQ/T-F/Short), activate/close, view submissions & results, per-question stats |
| **XP & Leaderboard** | Individual & tribe leaderboards, award XP to users, levels CRUD with auto-assign, recalculate all |
| **Bonus** | Generate bonus QR codes, deactivate, staff direct award, view claims per QR (who claimed it) |
| **Sports** | Teams (create, roster, add/remove players), matches (schedule, start, complete, events), standings table |

### Cross-Cutting Features

- **Bilingual UI** — Full Arabic/English toggle with RTL support (default: Arabic)
- **All placeholders & labels translated** — Every form, button, empty state, tooltip
- **QR Code Display** — SVG QR codes with high error correction (level H)
- **Real-time data** — TanStack Query with automatic cache invalidation
- **Responsive design** — Tailwind CSS responsive grid
- **Role-based access** — ATTENDEE, STAFF, ADMIN, SUPER_ADMIN

---

## API Routes Summary

### Auth (`/api/v1/auth`)
- `POST /register` — Create attendee account
- `POST /login` — Get access + refresh tokens
- `POST /refresh` — Refresh access token
- `GET /me` — Current user profile

### Admin (`/api/v1/admin`) — Requires STAFF+
- `GET /stats` — Dashboard statistics
- `POST /sessions` — Create session
- `GET /sessions` — List sessions
- `PATCH /sessions/:id` — Edit session
- `PATCH /sessions/:id/status` — Change status
- `POST /sessions/:id/regenerate-qr` — New QR token
- `GET /sessions/:id` — Session detail + attendees
- `POST /users` — Create user
- `GET /users` — List users (filter by role)
- `GET /users/:id` — User detail
- `GET /users/:id/activity` — User's sessions, quizzes, bonus claims
- `PATCH /users/:id/tribe` — Assign tribe
- `PATCH /users/:id/xp` — Adjust XP (add/deduct)
- `DELETE /users/attendees` — Bulk delete (SUPER_ADMIN)
- `GET /bonus/:id/claims` — Who claimed this bonus QR
- `POST /tribes` — Create tribe
- `GET /tribes` — List tribes
- `PATCH /tribes/:id` — Update tribe
- `GET /quizzes` — List all quizzes
- `GET /quizzes/:id` — Quiz detail + submissions
- `DELETE /quizzes/:id/questions/:qId` — Remove question
- `GET /levels` — List levels
- `POST /levels` — Create level
- `PATCH /levels/:id` — Update level
- `DELETE /levels/:id` — Delete level
- `POST /levels/recalculate` — Recalculate all user levels

### Attendance (`/api/v1/attendance`)
- `POST /scan` — Scan session QR (auto awards XP)

### Quizzes (`/api/v1/quizzes`)
- `GET /active` — Active quizzes for attendees
- `GET /:id` — Quiz questions
- `POST /:id/submit` — Submit answers
- `POST /` — Create quiz (admin)
- `POST /:id/questions` — Add question (admin)
- `PATCH /:id/status` — Change status (admin)

### Bonus (`/api/v1/bonus`)
- `POST /claim` — Claim bonus QR
- `POST /generate` — Generate bonus QR (admin)
- `POST /staff-award` — Direct XP award (admin)
- `GET /my-qrs` — List created QRs (admin)
- `PATCH /:id/deactivate` — Deactivate QR (admin)

### Sports (`/api/v1/sports`)
- `GET /teams` — List teams
- `GET /teams/:id` — Team detail + roster
- `POST /teams` — Create team (admin)
- `POST /teams/:id/players` — Add player (admin)
- `DELETE /teams/:id/players/:userId` — Remove player (admin)
- `GET /matches` — List matches
- `GET /matches/:id` — Match detail
- `POST /matches` — Create match (admin)
- `PATCH /matches/:id/start` — Start match (admin)
- `PATCH /matches/:id/complete` — End match with score (admin)
- `POST /matches/:id/events` — Add event (admin)
- `GET /standings` — League standings

### XP (`/api/v1/xp`)
- `GET /leaderboard` — Individual leaderboard
- `GET /tribes` — Tribe leaderboard

---

## Quick Start

```bash
# Backend
cd backend
npm install
npx prisma migrate deploy
npm run dev          # → http://localhost:3000

# Admin Dashboard
cd admin-dashboard
npm install
npm run dev          # → http://localhost:5175
```

### Default Admin Login
```
Email: admin@ikigai.quest
Password: Ikigai@2026
```

---

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://postgres:admin123456@localhost:5432/ikigai
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Frontend (`admin-dashboard/.env`)
```
VITE_API_URL=http://localhost:3000/api/v1
```
