# IKIGAI Quizzes System Documentation

## Overview

The Quizzes System manages quiz creation, distribution, scoring, and tracking within the IKIGAI platform. It supports multiple question types, time-based tests, and automatic XP awarding based on performance.

## Architecture

### Database Schema

```sql
-- Quiz Table
CREATE TABLE "Quiz" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficultyLevel ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') DEFAULT 'INTERMEDIATE',
  duration INT NOT NULL DEFAULT 120, -- seconds
  passingPercentage INT DEFAULT 70,
  xpReward INT DEFAULT 20,
  totalQuestions INT DEFAULT 0,
  status ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED') DEFAULT 'DRAFT',
  createdBy UUID NOT NULL,
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (createdBy) REFERENCES "User"(id),
  
  INDEX idx_quiz_status (status),
  INDEX idx_quiz_category (category),
  INDEX idx_quiz_difficulty (difficultyLevel),
  INDEX idx_quiz_published (publishedAt)
);

-- Quiz Question Table
CREATE TABLE "QuizQuestion" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quizId UUID NOT NULL,
  questionText TEXT NOT NULL,
  questionType ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'MATCHING') DEFAULT 'MULTIPLE_CHOICE',
  orderIndex INT NOT NULL,
  points INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (quizId) REFERENCES "Quiz"(id) ON DELETE CASCADE,
  
  INDEX idx_question_quizid (quizId),
  INDEX idx_question_order (quizId, orderIndex)
);

-- Quiz Answer Option Table
CREATE TABLE "QuizAnswerOption" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionId UUID NOT NULL,
  optionText TEXT NOT NULL,
  optionIndex INT NOT NULL,
  isCorrect BOOLEAN DEFAULT false,
  explanation TEXT,
  createdAt TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (questionId) REFERENCES "QuizQuestion"(id) ON DELETE CASCADE,
  
  INDEX idx_option_questionid (questionId),
  UNIQUE(questionId, optionIndex)
);

-- Quiz Attempt/Submission Table
CREATE TABLE "QuizAttempt" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quizId UUID NOT NULL,
  userId UUID NOT NULL,
  startedAt TIMESTAMP DEFAULT now(),
  completedAt TIMESTAMP,
  score INT,
  percentage FLOAT,
  passed BOOLEAN,
  xpEarned INT DEFAULT 0,
  timeSpent INT, -- seconds
  status ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'SUBMITTED') DEFAULT 'IN_PROGRESS',
  
  FOREIGN KEY (quizId) REFERENCES "Quiz"(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
  
  INDEX idx_attempt_quizid (quizId),
  INDEX idx_attempt_userid (userId),
  INDEX idx_attempt_status (status),
  INDEX idx_attempt_completed (completedAt)
);

-- User Quiz Answer Table
CREATE TABLE "UserQuizAnswer" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attemptId UUID NOT NULL,
  questionId UUID NOT NULL,
  selectedAnswerId UUID,
  answer TEXT, -- for short answer
  isCorrect BOOLEAN,
  pointsEarned INT DEFAULT 0,
  answeredAt TIMESTAMP DEFAULT now(),
  
  FOREIGN KEY (attemptId) REFERENCES "QuizAttempt"(id) ON DELETE CASCADE,
  FOREIGN KEY (questionId) REFERENCES "QuizQuestion"(id) ON DELETE CASCADE,
  FOREIGN KEY (selectedAnswerId) REFERENCES "QuizAnswerOption"(id),
  
  INDEX idx_answer_attemptid (attemptId),
  INDEX idx_answer_questionid (questionId)
);

-- Quiz Statistics Table
CREATE TABLE "QuizStatistics" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quizId UUID NOT NULL UNIQUE,
  totalAttempts INT DEFAULT 0,
  totalCompleted INT DEFAULT 0,
  avgScore FLOAT DEFAULT 0,
  avgPercentage FLOAT DEFAULT 0,
  passRate FLOAT DEFAULT 0,
  highestScore INT DEFAULT 0,
  lowestScore INT DEFAULT 0,
  lastAttemptDate TIMESTAMP,
  
  FOREIGN KEY (quizId) REFERENCES "Quiz"(id) ON DELETE CASCADE
);
```

## API Endpoints

### Quiz Management

