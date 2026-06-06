#!/usr/bin/env node

/**
 * IKIGAI Production Live Test Suite
 * Tests all major functions across backend, web app, and admin dashboard
 */

const axios = require('axios');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Production URLs
const BACKEND_URL = 'https://ikigai-backend.replit.app/api/v1';
const WEB_APP_URL = 'https://ikigai-web-app.replit.app';
const ADMIN_DASHBOARD_URL = 'https://ikigai-admin-dashboard.replit.app';

// Test admin token (valid for testing)
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNzExZjBlNC0zZDZmLTRhNmItOGQ5Ny1mYzI3MDI4ZjA3MWIiLCJlbWFpbCI6ImFkbWluQGlraWdhaS5xdWVzdCIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc4MDcwNjc2MywiZXhwIjoxNzgwNzA3NjYzfQ.EfyMFXp5zaX0zB0ajqDaWzgipKqGoWKFqQhNAA0GS3Q';

let testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

// ============================================
// TEST UTILITIES
// ============================================

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logTest(name, passed, error = null) {
  testResults.tests.push({ name, passed, error });
  if (passed) {
    testResults.passed++;
    log(`✅ ${name}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ ${name}: ${error}`, 'red');
  }
}

async function testAPI(name, method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BACKEND_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        ...headers,
      },
      timeout: 10000,
    };
    
    if (data) config.data = data;
    
    const response = await axios(config);
    logTest(name, true);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    logTest(name, false, errorMsg);
    return null;
  }
}

async function testWebApp(name, path) {
  try {
    const response = await axios.get(`${WEB_APP_URL}${path}`, { timeout: 10000 });
    logTest(name, response.status === 200);
    return response.status === 200;
  } catch (error) {
    logTest(name, false, error.message);
    return false;
  }
}

// ============================================
// TEST SUITES
// ============================================

async function testBackendHealth() {
  log('\n🔧 BACKEND HEALTH & CONFIGURATION', 'blue');
  
  await testAPI('Backend is online', 'GET', '/');
  await testAPI('API health check', 'GET', '/health');
  await testAPI('Admin can access levels', 'GET', '/admin/levels');
}

async function testUserManagement() {
  log('\n👥 USER MANAGEMENT', 'blue');
  
  await testAPI('Get all users', 'GET', '/admin/users?limit=10');
  await testAPI('Get user profile (self)', 'GET', '/users/profile');
  await testAPI('Get leaderboard', 'GET', '/xp/leaderboard');
  await testAPI('Get tribe leaderboard', 'GET', '/xp/tribes');
}

async function testQuizFunctionality() {
  log('\n🎯 QUIZ SYSTEM', 'blue');
  
  await testAPI('Get all quizzes', 'GET', '/quiz?limit=10');
  await testAPI('Get quiz leaderboard', 'GET', '/quiz/leaderboard');
  
  // Try to create a test quiz
  const quizData = {
    title: `Test Quiz ${new Date().getTime()}`,
    description: 'Automated test quiz',
    passingScore: 50,
    xpReward: 100,
    questions: [
      {
        questionText: 'Test Question 1?',
        questionType: 'MULTIPLE_CHOICE',
        options: ['Option A', 'Option B', 'Option C'],
        correctAnswer: 'Option A',
        orderIndex: 1,
      },
    ],
  };
  
  const createdQuiz = await testAPI('Create quiz', 'POST', '/quiz', quizData);
  if (createdQuiz?.id) {
    await testAPI('Get quiz by ID', 'GET', `/quiz/${createdQuiz.id}`);
    await testAPI('Publish quiz', 'PATCH', `/admin/quiz/${createdQuiz.id}/status`, { status: 'ACTIVE' });
  }
}

async function testSessionManagement() {
  log('\n📅 SESSIONS & EVENTS', 'blue');
  
  await testAPI('Get all sessions', 'GET', '/admin/sessions?limit=10');
  
  // Try to create a session
  const sessionData = {
    title: `Test Session ${new Date().getTime()}`,
    description: 'Automated test session',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    speaker: 'Test Speaker',
    location: 'Online',
  };
  
  const createdSession = await testAPI('Create session', 'POST', '/admin/sessions', sessionData);
  if (createdSession?.id) {
    await testAPI('Get session by ID', 'GET', `/admin/sessions/${createdSession.id}`);
    await testAPI('Activate session', 'PATCH', `/admin/sessions/${createdSession.id}/status`, { status: 'ACTIVE' });
  }
}

async function testSportsMatches() {
  log('\n⚽ SPORTS SYSTEM', 'blue');
  
  await testAPI('Get all matches', 'GET', '/sports/matches?limit=10');
  await testAPI('Get teams', 'GET', '/sports/teams?limit=10');
  await testAPI('Get standings', 'GET', '/sports/standings');
  
  // Try to create a match
  const matchData = {
    homeTeamId: '1',
    awayTeamId: '2',
    sport: 'Football',
    scheduledAt: new Date(Date.now() + 3600000).toISOString(),
  };
  
  await testAPI('Create match', 'POST', '/sports/matches', matchData);
}

