# IKIGAI Production Live Test Suite
# Tests all major functions across backend, web app, and admin dashboard

$ErrorActionPreference = "SilentlyContinue"

# Configuration
$BACKEND_URL = "https://ikigai-backend.replit.app/api/v1"
$WEB_APP_URL = "https://ikigai-web-app.replit.app"
$ADMIN_DASHBOARD_URL = "https://ikigai-admin-dashboard.replit.app"
$ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNzExZjBlNC0zZDZmLTRhNmItOGQ5Ny1mYzI3MDI4ZjA3MWIiLCJlbWFpbCI6ImFkbWluQGlraWdhaS5xdWVzdCIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc4MDcwNjc2MywiZXhwIjoxNzgwNzA3NjYzfQ.EfyMFXp5zaX0zB0ajqDaWzgipKqGoWKFqQhNAA0GS3Q"

# Test results
$script:passed = 0
$script:failed = 0
$script:tests = @()

# ============================================
# HELPER FUNCTIONS
# ============================================

function Write-Header {
    param([string]$text)
    Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
}

function Write-Section {
    param([string]$text)
    Write-Host "`n$text" -ForegroundColor Blue
}

function Write-TestResult {
    param(
        [string]$name,
        [bool]$passed,
        [string]$error = ""
    )
    
    $script:tests += @{ name = $name; passed = $passed; error = $error }
    
    if ($passed) {
        $script:passed++
        Write-Host "✅ $name" -ForegroundColor Green
    } else {
        $script:failed++
        Write-Host "❌ $name: $error" -ForegroundColor Red
    }
}

function Test-API {
    param(
        [string]$name,
        [string]$method,
        [string]$endpoint,
        [object]$body = $null
    )
    
    try {
        $headers = @{
            "Authorization" = "Bearer $ADMIN_TOKEN"
            "Content-Type" = "application/json"
        }
        
        $url = "$BACKEND_URL$endpoint"
        
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            UseBasicParsing = $true
            TimeoutSec = 15
        }
        
        if ($body) {
            $params.Body = $body | ConvertTo-Json
        }
        
        $response = Invoke-WebRequest @params
        Write-TestResult -name $name -passed $true
        return $response.Content | ConvertFrom-Json
    } catch {
        $errorMsg = $_.Exception.Message
        if ($_.Exception.Response) {
            try {
                $errorMsg = $_.Exception.Response.StatusCode
            } catch { }
        }
        Write-TestResult -name $name -passed $false -error $errorMsg
        return $null
    }
}

function Test-WebPage {
    param(
        [string]$name,
        [string]$url
    )
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        Write-TestResult -name $name -passed $true
        return $true
    } catch {
        Write-TestResult -name $name -passed $false -error $_.Exception.Message
        return $false
    }
}

# ============================================
# TEST SUITES
# ============================================

function Test-BackendHealth {
    Write-Section "🔧 BACKEND HEALTH & CONFIGURATION"
    
    Test-API "Backend is online" "GET" "/" | Out-Null
    Test-API "API endpoints available" "GET" "/health" | Out-Null
    Test-API "Admin can access system" "GET" "/admin/levels" | Out-Null
}

function Test-UserManagement {
    Write-Section "👥 USER MANAGEMENT"
    
    Test-API "Get all users" "GET" "/admin/users?limit=10" | Out-Null
    Test-API "Get user profile" "GET" "/users/profile" | Out-Null
    Test-API "Get individual leaderboard" "GET" "/xp/leaderboard?limit=20" | Out-Null
    Test-API "Get tribe leaderboard" "GET" "/xp/tribes" | Out-Null
}

function Test-QuizSystem {
    Write-Section "🎯 QUIZ SYSTEM"
    
    $quizzes = Test-API "Get all quizzes" "GET" "/quiz?limit=10"
    Test-API "Get quiz leaderboard" "GET" "/quiz/leaderboard" | Out-Null
    
    # Test specific quiz if available
    if ($quizzes.data -and $quizzes.data.Count -gt 0) {
        $quizId = $quizzes.data[0].id
        Test-API "Get quiz details" "GET" "/quiz/$quizId" | Out-Null
        Test-API "Get quiz questions" "GET" "/quiz/$quizId/questions" | Out-Null
    }
}

function Test-Sessions {
    Write-Section "📅 SESSIONS & EVENTS"
    
    $sessions = Test-API "Get all sessions" "GET" "/admin/sessions?limit=10"
    
    # Test specific session if available
    if ($sessions.data -and $sessions.data.Count -gt 0) {
        $sessionId = $sessions.data[0].id
        Test-API "Get session details" "GET" "/admin/sessions/$sessionId" | Out-Null
    }
}

function Test-SportsSystem {
    Write-Section "⚽ SPORTS SYSTEM"
    
    Test-API "Get all matches" "GET" "/sports/matches?limit=10" | Out-Null
    Test-API "Get teams" "GET" "/sports/teams?limit=10" | Out-Null
    Test-API "Get standings/leaderboard" "GET" "/sports/standings" | Out-Null
}