#### Get All Quizzes
```
GET /api/v1/quizzes
Query Parameters:
  - status: DRAFT|ACTIVE|INACTIVE|ARCHIVED
  - category: string
  - difficulty: BEGINNER|INTERMEDIATE|ADVANCED|EXPERT
  - page: number (default: 1)
  - limit: number (default: 10)

Response:
{
  data: [
    {
      id: "uuid",
      title: "Islamic History 101",
      description: "Basic Islamic history quiz",
      category: "Islamic Studies",
      difficulty: "BEGINNER",
      duration: 300,
      xpReward: 50,
      totalQuestions: 10,
      status: "ACTIVE",
      passRate: 85,
      attempts: 24,
      avgScore: 8.2
    }
  ],
  pagination: { page: 1, limit: 10, total: 45 }
}
```

#### Get Active Quizzes
```
GET /api/v1/quizzes/active

Response:
{
  data: [
    {
      id: "uuid",
      title: "Weekly Scripture Challenge",
      description: "Test your Bible knowledge",
      category: "Scripture",
      duration: 600,
      xpReward: 100,
      totalQuestions: 20,
      publishedAt: "2026-06-01T10:00:00Z"
    }
  ]
}
```

#### Create Quiz
```
POST /api/v1/quizzes
Authentication: Required (Admin)

Body:
{
  title: "New Quiz",
  description: "Quiz description",
  category: "Category",
  difficultyLevel: "INTERMEDIATE",
  duration: 300,
  passingPercentage: 70,
  xpReward: 50
}

Response: 201 Created
{
  data: {
    id: "uuid",
    title: "New Quiz",
    status: "DRAFT",
    totalQuestions: 0,
    createdAt: "2026-06-06T12:00:00Z"
  }
}
```

#### Get Quiz Details
```
GET /api/v1/quizzes/:quizId

Response:
{
  data: {
    id: "uuid",
    title: "Islamic History 101",
    description: "Basic Islamic history quiz",
    category: "Islamic Studies",
    difficultyLevel: "BEGINNER",
    duration: 300,
    passingPercentage: 70,
    xpReward: 50,
    totalQuestions: 10,
    status: "ACTIVE",
    questions: [
      {
        id: "uuid",
        questionText: "When was Islam founded?",
        questionType: "MULTIPLE_CHOICE",
        orderIndex: 1,
        points: 1,
        options: [
          { id: "uuid", optionText: "610 CE", optionIndex: 0 },
          { id: "uuid", optionText: "632 CE", optionIndex: 1 },
          { id: "uuid", optionText: "750 CE", optionIndex: 2 }
        ]
      }
    ],
    statistics: {
      totalAttempts: 24,
      avgScore: 8.2,
      passRate: 85
    }
  }
}
```

#### Update Quiz
```
PATCH /api/v1/quizzes/:quizId
Authentication: Required (Admin)

Body:
{
  title: "Updated Title",
  xpReward: 75,
  passingPercentage: 75
}

Response: 200 OK
{
  data: {
    id: "uuid",
    title: "Updated Title",
    xpReward: 75,
    updatedAt: "2026-06-06T13:00:00Z"
  }
}
```

#### Publish Quiz
```
POST /api/v1/quizzes/:quizId/publish
Authentication: Required (Admin)

Response: 200 OK
{
  data: {
    id: "uuid",
    status: "ACTIVE",
    publishedAt: "2026-06-06T13:00:00Z"
  }
}
```

#### Delete Quiz
```
DELETE /api/v1/quizzes/:quizId
Authentication: Required (Admin)

Response: 200 OK
{
  message: "Quiz deleted successfully"
}
```

### Quiz Questions

#### Add Question to Quiz
```
POST /api/v1/quizzes/:quizId/questions
Authentication: Required (Admin)

Body:
{
  questionText: "What is the capital of France?",
  questionType: "MULTIPLE_CHOICE",
  orderIndex: 1,
  points: 1,
  options: [
    { optionText: "Paris", isCorrect: true, explanation: "Correct! Paris is capital of France" },
    { optionText: "Lyon", isCorrect: false },
    { optionText: "Marseille", isCorrect: false }
  ]
}

Response: 201 Created
{
  data: {
    id: "uuid",
    quizId: "uuid",
    questionText: "What is the capital of France?",
    questionType: "MULTIPLE_CHOICE",
    options: [...]
  }
}
```

#### Update Question
```
PATCH /api/v1/quizzes/:quizId/questions/:questionId
Authentication: Required (Admin)

Body:
{
  questionText: "Updated question text",
  options: [...]
}

Response: 200 OK
```

#### Delete Question
```
DELETE /api/v1/quizzes/:quizId/questions/:questionId
Authentication: Required (Admin)

Response: 200 OK
```

### Quiz Taking

