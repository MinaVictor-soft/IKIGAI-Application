# ✅ Post-Replit Deployment Checklist

**Verify everything works correctly after deploying to Replit**

---

## 🚀 Immediate After Deployment

### Backend API
- [ ] Check if backend is running: `https://your-replit-name.repl.co/api`
- [ ] Check health endpoint: `https://your-replit-name.repl.co/api/health`
- [ ] Check Swagger docs: `https://your-replit-name.repl.co/api-docs`
- [ ] Database connection working (check logs)
- [ ] JWT secret configured
- [ ] Environment variables set

### Web App
- [ ] Page loads: `https://your-replit-name.repl.co`
- [ ] Design/CSS displays correctly
- [ ] Login form visible
- [ ] Navigation menu works
- [ ] Responsive on mobile

### Admin Dashboard
- [ ] Page loads: `https://your-replit-name.repl.co:5173`
- [ ] Login page styled correctly
- [ ] Can navigate to pages

---

## 🔧 Fix If Design Looks Wrong

**If CSS is missing (plain styling):**

```bash
# On Replit terminal
cd $HOME/IKIGAI-APP/web-app

# Rebuild CSS
rm -rf dist
npm run build

# Verify CSS exists
ls dist/assets/*.css

# Should NOT be empty!
du -sh dist/assets/*.css
```

**If still not working:**
1. Check `tailwind.config.ts` content paths
2. Verify `.env` files exist
3. Check `.replit` configuration
4. Restart the server
5. Clear browser cache (Ctrl+Shift+Delete)

See: [FIX_DESIGN_AFTER_REPLIT_DEPLOYMENT.md](FIX_DESIGN_AFTER_REPLIT_DEPLOYMENT.md)

---

## 🧪 Functionality Tests

### Authentication
- [ ] Register new user works
- [ ] Login with credentials works
- [ ] Logout works
- [ ] Refresh token works
- [ ] Protected routes redirect to login

### User Features
- [ ] View homepage/dashboard
- [ ] View profile
- [ ] Update profile information
- [ ] View leaderboard (individual and tribes)
- [ ] Browse quizzes
- [ ] Take a quiz (if available)
- [ ] Submit quiz and see score
- [ ] View events/sessions
- [ ] Scan QR code (if available)
- [ ] View publications
- [ ] View sports matches

### API Endpoints
- [ ] GET `/auth/me` - Returns current user ✓
- [ ] GET `/xp/leaderboard` - Returns rankings ✓
- [ ] GET `/quiz/available` - Lists quizzes ✓
- [ ] POST `/attendance/scan` - Accepts QR scan ✓
- [ ] GET `/sports/matches` - Lists matches ✓
- [ ] GET `/publications` - Lists articles ✓

### Admin Features
- [ ] Login to admin dashboard
- [ ] Create new user
- [ ] Create new quiz
- [ ] Create attendance session
- [ ] View statistics
- [ ] Manage users
- [ ] Manage quizzes

---

## 🔍 Browser DevTools Checks

**Console Tab:**
- [ ] No red errors
- [ ] No CORS errors
- [ ] No 404 errors for assets
- [ ] API calls returning 200

**Network Tab:**
- [ ] CSS file loading (size > 0 KB)
- [ ] JS files loading
- [ ] No red (404) requests
- [ ] API responses successful

**Elements Tab:**
- [ ] HTML properly formatted
- [ ] CSS classes applied
- [ ] No broken styling

---

## 📊 Performance Checks

**Page Load:**
- [ ] Home page loads in < 5 seconds
- [ ] No lag on interactions
- [ ] Smooth animations (if any)

**Mobile:**
- [ ] Responsive on 375px width
- [ ] Touch interactions work
- [ ] Navigation accessible

**API:**
- [ ] Endpoints respond in < 2 seconds
- [ ] No timeouts
- [ ] Handles concurrent requests

---

## 🔐 Security Checks

- [ ] HTTPS is active (lock icon)
- [ ] No sensitive data in console
- [ ] JWT tokens in HttpOnly cookies (if applicable)
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation working

---

## 🗄️ Database Checks

```bash
# On Replit terminal
# Check if database is connected
npx prisma db execute --stdin <<EOF
SELECT COUNT(*) as user_count FROM "User";
EOF

# Check migrations applied
npx prisma migrate status

# View database info
npx prisma db pull
```

- [ ] Database connection active
- [ ] All migrations applied
- [ ] Tables created
- [ ] Sample data exists

---

## 📈 Monitoring

### Check Replit Logs
```bash
# View recent logs
tail -100 ~/.replit_logs.txt

# Watch logs in real-time
tail -f ~/.replit_logs.txt
```

### Common Issues to Watch For
- [ ] Memory usage (should be < 200 MB)
- [ ] CPU usage (should be < 30%)
- [ ] Disk space available
- [ ] No OOM killer events
- [ ] No crashes in logs

---

## 🚨 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| CSS not loading | [Fix CSS Guide](FIX_DESIGN_AFTER_REPLIT_DEPLOYMENT.md) |
| Login not working | Check JWT_SECRET env var, database connection |
| 404 errors | Check API URL in .env, ensure backend is running |
| Slow performance | Check Replit specs, optimize queries |
| CORS errors | Verify CORS config in backend/src/app.ts |
| Database errors | Run `npx prisma db push`, check DB connection |

---

## ✅ Production Readiness Checklist

- [ ] All features working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Backup strategy in place
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] Documentation updated
- [ ] User onboarding ready
- [ ] Support channel active

---

## 📞 If Issues Persist

1. **Check Logs**
   ```bash
   # View application logs
   journalctl -u replit -f
   ```

2. **Run Diagnostics**
   ```bash
   # Check system info
   uname -a
   node --version
   npm --version
   
   # Check process
   ps aux | grep node
   
   # Check ports
   netstat -tuln | grep 3000
   ```

3. **Restart Everything**
   ```bash
   # Kill all Node processes
   pkill -f node
   
   # Restart
   npm run dev
   ```

4. **Factory Reset (if needed)**
   ```bash
   # Clean rebuild
   rm -rf node_modules dist .next
   npm ci
   npm run build
   ```

---

## 📝 Notes

- Keep a record of deployment date and time
- Document any custom configurations
- Save admin credentials securely
- Monitor error rates daily for first week
- Collect user feedback on design/UX

---

**Last Updated:** June 5, 2026  
**Status:** Ready for Production ✅

