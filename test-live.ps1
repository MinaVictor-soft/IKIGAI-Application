# IKIGAI Production Live Test Suite - PowerShell

$ErrorActionPreference = "SilentlyContinue"

$BACKEND = "https://ikigai-backend.replit.app/api/v1"
$WEB = "https://ikigai-web-app.replit.app"
$ADMIN = "https://ikigai-admin-dashboard.replit.app"
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNzExZjBlNC0zZDZmLTRhNmItOGQ5Ny1mYzI3MDI4ZjA3MWIiLCJlbWFpbCI6ImFkbWluQGlraWdhaS5xdWVzdCIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc4MDcwNjc2MywiZXhwIjoxNzgwNzA3NjYzfQ.EfyMFXp5zaX0zB0ajqDaWzgipKqGoWKFqQhNAA0GS3Q"

$passed = 0
$failed = 0
$tests = @()

function Log-Test {
    param([string]$name, [bool]$ok, [string]$err = "")
    if ($ok) {
        $passed++
        Write-Host "[PASS] $name" -ForegroundColor Green
    } else {
        $failed++
        Write-Host "[FAIL] $name - $err" -ForegroundColor Red
    }
}

function Test-API {
    param([string]$name, [string]$method, [string]$endpoint)
    try {
        $url = "$BACKEND$endpoint"
        $result = Invoke-WebRequest -Uri $url -Method $method -Headers @{"Authorization" = "Bearer $TOKEN"} -UseBasicParsing -TimeoutSec 15
        Log-Test $name $true
        return $result.Content | ConvertFrom-Json
    } catch {
        Log-Test $name $false $_.Exception.Message
        return $null
    }
}

function Test-Web {
    param([string]$name, [string]$url)
    try {
        $result = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        Log-Test $name $true
    } catch {
        Log-Test $name $false $_.Exception.Message
    }
}

Write-Host "`n========== IKIGAI PRODUCTION TEST ==========" -ForegroundColor Cyan
Write-Host "Time: $(Get-Date)" -ForegroundColor Yellow
Write-Host "Backend: $BACKEND" -ForegroundColor Yellow
Write-Host "Web App: $WEB" -ForegroundColor Yellow
Write-Host "Admin: $ADMIN" -ForegroundColor Yellow

Write-Host "`n[BACKEND TESTS]" -ForegroundColor Cyan
Test-API "Health Check" "GET" "/" | Out-Null
Test-API "Admin Levels" "GET" "/admin/levels" | Out-Null
Test-API "Users" "GET" "/admin/users?limit=10" | Out-Null
Test-API "Profile" "GET" "/users/profile" | Out-Null
Test-API "Leaderboard" "GET" "/xp/leaderboard?limit=20" | Out-Null
Test-API "Tribes" "GET" "/xp/tribes" | Out-Null

Write-Host "`n[QUIZ SYSTEM]" -ForegroundColor Cyan
Test-API "Get Quizzes" "GET" "/quiz?limit=10" | Out-Null
Test-API "Quiz Leaderboard" "GET" "/quiz/leaderboard" | Out-Null

Write-Host "`n[SESSIONS]" -ForegroundColor Cyan
Test-API "Get Sessions" "GET" "/admin/sessions?limit=10" | Out-Null

Write-Host "`n[SPORTS]" -ForegroundColor Cyan
Test-API "Get Matches" "GET" "/sports/matches?limit=10" | Out-Null
Test-API "Get Teams" "GET" "/sports/teams?limit=10" | Out-Null
Test-API "Get Standings" "GET" "/sports/standings" | Out-Null

Write-Host "`n[PUBLICATIONS]" -ForegroundColor Cyan
Test-API "Get Publications" "GET" "/publications?limit=10" | Out-Null

Write-Host "`n[ATTENDANCE]" -ForegroundColor Cyan
Test-API "Attendance Records" "GET" "/admin/attendance?limit=10" | Out-Null
Test-API "QR Token" "GET" "/attendance/qr-token" | Out-Null

Write-Host "`n[NOTIFICATIONS - 5s Polling]" -ForegroundColor Cyan
Test-API "Recent Notifications" "GET" "/notifications/recent?limit=20" | Out-Null
Test-API "All Notifications" "GET" "/notifications?limit=20" | Out-Null

Write-Host "`n[XP SYSTEM]" -ForegroundColor Cyan
Test-API "XP Leaderboard" "GET" "/xp/leaderboard?limit=20" | Out-Null
Test-API "XP History" "GET" "/xp/history/my-history?limit=20" | Out-Null

Write-Host "`n[BONUS SYSTEM]" -ForegroundColor Cyan
Test-API "Bonus Records" "GET" "/admin/bonus?limit=10" | Out-Null

Write-Host "`n[WEB APP PAGES]" -ForegroundColor Cyan
Test-Web "Home" "$WEB/" | Out-Null
Test-Web "Leaderboard" "$WEB/leaderboard" | Out-Null
Test-Web "Profile" "$WEB/profile" | Out-Null
Test-Web "Quizzes" "$WEB/quizzes" | Out-Null

Write-Host "`n[ADMIN DASHBOARD]" -ForegroundColor Cyan
Test-Web "Admin Login" "$ADMIN/login" | Out-Null
Test-Web "Admin Home" "$ADMIN/" | Out-Null
Test-Web "Users" "$ADMIN/users" | Out-Null
Test-Web "XP Board" "$ADMIN/xp" | Out-Null
Test-Web "Quizzes" "$ADMIN/quizzes" | Out-Null
Test-Web "Sessions" "$ADMIN/sessions" | Out-Null
Test-Web "Sports" "$ADMIN/sports" | Out-Null

Write-Host "`n========== SUMMARY ==========" -ForegroundColor Cyan
$total = $passed + $failed
$pct = if ($total -gt 0) { [math]::Round(($passed / $total) * 100) } else { 0 }
Write-Host "Passed: $passed / $total" -ForegroundColor Green
Write-Host "Failed: $failed / $total" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
Write-Host "Success Rate: $pct%" -ForegroundColor $(if ($pct -ge 90) { "Green" } else { "Yellow" })
Write-Host "Completed: $(Get-Date)" -ForegroundColor Yellow
Write-Host "`nProduction testing complete!`n" -ForegroundColor Green
