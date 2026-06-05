# 🗄️ Database Schema Documentation

**Complete PostgreSQL database structure for IKIGAI Quest**

---

## 📋 Table of Contents

- [Database Overview](#database-overview)
- [Core Tables](#core-tables)
- [Quiz System](#quiz-system)
- [Attendance System](#attendance-system)
- [XP & Leaderboard](#xp--leaderboard)
- [Sports System](#sports-system)
- [Publications System](#publications-system)
- [Relationships Diagram](#relationships-diagram)

---

## 🗄️ Database Overview

**Database Type:** PostgreSQL 13+  
**ORM:** Prisma 7.8.0  
**Schema Version:** 1.0  
**Total Tables:** 18  
**Primary Key Pattern:** UUID  
**Timestamps:** createdAt (CURRENT_TIMESTAMP), updatedAt (auto-update)

### Database Connection

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Example CONNECTION_STRING
```
postgresql://user:password@localhost:5432/ikigai_quest
```

---

## 👥 Core Tables

### User Table

**Purpose:** Store user account information and profile data

```sql
CREATE TABLE "User" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 VARCHAR(255) UNIQUE NOT NULL,
  name                  VARCHAR(255) NOT NULL,
  password              VARCHAR(255) NOT NULL,
  phone                 VARCHAR(20),
  role                  ENUM('USER','STAFF','ADMIN','SUPER_ADMIN') DEFAULT 'USER',
  status                ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
  avatar                TEXT,
  bio                   TEXT,
  xp                    INTEGER DEFAULT 0,
  level                 INTEGER DEFAULT 1,
  tribeId               UUID REFERENCES "Tribe"(id),
  lastLoginAt           TIMESTAMP,
  emailVerified         BOOLEAN DEFAULT false,
  emailVerifiedAt       TIMESTAMP,
  passwordResetToken    VARCHAR(255),
  passwordResetExpires  TIMESTAMP,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);
CREATE INDEX idx_user_tribe ON "User"("tribeId");
```

**Fields Explanation:**

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| email | VARCHAR | User email (unique) |
| password | VARCHAR | Hashed password (bcryptjs) |
| role | ENUM | Permission level |
| xp | INTEGER | Total experience points |
| level | INTEGER | Calculated from XP |
| tribeId | UUID | Team/group assignment |

---

### Tribe Table

**Purpose:** Group users into teams/tribes for team competitions

```sql
CREATE TABLE "Tribe" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255) NOT NULL,
  description           TEXT,
  icon                  TEXT,
  color                 VARCHAR(7),
  totalXp               INTEGER DEFAULT 0,
  memberCount           INTEGER DEFAULT 0,
  level                 INTEGER DEFAULT 1,
  createdBy             UUID REFERENCES "User"(id),
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tribe_name ON "Tribe"(name);
CREATE INDEX idx_tribe_totalXp ON "Tribe"("totalXp" DESC);
```

**Sample Data:**
```
id: uuid-1, name: "Team A", totalXp: 50000, memberCount: 25
id: uuid-2, name: "Team B", totalXp: 45000, memberCount: 22
id: uuid-3, name: "Team C", totalXp: 42000, memberCount: 20
```

---

## 📚 Quiz System

### Quiz Table

**Purpose:** Store quiz metadata and configuration

```sql
CREATE TABLE "Quiz" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 VARCHAR(255) NOT NULL,
  description           TEXT,
  category              VARCHAR(100),
  difficulty            ENUM('EASY','MEDIUM','HARD'),
  timeLimit             INTEGER,
  totalQuestions        INTEGER DEFAULT 0,
  xpReward              INTEGER DEFAULT 100,
  passingScore          INTEGER DEFAULT 60,
  image                 TEXT,
  status                ENUM('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',
  createdBy             UUID REFERENCES "User"(id) NOT NULL,
  publishedAt           TIMESTAMP,
  archivedAt            TIMESTAMP,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_status ON "Quiz"(status);
CREATE INDEX idx_quiz_category ON "Quiz"(category);
CREATE INDEX idx_quiz_createdBy ON "Quiz"("createdBy");
```

**Fields:**

| Field | Type | Note |
|-------|------|------|
| timeLimit | INTEGER | Seconds (e.g., 600 = 10 minutes) |
| xpReward | INTEGER | XP earned on completion |
| passingScore | INTEGER | % required to pass |
| status | ENUM | Draft/Published/Archived |

---

### Question Table

**Purpose:** Store individual quiz questions

```sql
CREATE TABLE "Question" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quizId                UUID REFERENCES "Quiz"(id) NOT NULL,
  question              TEXT NOT NULL,
  type                  ENUM('MULTIPLE_CHOICE','TRUE_FALSE','SHORT_ANSWER'),
  options               JSONB,
  correctAnswer         VARCHAR(255) NOT NULL,
  explanation           TEXT,
  order                 INTEGER NOT NULL,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_quiz ON "Question"("quizId");
CREATE INDEX idx_question_order ON "Question"("order");
```

**Options JSONB Structure:**
```json
[
  "Option A",
  "Option B", 
  "Option C",
  "Option D"
]
```

---

### QuizSubmission Table

**Purpose:** Track user quiz attempts and scores

```sql
CREATE TABLE "QuizSubmission" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quizId                UUID REFERENCES "Quiz"(id) NOT NULL,
  userId                UUID REFERENCES "User"(id) NOT NULL,
  score                 INTEGER NOT NULL,
  maxScore              INTEGER NOT NULL,
  percentage            DECIMAL(5,2) NOT NULL,
  passed                BOOLEAN NOT NULL,
  xpAwarded             INTEGER DEFAULT 0,
  timeSpent             INTEGER,
  answers               JSONB NOT NULL,
  submittedAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submission_user ON "QuizSubmission"("userId");
CREATE INDEX idx_submission_quiz ON "QuizSubmission"("quizId");
CREATE INDEX idx_submission_submitted ON "QuizSubmission"("submittedAt" DESC);
CREATE UNIQUE INDEX idx_submission_unique ON "QuizSubmission"("quizId", "userId");
```

**Answers JSONB:**
```json
[
  {
    "questionId": "uuid",
    "answer": "Option B",
    "isCorrect": true
  }
]
```

---

## 📍 Attendance System

### AttendanceSession Table

**Purpose:** Schedule attendance tracking sessions with QR codes

```sql
CREATE TABLE "AttendanceSession" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255) NOT NULL,
  description           TEXT,
  location              VARCHAR(255),
  qrCode                VARCHAR(255) UNIQUE NOT NULL,
  qrCodeData            TEXT,
  startTime             TIMESTAMP NOT NULL,
  endTime               TIMESTAMP NOT NULL,
  xpReward              INTEGER DEFAULT 50,
  createdBy             UUID REFERENCES "User"(id) NOT NULL,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_qrcode ON "AttendanceSession"("qrCode");
CREATE INDEX idx_session_starttime ON "AttendanceSession"("startTime");
CREATE INDEX idx_session_createdby ON "AttendanceSession"("createdBy");
```

---

### Attendance Table

**Purpose:** Record individual attendance scans

```sql
CREATE TABLE "Attendance" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionId             UUID REFERENCES "AttendanceSession"(id) NOT NULL,
  userId                UUID REFERENCES "User"(id) NOT NULL,
  latitude              DECIMAL(10,8),
  longitude             DECIMAL(11,8),
  scannedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendance_session ON "Attendance"("sessionId");
CREATE INDEX idx_attendance_user ON "Attendance"("userId");
CREATE INDEX idx_attendance_scannedat ON "Attendance"("scannedAt" DESC);
CREATE UNIQUE INDEX idx_attendance_unique ON "Attendance"("sessionId", "userId");
```

**Coordinates:**
- latitude: -90 to +90 (North/South)
- longitude: -180 to +180 (East/West)

---

## 🏆 XP & Leaderboard

### XpHistory Table

**Purpose:** Audit trail of all XP earned/deducted

```sql
CREATE TABLE "XpHistory" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId                UUID REFERENCES "User"(id) NOT NULL,
  xpAmount              INTEGER NOT NULL,
  sourceType            ENUM('QUIZ','SESSION','ACTIVITY','BONUS','ADJUSTMENT'),
  sourceId              UUID,
  description           VARCHAR(255),
  before                INTEGER,
  after                 INTEGER,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_xphistory_user ON "XpHistory"("userId");
CREATE INDEX idx_xphistory_source ON "XpHistory"("sourceType");
CREATE INDEX idx_xphistory_createdat ON "XpHistory"("createdAt" DESC);
```

**XP Source Types:**

| Type | Example | Amount |
|------|---------|--------|
| QUIZ | Quiz completion | 50-200 |
| SESSION | Attendance scan | 50 |
| ACTIVITY | First login day | 10 |
| BONUS | Streak reward | 25-100 |
| ADJUSTMENT | Manual admin | Variable |

---

### Level Configuration

**Level Calculation:**
```
Level 1: 0 - 499 XP
Level 2: 500 - 1,499 XP
Level 3: 1,500 - 3,499 XP
Level 4: 3,500 - 6,499 XP
Level 5: 6,500 - 11,499 XP
Level 6: 11,500 - 19,999 XP
Level 7: 20,000 - 32,999 XP
Level 8: 33,000+ XP
```

---

## ⚽ Sports System

### SportsMatch Table

**Purpose:** Schedule and track sports matches

```sql
CREATE TABLE "SportsMatch" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 VARCHAR(255) NOT NULL,
  sport                 ENUM('FOOTBALL','CRICKET','VOLLEYBALL','BASKETBALL'),
  homeTeamId            UUID REFERENCES "Tribe"(id) NOT NULL,
  awayTeamId            UUID REFERENCES "Tribe"(id) NOT NULL,
  homeScore             INTEGER,
  awayScore             INTEGER,
  status                ENUM('SCHEDULED','LIVE','COMPLETED','CANCELLED'),
  startTime             TIMESTAMP NOT NULL,
  endTime               TIMESTAMP,
  venue                 VARCHAR(255),
  description           TEXT,
  image                 TEXT,
  highlightsUrl         TEXT,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_match_sport ON "SportsMatch"(sport);
CREATE INDEX idx_match_status ON "SportsMatch"(status);
CREATE INDEX idx_match_starttime ON "SportsMatch"("startTime");
```

---

### MatchPlayers Table

**Purpose:** Track player participation in matches

```sql
CREATE TABLE "MatchPlayer" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matchId               UUID REFERENCES "SportsMatch"(id) NOT NULL,
  userId                UUID REFERENCES "User"(id) NOT NULL,
  team                  ENUM('HOME','AWAY') NOT NULL,
  goals                 INTEGER DEFAULT 0,
  assists               INTEGER DEFAULT 0,
  yellowCards           INTEGER DEFAULT 0,
  redCards              INTEGER DEFAULT 0,
  minutesPlayed         INTEGER DEFAULT 0,
  rating                DECIMAL(3,1),
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matchplayer_match ON "MatchPlayer"("matchId");
CREATE INDEX idx_matchplayer_user ON "MatchPlayer"("userId");
```

---

## 📰 Publications

### Publication Table

**Purpose:** Store articles, news, and content

```sql
CREATE TABLE "Publication" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 VARCHAR(255) NOT NULL,
  slug                  VARCHAR(255) UNIQUE,
  content               TEXT NOT NULL,
  category              VARCHAR(100),
  image                 TEXT,
  pdf                   TEXT,
  author                UUID REFERENCES "User"(id) NOT NULL,
  featured              BOOLEAN DEFAULT false,
  status                ENUM('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',
  views                 INTEGER DEFAULT 0,
  downloads             INTEGER DEFAULT 0,
  publishedAt           TIMESTAMP,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_publication_status ON "Publication"(status);
CREATE INDEX idx_publication_category ON "Publication"(category);
CREATE INDEX idx_publication_author ON "Publication"("author");
CREATE INDEX idx_publication_views ON "Publication"(views DESC);
```

---

## 🔐 System Tables

### AuditLog Table

**Purpose:** Track all system changes for security

```sql
CREATE TABLE "AuditLog" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId                UUID REFERENCES "User"(id),
  action                VARCHAR(100) NOT NULL,
  entity                VARCHAR(100),
  entityId              UUID,
  changes               JSONB,
  ipAddress             VARCHAR(45),
  userAgent             TEXT,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditlog_user ON "AuditLog"("userId");
CREATE INDEX idx_auditlog_entity ON "AuditLog"(entity);
CREATE INDEX idx_auditlog_createdat ON "AuditLog"("createdAt" DESC);
```

---

### PasswordReset Table

**Purpose:** Store password reset tokens

```sql
CREATE TABLE "PasswordReset" (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId                UUID REFERENCES "User"(id) NOT NULL,
  token                 VARCHAR(255) UNIQUE NOT NULL,
  expiresAt             TIMESTAMP NOT NULL,
  usedAt                TIMESTAMP,
  createdAt             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_passwordreset_token ON "PasswordReset"(token);
CREATE INDEX idx_passwordreset_expiresat ON "PasswordReset"("expiresAt");
```

---

## 📊 Relationships Diagram

```
User (1) ──→ (Many) Tribe
User (1) ──→ (Many) Quiz (created)
User (1) ──→ (Many) QuizSubmission
User (1) ──→ (Many) Attendance
User (1) ──→ (Many) XpHistory
User (1) ──→ (Many) Publication
User (1) ──→ (Many) AttendanceSession (created)
User (1) ──→ (Many) MatchPlayer

Tribe (1) ──→ (Many) User
Tribe (1) ──→ (Many) SportsMatch (home)
Tribe (1) ──→ (Many) SportsMatch (away)

Quiz (1) ──→ (Many) Question
Quiz (1) ──→ (Many) QuizSubmission

Question (1) ──→ (Many) (referenced in QuizSubmission)

AttendanceSession (1) ──→ (Many) Attendance

SportsMatch (1) ──→ (Many) MatchPlayer
```

---

## 🔧 Database Maintenance

### Backup Strategy

```sql
-- Daily backup at 2 AM
pg_dump ikigai_quest > backup_$(date +%Y%m%d).sql

-- Full restore
psql ikigai_quest < backup_20260605.sql
```

### Index Optimization

```sql
-- Check unused indexes
SELECT indexname FROM pg_indexes 
WHERE idx_scan = 0 AND indexname NOT LIKE 'pg_%';

-- Analyze table
ANALYZE "User";

-- Reindex if needed
REINDEX TABLE "User";
```

### Query Performance

**Slow Query Log:**
```sql
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

---

## 📈 Data Volume Estimates

| Table | Rows (Year 1) | Size (GB) |
|-------|--------------|-----------|
| User | 10,000 | 0.5 |
| Quiz | 200 | 0.01 |
| QuizSubmission | 100,000 | 2.0 |
| Attendance | 50,000 | 1.0 |
| XpHistory | 200,000 | 2.0 |
| Publication | 500 | 1.0 |
| AuditLog | 500,000 | 5.0 |
| **Total** | **~860,000** | **~11.5 GB** |

---

## 🔒 Data Security

### Sensitive Data Encryption

```sql
-- Passwords (bcryptjs salt rounds: 10)
-- Always use parameterized queries

-- Example (Node.js):
const hash = await bcrypt.hash(password, 10);

-- SSN, phone numbers stored encrypted
-- Payment info: Not stored (use payment gateway)
```

### Row-Level Security (RLS)

```sql
-- Users can only see their own data
CREATE POLICY user_data_policy ON "User"
  USING (id = current_user_id());
```

---

## 📝 Migration Examples

### Create New Table

```sql
-- Using Prisma migration
npx prisma migrate dev --name add_new_table

-- Or raw SQL
CREATE TABLE "NewTable" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ...
);
```

### Add New Column

```sql
-- Prisma
npx prisma migrate dev --name add_column

-- SQL
ALTER TABLE "User" ADD COLUMN new_field VARCHAR(255);
```

---

**Database Version**: 1.0  
**Last Updated**: June 5, 2026  
**Maintenance**: Daily at 2 AM UTC