#### Start Quiz
```
POST /api/v1/quizzes/:quizId/start
Authentication: Required

Response: 201 Created
{
  data: {
    attemptId: "uuid",
    quizId: "uuid",
    questions: [
      {
        id: "uuid",
        questionText: "Question 1?",
        questionType: "MULTIPLE_CHOICE",
        options: [
          { id: "uuid", optionText: "Option 1" },
          { id: "uuid", optionText: "Option 2" }
        ]
      }
    ],
    timeLimit: 300,
    startedAt: "2026-06-06T14:00:00Z"
  }
}
```

#### Submit Quiz Answer
```
POST /api/v1/quizzes/:quizId/answer
Authentication: Required

Body:
{
  attemptId: "uuid",
  questionId: "uuid",
  selectedAnswerId: "uuid" // or "answer" for short answer
}

Response: 200 OK
{
  data: {
    questionId: "uuid",
    isCorrect: true,
    pointsEarned: 1
  }
}
```

#### Complete Quiz
```
POST /api/v1/quizzes/:quizId/submit
Authentication: Required

Body:
{
  attemptId: "uuid"
}

Response: 200 OK
{
  data: {
    attemptId: "uuid",
    quizId: "uuid",
    score: 8,
    totalPoints: 10,
    percentage: 80,
    passed: true,
    xpEarned: 50,
    timeSpent: 245,
    completedAt: "2026-06-06T14:04:05Z"
  }
}
```

### Quiz Results

#### Get Quiz Attempt
```
GET /api/v1/quizzes/:quizId/attempts/:attemptId
Authentication: Required

Response:
{
  data: {
    id: "uuid",
    quizId: "uuid",
    userId: "uuid",
    score: 8,
    percentage: 80,
    passed: true,
    xpEarned: 50,
    timeSpent: 245,
    startedAt: "2026-06-06T14:00:00Z",
    completedAt: "2026-06-06T14:04:05Z",
    answers: [
      {
        questionId: "uuid",
        questionText: "Question 1?",
        selectedAnswer: "Option 1",
        correctAnswer: "Option 1",
        isCorrect: true,
        pointsEarned: 1
      }
    ]
  }
}
```

#### Get User's Quiz Attempts
```
GET /api/v1/quizzes/my-attempts
Authentication: Required

Response:
{
  data: [
    {
      id: "uuid",
      quizId: "uuid",
      quizTitle: "Islamic History 101",
      score: 8,
      percentage: 80,
      passed: true,
      xpEarned: 50,
      completedAt: "2026-06-06T14:04:05Z"
    }
  ]
}
```

#### Get Quiz Leaderboard
```
GET /api/v1/quizzes/:quizId/leaderboard
Query Parameters:
  - limit: number (default: 10)

Response:
{
  data: [
    {
      rank: 1,
      userId: "uuid",
      userName: "John Doe",
      attempts: 3,
      bestScore: 10,
      highestPercentage: 100,
      totalXpEarned: 150
    }
  ]
}
```

## Question Types

| Type | Description | Use Case |
|------|-------------|----------|
| MULTIPLE_CHOICE | Select one from options | Standard questions |
| TRUE_FALSE | True or False | Quick knowledge tests |
| SHORT_ANSWER | Text input | Essay-style questions |
| MATCHING | Match items | Vocabulary, definitions |

## Difficulty Levels

| Level | XP Multiplier | Use Case |
|-------|---------------|----------|
| BEGINNER | 1x | Introductory content |
| INTERMEDIATE | 1.5x | Standard quizzes |
| ADVANCED | 2x | Advanced topics |
| EXPERT | 2.5x | Challenging content |

## Scoring System

```
Formula: (CorrectAnswers / TotalQuestions) * 100 = Percentage

XP Calculation:
- BaseXP = quiz.xpReward
- DifficultyMultiplier = 1, 1.5, 2, 2.5 (based on difficulty)
- PerformanceBonus = (percentage / 100) * BaseXP * DifficultyMultiplier
- TimeBonusPercentage = (timeLeft / totalTime) * 10 (max 10%)
- FinalXP = PerformanceBonus + TimeBonusPercentage

Minimum: 0 XP (if score < passing percentage)
```

## Service Layer

### QuizService Methods

