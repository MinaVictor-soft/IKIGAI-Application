# 👨‍💼 Admin Dashboard Complete Guide

**Comprehensive guide for administrators to manage IKIGAI Quest platform**

---

## 📖 Table of Contents

- [Overview](#overview)
- [Dashboard Features](#dashboard-features)
- [User Management](#user-management)
- [Quiz Management](#quiz-management)
- [Events & Sessions](#events--sessions)
- [Sports Management](#sports-management)
- [Publications](#publications)
- [Analytics & Reports](#analytics--reports)
- [Settings & Configuration](#settings--configuration)

---

## 🎯 Overview

The Admin Dashboard is the central control hub for managing all aspects of the IKIGAI Quest platform. It provides comprehensive tools for:

- 👥 User administration and role assignment
- 📝 Quiz creation and management
- 📅 Event and session scheduling
- ⚽ Sports match management
- 📰 Content publication
- 📊 Analytics and reporting
- ⚙️ System configuration

**Access URL**: `http://localhost:5173`  
**Required Role**: ADMIN or SUPER_ADMIN

---

## 🏠 Dashboard Features

### Main Dashboard Screen

**Key Metrics Display:**
- Total Users: 1,234
- Active Quizzes: 45
- Today's Events: 8
- Pending Approvals: 12
- System Health: ✅ All Green

### Quick Actions

```
┌─────────────────────────────────────────┐
│  📊 Analytics Dashboard                 │
├─────────────────────────────────────────┤
│ [Create Quiz] [Add Event] [Add Match]  │
│ [Create Publication] [Manage Users]    │
└─────────────────────────────────────────┘
```

### Recent Activity Feed

- User Registration: Jane Smith joined
- Quiz Completed: 50 users completed "Science 101"
- Event Created: Summer Championship scheduled
- New Publication: Tech News Released

---

## 👥 User Management

### Access: Users → All Users

#### Viewing Users

**List View:**
```
User              Email                 Role        XP    Level   Joined
───────────────────────────────────────────────────────────────────────
John Doe          john@example.com      USER        2500  3       Jan 15
Jane Smith        jane@example.com      STAFF       4200  4       Jan 20
Admin User        admin@example.com     ADMIN       10000 8       Jan 1
```

**Filters:**
- By Role: USER, STAFF, ADMIN, SUPER_ADMIN
- By Status: Active, Inactive, Suspended
- By Join Date: Last 7 days, 30 days, etc.
- Search: By name, email, phone

#### User Details View

Click on any user to view:

```
┌─────────────────────────────────────┐
│  User Profile: John Doe             │
├─────────────────────────────────────┤
│  Email: john@example.com            │
│  Phone: +1234567890                 │
│  Role: USER                         │
│  XP: 2,500  |  Level: 3             │
│  Tribe: Team A                      │
│  Status: Active                     │
│                                     │
│  Joined: Jan 15, 2026               │
│  Last Active: Today 3:45 PM         │
│  Quiz Attempts: 12                  │
│  Average Score: 85%                 │
│  Attendance Rate: 90%               │
│                                     │
│  [Edit] [Suspend] [Delete] [View Activity] │
└─────────────────────────────────────┘
```

#### Creating a New User

**Path:** Users → Add User

```
Form Fields:
├─ Name *
│  Input: Text field
├─ Email * 
│  Input: Email field
├─ Password *
│  Input: Password field (min 8 chars)
├─ Phone
│  Input: Text field with country code
├─ Role *
│  Select: USER | STAFF | ADMIN
├─ Tribe
│  Select: Dropdown of teams
├─ Status
│  Select: Active | Inactive
└─ Send Welcome Email
   Checkbox: Yes/No
```

**Action:** Click "Create User" → User account created → Welcome email sent

#### Editing User

**Path:** Users → Select User → Edit

Editable Fields:
- Name
- Email
- Phone
- Role (change permissions)
- Tribe (assign to team)
- Status (activate/deactivate)
- XP (manual adjustment for testing)
- Avatar (upload image)

**Changes Save:** Automatically logged in audit trail

#### Bulk Actions

**Path:** Users → Select Multiple → Bulk Actions

Available Actions:
- Change Role: Select new role, apply to all
- Assign to Tribe: Select tribe, assign all users
- Send Message: Compose and send to selected users
- Export Data: Download CSV with selected users
- Delete: Remove multiple users (requires confirmation)

#### User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|------------|
| **USER** | Regular participant | Take quizzes, attend sessions, view leaderboard |
| **STAFF** | Event organizer | Create sessions, manage events, scan QR codes |
| **ADMIN** | Platform manager | Full dashboard access, create quizzes, manage content |
| **SUPER_ADMIN** | System owner | All permissions, user management, system settings |

---

## 📝 Quiz Management

### Access: Quizzes → Manage Quizzes

#### Browse Quizzes

**List View:**
```
Quiz Title              Category      Questions  XP    Status     Created By
──────────────────────────────────────────────────────────────────────────
General Science Quiz    Science       10         100   PUBLISHED  Admin
Math Fundamentals       Math          15         150   DRAFT      Staff
History 101             History       20         200   PUBLISHED  Admin
```

**Filters:**
- Status: Draft, Published, Archived
- Category: Science, Math, History, etc.
- Difficulty: Easy, Medium, Hard
- Date Range: Created between dates

#### Creating a Quiz

**Path:** Quizzes → Create New Quiz

**Step 1: Basic Info**
```
┌──────────────────────────────────┐
│  Basic Information               │
├──────────────────────────────────┤
│  Title *                         │
│  [_________________________]    │
│                                  │
│  Description                     │
│  [_________________________]    │
│                                  │
│  Category *                      │
│  [Science ▼]                    │
│                                  │
│  Difficulty Level *              │
│  [Medium ▼]                     │
│                                  │
│  Time Limit (seconds)            │
│  [600] (10 minutes)              │
│                                  │
│  XP Reward *                     │
│  [100]                           │
└──────────────────────────────────┘
```

**Step 2: Upload Cover Image**
```
[Drag & drop or click to upload]
Current: science-quiz.jpg (250x150px)
```

**Step 3: Add Questions**

For each question:

```
Question 1: What is H2O?
┌────────────────────────────────┐
│  Question Type: Multiple Choice │
│  Question *                     │
│  [What is H2O?         ]        │
│                                 │
│  Option 1 *                     │
│  [Hydrogen and Oxygen] [✓]     │
│  (Mark as correct)              │
│                                 │
│  Option 2                       │
│  [Water Molecule    ]           │
│                                 │
│  Option 3                       │
│  [Chemical Compound]            │
│                                 │
│  Option 4                       │
│  [Acid                ]         │
│                                 │
│  [Add Another Option]           │
│  [Remove Question] [Add Question]
└────────────────────────────────┘
```

**Step 4: Review & Publish**

```
┌──────────────────────────┐
│  Quiz Summary            │
├──────────────────────────┤
│  Title: Science Quiz     │
│  Questions: 10           │
│  Time: 10 minutes        │
│  XP Reward: 100          │
│                          │
│  [Save as Draft]         │
│  [Publish Quiz]          │
└──────────────────────────┘
```

#### Editing a Quiz

**Path:** Quizzes → Select Quiz → Edit

Changes you can make:
- Title and description
- Category, difficulty
- Time limit, XP reward
- Cover image
- Add/edit/remove questions
- Change status (draft → published)

**Note:** Published quizzes cannot have questions modified (to maintain submission history)

#### Quiz Statistics

**Path:** Quizzes → Select Quiz → Statistics

```
┌──────────────────────────────────┐
│  Quiz: General Science           │
├──────────────────────────────────┤
│  Total Attempts: 450             │
│  Unique Users: 380               │
│  Average Score: 82%              │
│  Pass Rate: 88%                  │
│                                  │
│  Most Missed Question: #5        │
│  (30% got it wrong)              │
│                                  │
│  Time Breakdown:                 │
│  Avg Time: 8:45 min              │
│  Fastest: 2:30 min               │
│  Slowest: 12:15 min              │
│                                  │
│  [View All Submissions]          │
│  [View Question Analysis]        │
└──────────────────────────────────┘
```

#### Viewing Submissions

**Path:** Quizzes → Select Quiz → Submissions

```
User              Score   % Pass    Time     Submitted
──────────────────────────────────────────────────────
John Doe          9/10    90%       9:30    Today 2:15 PM
Jane Smith        8/10    80%       8:45    Today 1:50 PM
Mike Johnson      10/10   100%      7:20    Today 12:30 PM
```

Click on submission to view:
- User's answers
- Correct answers
- Time spent on each question
- Question-by-question analysis

---

## 📅 Events & Sessions

### Access: Events → Manage Sessions

#### Create Attendance Session

**Path:** Events → Create Session

```
┌────────────────────────────┐
│  Create Session            │
├────────────────────────────┤
│  Session Name *            │
│  [Morning Assembly]        │
│                            │
│  Description               │
│  [Daily morning gathering] │
│                            │
│  Location *                │
│  [Main Hall]               │
│                            │
│  Start Time *              │
│  [2026-06-05 09:00 AM]    │
│                            │
│  End Time *                │
│  [2026-06-05 09:30 AM]    │
│                            │
│  XP Reward *               │
│  [50]                      │
│                            │
│  QR Code Type:             │
│  ○ Static  ◉ Dynamic       │
│                            │
│  [Create Session]          │
└────────────────────────────┘
```

**After Creation:**
- QR code generated
- Session added to schedule
- Staff notified
- Can share QR code link

#### Session Management

**View Sessions:**
```
Session                Location      Date      Time      Users   Status
─────────────────────────────────────────────────────────────────────
Morning Assembly       Main Hall     Jun 5     9:00 AM   25/30   Completed
Lunch Break            Cafeteria     Jun 5     12:00 PM  0/30    Upcoming
Afternoon Event        Auditorium    Jun 5     3:00 PM   0/50    Scheduled
```

**Session Actions:**
- [View QR Code] - Display for manual sharing
- [View Attendance] - List who scanned
- [Edit] - Modify details
- [Cancel] - Remove session
- [Export Report] - Download attendance data

#### Managing Event Registrations

**Path:** Events → Registrations

- View registered users
- Accept/reject registrations
- Send reminders
- Export list
- Cancel registrations

---

## ⚽ Sports Management

### Access: Sports → Matches

#### Create Match

**Path:** Sports → Create Match

```
┌──────────────────────────┐
│  Create Match            │
├──────────────────────────┤
│  Match Title *           │
│  [Football Championship] │
│                          │
│  Sport Type *            │
│  [Football ▼]            │
│                          │
│  Home Team *             │
│  [Team A      ▼]         │
│                          │
│  Away Team *             │
│  [Team B      ▼]         │
│                          │
│  Match Date *            │
│  [2026-06-10]            │
│                          │
│  Match Time *            │
│  [3:00 PM]               │
│                          │
│  Venue *                 │
│  [Main Stadium]          │
│                          │
│  Description             │
│  [Championship match]    │
│                          │
│  [Create Match]          │
└──────────────────────────┘
```

#### Match Updates

During/After match, update:
- Home team score
- Away team score
- Match status (Scheduled → Live → Completed)
- Highlights/video
- Man of the match

#### Match Statistics

View for each match:
- Goal scorers
- Attendance
- Highlights
- Player statistics
- Previous H2H records

---

## 📰 Publications Management

### Access: Publications → Manage

#### Create Publication

**Path:** Publications → Create New

```
┌─────────────────────┐
│  New Publication    │
├─────────────────────┤
│  Title *            │
│  [Article Title]    │
│                     │
│  Category *         │
│  [Technology ▼]     │
│                     │
│  Content *          │
│  [Rich text editor] │
│                     │
│  Cover Image *      │
│  [Upload file]      │
│                     │
│  PDF Document       │
│  [Upload file]      │
│                     │
│  Featured           │
│  ☑ Yes ☐ No         │
│                     │
│  Publish            │
│  ◉ Now ○ Schedule   │
│                     │
│  [Create]           │
└─────────────────────┘
```

#### Publication Management

View/Edit/Delete publications
- Scheduled publications
- Draft publications
- Published publications
- View statistics (views, downloads)

---

## 📊 Analytics & Reports

### Access: Analytics Dashboard

#### Overview Metrics

```
┌──────────────────────────────────────┐
│  Platform Analytics                  │
├──────────────────────────────────────┤
│                                      │
│  Users: 1,234    |  Active: 890     │
│  Quizzes: 45     |  Attempts: 3,450 │
│  Events: 120     |  Attendance: 95% │
│  Publications: 28 |  Downloads: 1,234│
│                                      │
└──────────────────────────────────────┘
```

#### User Analytics

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User growth trends
- Retention rates
- User segments

#### Quiz Analytics

- Quiz completion rates
- Average scores
- Popular quizzes
- Low-performing quizzes
- Time-on-quiz analysis

#### Engagement Metrics

- XP distribution
- Leaderboard trends
- Participation rates
- Feature usage
- Event attendance

#### Detailed Reports

Generate reports:
- User Activity Report
- Quiz Performance Report
- Event Attendance Report
- Revenue Report
- System Health Report

**Export Options:**
- PDF
- Excel
- CSV
- JSON

---

## ⚙️ Settings & Configuration

### Access: Settings

#### General Settings

```
Platform Settings:
├─ Site Name: IKIGAI Quest
├─ Site URL: https://ikigai.example.com
├─ Time Zone: UTC+4 (Dubai)
├─ Language: English (AR supported)
└─ Contact Email: admin@ikigai.com
```

#### Security Settings

```
Security:
├─ Password Policy
│  ├─ Min Length: 8 characters
│  ├─ Require Numbers: Yes
│  ├─ Require Symbols: Yes
│  └─ Expiry: 90 days
├─ 2FA Required: For admins only
├─ Session Timeout: 30 minutes
├─ Rate Limiting: 100/15min
└─ CORS Allowed: [domains...]
```

#### Email Configuration

```
Email Settings:
├─ SMTP Server: smtp.gmail.com
├─ SMTP Port: 587
├─ From Email: noreply@ikigai.com
├─ Email Templates:
│  ├─ Welcome Email
│  ├─ Password Reset
│  ├─ Event Invitation
│  └─ Quiz Results
└─ Test Email: [Send Test]
```

#### API Configuration

```
API Settings:
├─ API Version: 1.0
├─ Base URL: /api/v1
├─ Rate Limit: 100 req/15min
├─ Timeout: 30 seconds
├─ CORS: Enabled
└─ API Keys: [Manage]
```

#### Backup & Export

```
Data Management:
├─ Automated Backups: Daily at 2 AM
├─ Last Backup: Today 2:00 AM
├─ Backup Location: AWS S3
├─ Retention: 30 days
└─ Actions:
   ├─ [Manual Backup]
   ├─ [Download Backup]
   ├─ [Restore Backup]
   └─ [Export All Data]
```

---

## 🔔 System Notifications

### Alert Types

**High Priority:**
- System errors
- Failed backups
- High server load
- Security alerts

**Medium Priority:**
- User approvals pending
- Low disk space
- API quota warnings

**Low Priority:**
- New user registrations
- Daily activity summary

---

## 📋 Admin Audit Trail

**Access:** Settings → Audit Log

Track all admin actions:
```
Admin          Action              Resource      Time
─────────────────────────────────────────────────────
Admin User     Created Quiz        Q123          2:15 PM
Admin User     Updated User        U456          2:10 PM
Staff User     Created Session     S789          1:45 PM
```

---

## 🆘 Troubleshooting

### Common Issues

**Q: Quiz won't publish?**
A: Ensure all questions have at least 2 options and 1 correct answer marked

**Q: Session QR code not generating?**
A: Check that session time is in the future and all fields are filled

**Q: User can't see their XP?**
A: Wait a few minutes for cache to update or refresh the page

**Q: Report generation failed?**
A: Try with a smaller date range or contact support

---

**Dashboard Version**: 1.0.0  
**Last Updated**: June 5, 2026  
**Support**: admin-support@ikigai.com