async function testPublications() {
  log('\n📰 PUBLICATIONS & DOCUMENTS', 'blue');
  
  await testAPI('Get all publications', 'GET', '/publications?limit=10');
  
  // Try to create a publication
  const pubData = {
    title: `Test Publication ${new Date().getTime()}`,
    content: 'Automated test publication content',
    author: 'Test Author',
  };
  
  const createdPub = await testAPI('Create publication', 'POST', '/publications', pubData);
  if (createdPub?.id) {
    await testAPI('Publish document', 'PATCH', `/publications/${createdPub.id}`, { published: true });
  }
}

async function testAttendance() {
  log('\n✅ ATTENDANCE SYSTEM', 'blue');
  
  await testAPI('Get attendance records', 'GET', '/admin/attendance?limit=10');
  await testAPI('Get QR token', 'GET', '/attendance/qr-token');
}

async function testNotifications() {
  log('\n🔔 NOTIFICATIONS', 'blue');
  
  await testAPI('Get recent notifications', 'GET', '/notifications/recent?limit=20');
  await testAPI('Get all notifications', 'GET', '/notifications?limit=20');
  await testAPI('Mark all as read', 'PATCH', '/notifications/read-all');
}

async function testXPSystem() {
  log('\n⭐ XP & LEVELS', 'blue');
  
  await testAPI('Get XP leaderboard', 'GET', '/xp/leaderboard?limit=20');
  await testAPI('Get XP history', 'GET', '/xp/history/my-history?limit=20');
  await testAPI('Get levels', 'GET', '/admin/levels');
}

async function testBonusSystem() {
  log('\n🎁 BONUS SYSTEM', 'blue');
  
  await testAPI('Get bonus records', 'GET', '/admin/bonus?limit=10');
}

async function testWebAppPages() {
  log('\n🌐 WEB APP PAGES', 'blue');
  
  await testWebApp('Home page loads', '/');
  await testWebApp('Leaderboard loads', '/leaderboard');
  await testWebApp('Profile loads', '/profile');
  await testWebApp('Quiz list loads', '/quizzes');
}

async function testAdminDashboardPages() {
  log('\n🎛️ ADMIN DASHBOARD PAGES', 'blue');
  
  await testWebApp('Admin login page', 'https://ikigai-admin-dashboard.replit.app/login');
  await testWebApp('Admin dashboard home', 'https://ikigai-admin-dashboard.replit.app/');
}

async function testNotificationSystem() {
  log('\n🚀 NOTIFICATION DELIVERY SYSTEM', 'blue');
  
  // Test polling interval
  await testAPI('Verify 5-second polling endpoint', 'GET', '/notifications/recent?limit=1');
  
  // Check if notifications can be created
  const testNotification = {
    userId: 'test-user',
    type: 'QUIZ_CREATED',
    title: 'Test Notification',
    message: 'Testing notification system',
    data: { quizId: 'test' },
  };
  
  await testAPI('Create test notification', 'POST', '/notifications', testNotification);
}

// ============================================
// MAIN TEST EXECUTION
// ============================================

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║   IKIGAI PRODUCTION LIVE TEST SUITE                        ║', 'cyan');
  log('║   Testing all functions and systems                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\n🕐 Started: ${new Date().toLocaleString()}`, 'yellow');
  log(`📍 Backend: ${BACKEND_URL}`, 'yellow');
  log(`📍 Web App: ${WEB_APP_URL}`, 'yellow');
  log(`📍 Admin: ${ADMIN_DASHBOARD_URL}`, 'yellow');
  
  // Run all test suites
  await testBackendHealth();
  await testUserManagement();
  await testQuizFunctionality();
  await testSessionManagement();
  await testSportsMatches();
  await testPublications();
  await testAttendance();
  await testNotifications();
  await testXPSystem();
  await testBonusSystem();
  await testNotificationSystem();
  await testWebAppPages();
  await testAdminDashboardPages();
  
  // Print summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                     TEST SUMMARY                            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const total = testResults.passed + testResults.failed;
  const percentage = Math.round((testResults.passed / total) * 100);
  
  log(`\n✅ Passed: ${testResults.passed}/${total}`, 'green');
  log(`❌ Failed: ${testResults.failed}/${total}`, testResults.failed > 0 ? 'red' : 'green');
  log(`📊 Success Rate: ${percentage}%`, percentage >= 90 ? 'green' : 'yellow');
  
  log(`\n✨ Completed: ${new Date().toLocaleString()}`, 'yellow');
  
  // List failed tests
  if (testResults.failed > 0) {
    log('\n⚠️  Failed Tests:', 'yellow');
    testResults.tests.filter(t => !t.passed).forEach(t => {
      log(`  • ${t.name}: ${t.error}`, 'red');
    });
  }
  
  log('\n🎉 Production testing complete!\n', 'green');
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ FATAL ERROR: ${error.message}`, 'red');
  process.exit(1);
});