```typescript
// Quiz Management
async createQuiz(data: CreateQuizDTO): Promise<Quiz>
async getQuizzes(filters?: QuizFilters, pagination?: Pagination): Promise<PaginatedResponse<Quiz>>
async getActiveQuizzes(): Promise<Quiz[]>
async getQuizById(quizId: string): Promise<Quiz>
async updateQuiz(quizId: string, data: UpdateQuizDTO): Promise<Quiz>
async publishQuiz(quizId: string): Promise<Quiz>
async deleteQuiz(quizId: string): Promise<void>

// Questions
async addQuestion(quizId: string, data: AddQuestionDTO): Promise<QuizQuestion>
async updateQuestion(quizId: string, questionId: string, data: UpdateQuestionDTO): Promise<QuizQuestion>
async deleteQuestion(questionId: string): Promise<void>
async getQuestions(quizId: string): Promise<QuizQuestion[]>

// Quiz Taking
async startAttempt(userId: string, quizId: string): Promise<QuizAttempt>
async submitAnswer(attemptId: string, data: SubmitAnswerDTO): Promise<Answer>
async completeAttempt(userId: string, attemptId: string): Promise<QuizResult>

// Results
async getAttempt(attemptId: string): Promise<QuizAttempt>
async getUserAttempts(userId: string, quizId?: string): Promise<QuizAttempt[]>
async getLeaderboard(quizId: string, limit?: number): Promise<Leaderboard[]>
async getStatistics(quizId: string): Promise<QuizStatistics>
```

## Notifications

### Auto-Triggered Notifications

1. **Quiz Created**: When admin creates new quiz
   - Sent to: All users
   - Message: "🎯 New Quiz: {quizTitle}"

2. **Quiz Published**: When quiz goes live
   - Sent to: All users  
   - Message: "📝 {quizTitle} is now available"

3. **Quiz Result**: When user completes quiz
   - Sent to: User
   - Message: "✅ {score}% - {xpEarned} XP earned!"

4. **Achievement**: When user achieves milestone
   - Message: "🏆 Quiz Master Achievement Unlocked!"

## Admin Dashboard Features

### Quiz Management
- Create/Edit/Delete quizzes
- Create questions and options
- Publish/Unpublish quizzes
- View quiz statistics
- Monitor attempts

### Analytics
- Total attempts
- Average scores
- Pass rates
- Performance trends
- Question difficulty analysis
- Time spent analysis

### Student Progress
- View all attempts
- Review answers
- See incorrect questions
- Track improvements

## Usage Examples

### Creating a Quiz

```typescript
const quizData = {
  title: "Intermediate Islamic History",
  description: "Test your knowledge of Islamic history",
  category: "Islamic Studies",
  difficultyLevel: "INTERMEDIATE",
  duration: 600,
  passingPercentage: 70,
  xpReward: 100
};

const quiz = await quizService.createQuiz(quizData);
// Sends notification: 🎯 New Quiz: Intermediate Islamic History
```

### Adding Questions

```typescript
await quizService.addQuestion(quizId, {
  questionText: "When was the Quran compiled into a standard text?",
  questionType: "MULTIPLE_CHOICE",
  orderIndex: 1,
  points: 1,
  options: [
    { optionText: "During Prophet Muhammad's time", isCorrect: false },
    { optionText: "During Caliph Uthman's time", isCorrect: true },
    { optionText: "During the Umayyad period", isCorrect: false }
  ]
});
```

### User Taking Quiz

```typescript
const attempt = await quizService.startAttempt(userId, quizId);
// User answers questions...
const result = await quizService.completeAttempt(userId, attempt.id);
// Notification: ✅ 85% - 85 XP earned!
// User XP increased by 85
```

## Database Indexes

```sql
CREATE INDEX idx_quiz_status ON "Quiz"(status);
CREATE INDEX idx_quiz_category ON "Quiz"(category);
CREATE INDEX idx_question_quizid ON "QuizQuestion"(quizId);
CREATE INDEX idx_attempt_userid ON "QuizAttempt"(userId);
CREATE INDEX idx_attempt_quizid ON "QuizAttempt"(quizId);
CREATE INDEX idx_answer_attemptid ON "UserQuizAnswer"(attemptId);
```

## Error Handling

| Error | Status | Message |
|-------|--------|---------|
| Quiz not found | 404 | Quiz does not exist |
| Quiz not published | 400 | Quiz is not yet published |
| Question limit reached | 400 | Maximum questions exceeded |
| Attempt not found | 404 | Quiz attempt not found |
| Quiz already completed | 400 | This attempt is already completed |
| Time limit exceeded | 400 | Time limit has been exceeded |
| Invalid answer | 400 | Invalid answer format |

## Future Enhancements

- [ ] Question bank system
- [ ] Quiz templates
- [ ] Randomized questions
- [ ] Timed sections
- [ ] Negative marking option
- [ ] Peer review questions
- [ ] Mobile app quiz offline mode
- [ ] Live quiz events
