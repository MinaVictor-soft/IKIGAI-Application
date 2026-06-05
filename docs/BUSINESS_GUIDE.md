# IKIGAI Quest - Business & User Guide

**Complete guide for end users, administrators, and business stakeholders**

---

## 📖 Table of Contents

1. [What is IKIGAI Quest?](#what-is-ikigai-quest)
2. [Key Features](#key-features)
3. [User Guide](#user-guide)
4. [Administrator Guide](#administrator-guide)
5. [FAQ](#faq)

---

## What is IKIGAI Quest?

IKIGAI Quest is a comprehensive gamified engagement platform that combines:
- **Interactive Quizzes** - Test knowledge and earn points
- **Event Attendance** - Track attendance with QR codes
- **Team Sports** - Manage and track match results
- **Content Library** - Share and discover publications
- **XP & Leaderboards** - Compete and climb rankings
- **Rewards System** - Earn bonuses and prizes

**Perfect for:** Companies, educational institutions, events, communities, and competitions.

---

## Key Features

### 1. 🎯 Quiz System
**What it does:**
- Create engaging multiple-choice quizzes
- Set time limits for quick challenges
- Automatic scoring and instant results
- Award XP for correct answers
- Show correct answers after completion

**User Benefits:**
- Learn while competing
- Build knowledge on various topics
- Earn XP quickly
- See how you compare to others

**Admin Benefits:**
- Easy quiz creation and editing
- Track performance metrics
- Identify knowledge gaps
- Create learning paths

### 2. 📍 QR Code Attendance
**What it does:**
- Generate QR codes for events
- Scan QR codes (mobile or web)
- Automatic attendance marking
- Award XP for attendance
- Staff can award bonus XP

**User Benefits:**
- Quick attendance check-in (no manual forms)
- Instant XP rewards
- Proof of participation
- Easy on mobile

**Admin/Staff Benefits:**
- Automated attendance tracking
- Real-time verification
- Bonus XP management for staff
- Attendance reports

### 3. 🏆 Leaderboard & XP System
**What it does:**
- Track individual XP points
- Display ranked leaderboards
- Team/tribe leaderboards
- Real-time updates
- Performance comparison

**User Benefits:**
- See your ranking
- Compete with friends
- Join teams/tribes
- Earn recognition

**Admin Benefits:**
- Monitor engagement
- Identify top performers
- Track team progress
- Motivation tool

### 4. 📚 Content Library
**What it does:**
- Upload and organize publications
- Search publications
- Filter by category
- Download content
- Share with others

**User Benefits:**
- Access learning materials
- Organized by topics
- Easy search and discovery
- Downloadable resources

**Admin Benefits:**
- Manage content easily
- Organize by categories
- Track downloads
- Update materials

### 5. ⚽ Sports Module
**What it does:**
- Manage sports matches/events
- Track match results
- Record team scores
- View match history
- Performance statistics

**User Benefits:**
- Follow favorite teams
- See results and scores
- Track season performance
- View team standings

**Admin Benefits:**
- Manage tournaments
- Record match results
- Generate reports
- Schedule matches

### 6. 📱 Multi-Platform Access
- **Web App**: Full access from desktop/laptop
- **Mobile App**: Native app for iOS/Android
- **Admin Dashboard**: Dedicated management interface
- **Same Features**: Consistent experience across platforms

---

## User Guide

### Getting Started

#### 1. Creating Your Account
1. Go to the login page
2. Click "Register" or "Sign Up"
3. Enter your email address
4. Create a strong password
5. Click "Register"
6. Verify your email (if required)

#### 2. Login to Web App
1. Visit: `http://localhost:5174` (or deployed URL)
2. Enter your email and password
3. Click "Login"
4. You'll see the dashboard

#### 3. Login to Mobile App
1. Open the IKIGAI Quest app
2. Enter your email and password
3. Click "Login"
4. Same account works everywhere

### Key Activities

#### 📝 Taking a Quiz
**On Web:**
1. Navigate to "Quizzes" section
2. Click on a quiz to start
3. Read each question carefully
4. Select your answer
5. Click "Next" to move forward
6. Click "Submit" when done
7. See your score and XP earned

**On Mobile:**
1. Go to "Quizzes" tab
2. Tap a quiz
3. Answer each question
4. Tap "Next" to continue
5. Tap "Submit Quiz" when finished
6. View your results

#### 🏆 Checking the Leaderboard
1. Navigate to "Leaderboard" section
2. View individual rankings (default tab)
3. See your rank and XP
4. Switch to "Tribes" tab to see team rankings
5. Click/tap your name to see details

#### 📍 Checking In with QR Code
**On Web:**
1. Go to "Scanner" section
2. Select "Attendance" mode
3. Either:
   - Paste/type the QR code manually
   - Upload an image containing QR code
4. Click "Scan"
5. See confirmation message

**On Mobile:**
1. Go to "Scan" tab
2. Select "Attendance" mode
3. Point phone at QR code
4. Camera automatically scans
5. See confirmation

#### 💰 Claiming Bonuses
1. Find a QR code for bonus (from admin)
2. Go to "Scanner"
3. Select "Bonus" mode
4. Scan the code
5. Receive XP bonus

#### 📚 Accessing Content
1. Go to "Library" section
2. Browse publications
3. Use search bar to find specific content
4. Click on publication to view
5. Click "Download" to save

#### 👤 Updating Profile
1. Click your name or "Profile"
2. Update your information:
   - Name
   - Email
   - Profile picture
   - Preferences
3. Click "Save"

---

## Administrator Guide

### Dashboard Overview

The Admin Dashboard provides complete control over the platform. Access it at: `http://localhost:5173/login`

#### Dashboard Main Pages

**1. Users Management**
- View all registered users
- See user statistics (XP, quizzes taken, events attended)
- Manage user roles (USER, STAFF, ADMIN, SUPER_ADMIN)
- Deactivate users if needed
- Award XP to users manually

**2. Quiz Management**
- Create new quizzes
- Edit existing quizzes
- Add/remove questions
- Set correct answers and explanations
- Set time limits
- Set XP rewards
- View quiz statistics and performance

**3. Events Management**
- Create events
- Set event dates and locations
- Generate QR codes for attendance
- View attendees
- Export attendance reports

**4. Sports Module**
- Create teams/tribes
- Schedule matches
- Record match results and scores
- View rankings and standings
- Manage team members

**5. Publications**
- Upload new publications
- Organize by categories
- Edit publication details
- View download statistics
- Delete outdated content

**6. Analytics & Reports**
- View engagement metrics
- Track XP distribution
- Monitor quiz performance
- See attendance trends
- Generate reports

### Creating a Quiz (Step-by-Step)

1. Go to "Quizzes" section
2. Click "Create New Quiz"
3. Enter quiz details:
   - **Title**: Quiz name
   - **Description**: Short description
   - **Category**: Select category
   - **Time Limit**: Set duration in minutes (optional)
   - **Passing Score**: Minimum % to pass (default 50%)
4. Click "Add Questions"
5. For each question:
   - Enter question text
   - Add options (answers)
   - Mark correct answer
   - Add explanation (optional)
   - Set points for question
6. Set XP reward for passing
7. Click "Save Quiz"
8. Quiz appears in user's quiz list

### Managing Events

**To Create an Event:**
1. Go to "Events"
2. Click "Create Event"
3. Enter details:
   - Event name
   - Date and time
   - Location
   - Description
   - Max attendees
4. Click "Generate QR Code" for attendance
5. Share QR code with attendees
6. Monitor attendance as they scan

**To View Attendance:**
1. Go to event
2. Click "View Attendees"
3. See list of who attended
4. Export as CSV if needed

### Awarding Bonuses

**Method 1: QR Code Bonus**
1. Create a special bonus QR code
2. Users scan it and get XP instantly
3. Perfect for challenges or achievements

**Method 2: Manual Award**
1. Go to Users
2. Select a user
3. Click "Award XP"
4. Enter amount
5. Add reason
6. Click "Award"

### Staff Features

Staff members (and above) can:
- Award XP directly using the Staff Award mode on Scanner
- View additional analytics
- Manage events they created
- See detailed performance reports

---

## FAQ

### General Questions

**Q: How do I create an account?**
A: Click "Register" on the login page, enter your email and password, then verify if required.

**Q: Can I use the same account on web and mobile?**
A: Yes! Your login works on all platforms. Any XP earned is synced automatically.

**Q: How do I reset my password?**
A: Click "Forgot Password" on the login page and follow the email instructions.

**Q: Is my data secure?**
A: Yes! We use industry-standard encryption and secure authentication.

---

### Quiz Questions

**Q: How many times can I take the same quiz?**
A: Depends on admin settings. Most quizzes can be taken multiple times. Check with admin for specific rules.

**Q: Do I lose XP if I fail a quiz?**
A: No, you only gain XP if you pass. Failing doesn't penalize you.

**Q: Can I see my previous quiz results?**
A: Yes, go to your profile and view "Quiz History" to see all past quizzes and scores.

**Q: How is the score calculated?**
A: Score = (Correct Answers / Total Questions) × 100%. Each correct answer usually equals 1 point.

---

### XP & Leaderboard Questions

**Q: How do I earn XP?**
A: Complete quizzes, attend events, and participate in activities. Each awards different XP amounts.

**Q: How is the leaderboard ranked?**
A: Users are ranked by total XP (highest first). Leaderboard updates in real-time.

**Q: Can I join a team?**
A: Yes, admin can add you to a tribe/team. Your XP contributes to team rankings too.

**Q: What are tribe leaderboards?**
A: Teams compete together! Your team's total XP is ranked against other teams.

---

### Scanner & QR Code Questions

**Q: What does the Scanner do?**
A: It reads QR codes for attendance, bonuses, and staff awards. Works on web and mobile.

**Q: Can I upload a QR code image instead of scanning?**
A: Yes, on web app you can upload an image. Mobile has native camera scanning.

**Q: What if the QR code doesn't work?**
A: Ensure the code is clear and valid. Contact admin if issues persist.

**Q: Can I manually enter a QR code?**
A: Yes, web app allows manual text entry if camera/upload doesn't work.

---

### Technical Questions (for Non-Tech Users)

**Q: What's required to use the app?**
A: An internet connection and a device (computer, phone, or tablet).

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, and Edge (latest versions).

**Q: What operating systems work?**
A: iOS, Android (mobile app), and Windows/Mac/Linux (web app).

**Q: How do I update the app?**
A: App Store or Play Store for mobile. Web app updates automatically.

---

### Admin Questions

**Q: How do I add a user as staff?**
A: Go to Users, select the user, change role to "STAFF", save.

**Q: Can I award negative XP?**
A: No, but admins can create adjusted standings. Contact support for special cases.

**Q: How do I backup data?**
A: Contact your system administrator. Backups are automated.

**Q: Can I migrate data to another system?**
A: Yes, export as CSV from the admin dashboard.

**Q: How many users can the system support?**
A: Thousands of concurrent users. Performance depends on server capacity.

---

## 🎯 Best Practices

### For Users
1. **Complete quizzes regularly** to build XP and climb leaderboards
2. **Attend all events** to maximize XP gains
3. **Check leaderboard** to see your progress and set goals
4. **Download publications** to learn and improve quiz performance
5. **Invite friends** to join and team up in tribes

### For Administrators
1. **Create regular quizzes** to keep engagement high
2. **Set clear rules** for XP, bonuses, and rewards
3. **Monitor leaderboards** to identify engaged users
4. **Provide interesting content** in the library
5. **Use events** to celebrate milestones
6. **Communicate clearly** about how to earn XP
7. **Keep staff updated** on new features and changes

### For Staff
1. **Be fair** when awarding bonus XP
2. **Document** reasons for awards
3. **Encourage participation** in events
4. **Help users** understand the system
5. **Report issues** to administrators

---

## 🆘 Support & Help

### Getting Help
1. Check this guide for your question
2. Ask your administrator
3. Contact support (if available)
4. Check the Info section in the app

### Reporting Issues
Contact your administrator with:
- What happened
- When it happened
- What you were trying to do
- Your device/browser
- Screenshot (if possible)

---

## 📊 Glossary

- **XP**: Experience Points - currency for engagement
- **Leaderboard**: Rankings of users or teams
- **QR Code**: Quick Response code for scanning
- **Quiz**: Multiple-choice knowledge test
- **Tribe/Team**: Group of users competing together
- **Staff**: User with permission to award XP and manage events
- **Admin**: User who manages all platform features
- **Publication**: Document or content shared in library
- **Session**: Active login period

---

**Last Updated**: June 5, 2026
**Version**: 1.0

