# IKIGAI Quest - Technical Deep Details

**Advanced technical documentation for implementation details, algorithms, and backend logic**

---

## 📖 Table of Contents

1. [Authentication & Security](#authentication--security)
2. [Quiz System Implementation](#quiz-system-implementation)
3. [XP & Leaderboard Calculation](#xp--leaderboard-calculation)
4. [QR Code System](#qr-code-system)
5. [Database Transactions](#database-transactions)
6. [Caching & Performance](#caching--performance)
7. [API Response Format](#api-response-format)
8. [Error Handling](#error-handling)

---

## Authentication & Security

### JWT Token Implementation

**Token Structure:**
```typescript
interface JWTPayload {
  userId: string
  email: string
  role: 'USER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN'
  iat: number   // Issued at
  exp: number   // Expiration (24 hours)
}
```

**Token Generation:**
```typescript
// backend/src/config/env.ts
const token = jwt.sign(
  { userId, email, role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
)
```

**Token Verification:**
```typescript
// middleware/auth.ts
const decoded = jwt.verify(token, process.env.JWT_SECRET)
// Attach user to request
req.user = decoded
next()
```

### Password Hashing

**Algorithm**: bcryptjs with salt rounds = 10

```typescript
// Registration
import bcrypt from 'bcryptjs'
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

// Login verification
const isMatch = await bcrypt.compare(inputPassword, storedHash)
```

### Role-Based Access Control

**Role Hierarchy:**
```
USER (base)
  └── STAFF (can award XP, manage events)
      └── ADMIN (manage quizzes, users, content)
          └── SUPER_ADMIN (full system access)
```

**Permission Checks:**
```typescript
// middleware/auth.ts
const requiredRoles = ['STAFF', 'ADMIN', 'SUPER_ADMIN']

if (!requiredRoles.includes(user.role)) {
  throw new UnauthorizedError('Staff access required')
}
```

### Rate Limiting

**Implementation**: 100 requests per 15 minutes per IP

```typescript
// middleware/rateLimiter.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // 100 requests
  message: 'Too many requests, try again later'
})

app.use('/api/', limiter)
```

**Bypass Authenticated Users**: Rate limit less strict for logged-in users

---

## Quiz System Implementation

### Quiz Submission Logic

**Step 1: Validate Quiz Exists**
```typescript
const quiz = await db.quiz.findUnique({
  where: { id: quizId },
  include: { questions: true }
})
```

**Step 2: Check Previous Submission**
```typescript
const existingSubmission = await db.quizSubmission.findFirst({
  where: {
    userId,
    quizId,
    // Check if taken within 24 hours (based on policy)
  }
})

if (existingSubmission) {
  throw new ConflictError('Quiz already taken')
}
```

**Step 3: Score Calculation**
```typescript
interface Answer {
  questionId: string
  answer: string
}

let score = 0
for (const answer of answers) {
  const question = quiz.questions.find(q => q.id === answer.questionId)
  if (question && question.correctAnswer === answer.answer) {
    score += question.points
  }
}

const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0)
const percentage = (score / maxScore) * 100
```

**Step 4: XP Calculation**
```typescript
const passed = percentage >= quiz.passingScore

let xpEarned = 0
if (passed) {
  // Base XP reward
  xpEarned = quiz.xpReward
  
  // Bonus for perfect score
  if (percentage === 100) {
    xpEarned *= 1.5  // 50% bonus
  }
  
  // Bonus for quick completion (time-based)
  if (timeSpent < (quiz.timeLimit * 0.5)) {
    xpEarned *= 1.2  // 20% bonus
  }
}

// No XP penalty for failing
```

**Step 5: Save Submission**
```typescript
const submission = await db.quizSubmission.create({
  data: {
    userId,
    quizId,
    answers: JSON.stringify(answers),
    score,
    maxScore,
    xpEarned,
    submittedAt: new Date()
  }
})

// Award XP to user
if (xpEarned > 0) {
  await db.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } }
  })
  
  // Log XP history
  await db.xpHistory.create({
    data: {
      userId,
      amount: xpEarned,
      reason: `Quiz "${quiz.title}" - ${percentage.toFixed(0)}%`,
      source: 'QUIZ',
      sourceId: quizId
    }
  })
}
```

---

## XP & Leaderboard Calculation

### Leaderboard Query

**Individual Leaderboard (Ranked by XP):**
```typescript
const leaderboard = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    xp: true,
    avatar: true
  },
  orderBy: {
    xp: 'desc'
  },
  take: 100  // Top 100
})

// Add rank
const ranked = leaderboard.map((user, index) => ({
  ...user,
  rank: index + 1
}))
```

**Tribe Leaderboard:**
```typescript
const tribes = await db.tribe.findMany({
  select: {
    id: true,
    name: true,
    totalXp: true,
    _count: {
      select: { members: true }
    }
  },
  orderBy: {
    totalXp: 'desc'
  }
})

const tribesWithRank = tribes.map((tribe, index) => ({
  ...tribe,
  rank: index + 1,
  memberCount: tribe._count.members
}))
```

### XP Distribution Strategies

**Quiz XP**:
- Base: Set by admin (usually 10-50)
- Perfect score: +50% bonus
- Quick completion: +20% bonus
- Failed: 0 XP

**Attendance XP**:
- Scan event: 5 XP
- Staff award: Variable (admin determines)
- Bonus QR: Variable (admin determines)

**Achievement XP**:
- First quiz: 10 XP bonus
- 10 quizzes completed: 25 XP bonus
- Leaderboard top 10: 50 XP per week

### Preventing XP Abuse

**Prevention Methods**:
1. **Submission throttling** - Max quiz attempts per day
2. **Duplicate prevention** - Check timestamps (same user, same quiz, < 5 min apart)
3. **Suspicious patterns** - Alert admins if user scores 100% on hard quiz in 10 seconds
4. **Audit logging** - Log all XP awards with timestamp and reason

---

## QR Code System

### QR Code Generation

**QR Code Structure**:
```json
{
  "type": "ATTENDANCE" | "BONUS" | "STAFF_AWARD",
  "sessionId": "uuid",
  "eventId": "uuid",
  "createdAt": "2026-06-05T10:00:00Z",
  "expiresAt": "2026-06-05T12:00:00Z",
  "xpReward": 10
}
```

**Generation Process**:
```typescript
import QRCode from 'qrcode'

const qrData = JSON.stringify({
  type: 'ATTENDANCE',
  sessionId,
  xpReward: 10
})

const qrCodeImage = await QRCode.toDataURL(qrData, {
  width: 300,
  errorCorrectionLevel: 'H'
})
```

### QR Code Scanning (Web)

**Manual Input:**
```typescript
const handleManualInput = (qrCode: string) => {
  try {
    const data = JSON.parse(Buffer.from(qrCode, 'base64').toString())
    validateQRCode(data)
  } catch {
    throw new InvalidQRCodeError()
  }
}
```

**Image Upload:**
```typescript
// File uploaded, extract QR from image
import jsQR from 'jsqr'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const image = new Image()

image.onload = () => {
  canvas.width = image.width
  canvas.height = image.height
  context.drawImage(image, 0, 0)
  const data = context.getImageData(0, 0, canvas.width, canvas.height)
  const qrCode = jsQR(data.data, data.width, data.height)
  if (qrCode) {
    handleQRCode(qrCode.data)
  }
}
```

### QR Code Scanning (Mobile - Native)

**Expo Barcode Scanner:**
```typescript
import { CameraView, useCameraPermissions } from 'expo-camera'

const [permission, requestPermission] = useCameraPermissions()

const handleBarcodeScanned = ({ data }) => {
  // data contains the QR code content
  handleQRCode(data)
}

return (
  <CameraView
    onBarcodeScanned={handleBarcodeScanned}
    barcodeScannerSettings={{
      barcodeTypes: ['qr']
    }}
  />
)
```

### QR Code Validation

```typescript
const validateQRCode = (qrData) => {
  // 1. Check structure
  if (!qrData.type || !qrData.sessionId) {
    throw new InvalidQRCodeError('Invalid QR structure')
  }
  
  // 2. Check expiration
  if (new Date() > new Date(qrData.expiresAt)) {
    throw new ExpiredQRCodeError('QR code has expired')
  }
  
  // 3. Check if already used (prevent duplicate scans)
  const recentScan = await db.attendance.findFirst({
    where: {
      userId,
      sessionId: qrData.sessionId,
      scannedAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000)  // Within 5 minutes
      }
    }
  })
  
  if (recentScan) {
    throw new DuplicateScanError('Already scanned this code')
  }
  
  return true
}
```

---

## Database Transactions

### Quiz Submission Transaction

```typescript
await db.$transaction(async (tx) => {
  // 1. Create submission record
  const submission = await tx.quizSubmission.create({
    data: {
      userId,
      quizId,
      answers: JSON.stringify(answers),
      score,
      xpEarned
    }
  })
  
  // 2. Update user XP
  await tx.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } }
  })
  
  // 3. Log XP history
  await tx.xpHistory.create({
    data: {
      userId,
      amount: xpEarned,
      reason: 'Quiz completion',
      source: 'QUIZ'
    }
  })
  
  // 4. Update tribe XP if in tribe
  if (user.tribeId) {
    await tx.tribe.update({
      where: { id: user.tribeId },
      data: { totalXp: { increment: xpEarned } }
    })
  }
  
  return submission
}, {
  timeout: 10000  // 10 second timeout
})
```

**Benefits:**
- All-or-nothing execution
- Consistency guaranteed
- No partial updates
- Atomic operations

---

## Caching & Performance

### Redis Caching (Optional)

**Leaderboard Cache:**
```typescript
// Cache leaderboard for 5 minutes
const cacheKey = 'leaderboard:individual'

// Check cache
let leaderboard = await redis.get(cacheKey)
if (!leaderboard) {
  // Calculate
  leaderboard = await calculateLeaderboard()
  // Cache result
  await redis.setex(cacheKey, 300, JSON.stringify(leaderboard))
}
```

**Cache Invalidation:**
```typescript
// On quiz submission or XP award
await redis.del('leaderboard:individual')
await redis.del('leaderboard:tribes')
```

### Query Optimization

**Select Only Needed Fields:**
```typescript
// BAD - Fetches all columns
const user = await db.user.findUnique({ where: { id } })

// GOOD - Only fetch needed
const user = await db.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    xp: true,
    role: true
  }
})
```

**Use Indexes:**
```sql
-- On frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_submission_user_quiz ON quiz_submissions(userId, quizId);
CREATE INDEX idx_xp_user_date ON xp_history(userId, createdAt DESC);
```

---

## API Response Format

### Standard Success Response

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "xp": 1500
  },
  "message": "User retrieved successfully"
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": "QUIZ_ALREADY_SUBMITTED",
  "message": "You have already submitted this quiz",
  "statusCode": 409,
  "timestamp": "2026-06-05T10:30:00Z"
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 250,
    "pages": 13
  }
}
```

---

## Error Handling

### Custom Error Classes

```typescript
class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT')
  }
}
```

### Error Handling Middleware

```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'
  const code = err.code || 'INTERNAL_ERROR'
  
  console.error(`[${code}] ${message}`)
  
  res.status(statusCode).json({
    success: false,
    error: code,
    message,
    statusCode,
    timestamp: new Date().toISOString()
  })
})
```

### Async Handler Wrapper

```typescript
// utils/asyncHandler.ts
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Usage
router.post('/quiz/:id/submit', asyncHandler(async (req, res) => {
  const submission = await submitQuiz(req.params.id, req.body)
  res.json({ success: true, data: submission })
}))
```

---

## Advanced Topics

### Concurrent Request Handling

**Optimistic Locking:**
```typescript
// Add version field to prevent race conditions
const user = await db.user.findUnique({ where: { id } })
const updated = await db.user.update({
  where: { id, version: user.version },
  data: { xp: user.xp + 10, version: { increment: 1 } }
})
```

### Real-Time Updates (Future Enhancement)

**WebSocket Setup:**
```typescript
import { Server } from 'socket.io'

const io = new Server(httpServer, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  socket.on('join-quiz', (quizId) => {
    socket.join(`quiz:${quizId}`)
  })
})

// When quiz submitted
io.to(`quiz:${quizId}`).emit('user-submitted', {
  userId,
  score,
  timestamp
})
```

---

**Last Updated**: June 5, 2026
**Version**: 1.0