function Test-Publications {
    Write-Section "📰 PUBLICATIONS & DOCUMENTS"
    
    $pubs = Test-API "Get all publications" "GET" "/publications?limit=10"
    
    # Test specific publication if available
    if ($pubs.data -and $pubs.data.Count -gt 0) {
        $pubId = $pubs.data[0].id
        Test-API "Get publication details" "GET" "/publications/$pubId" | Out-Null
    }
}

function Test-Attendance {
    Write-Section "✅ ATTENDANCE SYSTEM"
    
    Test-API "Get attendance records" "GET" "/admin/attendance?limit=10" | Out-Null
    Test-API "Get QR token" "GET" "/attendance/qr-token" | Out-Null
}

function Test-Notifications {
    Write-Section "🔔 NOTIFICATIONS & REAL-TIME"
    
    Test-API "Get recent notifications (5s polling)" "GET" "/notifications/recent?limit=20" | Out-Null
    Test-API "Get all notifications" "GET" "/notifications?limit=20" | Out-Null
    Test-API "Notification status check" "GET" "/notifications?limit=1" | Out-Null
}

function Test-XPSystem {
    Write-Section "⭐ XP & LEVELS"
    
    Test-API "Get XP leaderboard" "GET" "/xp/leaderboard?limit=20" | Out-Null
    Test-API "Get user XP history" "GET" "/xp/history/my-history?limit=20" | Out-Null
    Test-API "Get levels system" "GET" "/admin/levels" | Out-Null
}

function Test-BonusSystem {
    Write-Section "🎁 BONUS POINTS SYSTEM"
    
    Test-API "Get bonus records" "GET" "/admin/bonus?limit=10" | Out-Null
}

function Test-WebApp {
    Write-Section "🌐 WEB APP PAGES"
    
    Test-WebPage "Home page loads" "$WEB_APP_URL/" | Out-Null
    Test-WebPage "Leaderboard page" "$WEB_APP_URL/leaderboard" | Out-Null
    Test-WebPage "Profile page" "$WEB_APP_URL/profile" | Out-Null
    Test-WebPage "Quizzes page" "$WEB_APP_URL/quizzes" | Out-Null
}

function Test-AdminDashboard {
    Write-Section "🎛️ ADMIN DASHBOARD"
    
    Test-WebPage "Admin login page" "$ADMIN_DASHBOARD_URL/login" | Out-Null
    Test-WebPage "Admin dashboard home" "$ADMIN_DASHBOARD_URL/" | Out-Null
    Test-WebPage "Users management" "$ADMIN_DASHBOARD_URL/users" | Out-Null
    Test-WebPage "XP leaderboard" "$ADMIN_DASHBOARD_URL/xp" | Out-Null
    Test-WebPage "Quizzes management" "$ADMIN_DASHBOARD_URL/quizzes" | Out-Null
    Test-WebPage "Sessions management" "$ADMIN_DASHBOARD_URL/sessions" | Out-Null
}

function Test-APIEndpoints {
    Write-Section "🔌 CORE API ENDPOINTS"
    
    # Authentication
    Test-API "Auth endpoints available" "GET" "/auth/me" | Out-Null
    
    # Tribes
    Test-API "Get tribes" "GET" "/admin/tribes" | Out-Null
    
    # Search
    Test-API "Search users" "GET" "/search/users?q=admin" | Out-Null
}

# ============================================
# MAIN EXECUTION
# ============================================

Write-Header "IKIGAI PRODUCTION LIVE TEST SUITE"
Write-Host "Testing all functions and systems" -ForegroundColor Cyan
Write-Host "Started: $(Get-Date)" -ForegroundColor Yellow
Write-Host "Backend:  $BACKEND_URL" -ForegroundColor Yellow
Write-Host "Web App:  $WEB_APP_URL" -ForegroundColor Yellow
Write-Host "Admin:    $ADMIN_DASHBOARD_URL" -ForegroundColor Yellow

# Run all tests
Test-BackendHealth
Test-UserManagement
Test-QuizSystem
Test-Sessions
Test-SportsSystem
Test-Publications
Test-Attendance
Test-Notifications
Test-XPSystem
Test-BonusSystem
Test-WebApp
Test-AdminDashboard
Test-APIEndpoints

# ============================================
# SUMMARY
# ============================================

Write-Header "TEST SUMMARY"

$total = $script:passed + $script:failed
$percentage = if ($total -gt 0) { [math]::Round(($script:passed / $total) * 100) } else { 0 }

Write-Host "✅ Passed: $($script:passed)/$total" -ForegroundColor Green
Write-Host "❌ Failed: $($script:failed)/$total" -ForegroundColor $(if ($script:failed -gt 0) { "Red" } else { "Green" })
Write-Host "📊 Success Rate: $percentage%" -ForegroundColor $(if ($percentage -ge 90) { "Green" } else { "Yellow" })

Write-Host "Completed: $(Get-Date)" -ForegroundColor Yellow

if ($script:failed -gt 0) {
    Write-Host "`n⚠️  Failed Tests:" -ForegroundColor Yellow
    $script:tests | Where-Object { -not $_.passed } | ForEach-Object {
        Write-Host "  • $($_.name): $($_.error)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Production testing complete!`n" -ForegroundColor Green
