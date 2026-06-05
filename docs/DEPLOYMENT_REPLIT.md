# IKIGAI Quest - Deployment to Replit

**Step-by-step guide to deploy all services on Replit with production configuration**

---

## 📖 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Setup Replit Environment](#setup-replit-environment)
3. [Deploy Backend API](#deploy-backend-api)
4. [Deploy Web App](#deploy-web-app)
5. [Deploy Admin Dashboard](#deploy-admin-dashboard)
6. [Database Setup](#database-setup)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
9. [Production Checklist](#production-checklist)

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] All code committed to GitHub
- [ ] No sensitive keys in code
- [ ] Environment variables documented
- [ ] Database migrations tested locally
- [ ] Build passes locally (`npm run build`)
- [ ] All tests passing
- [ ] Latest code pulled from main branch
- [ ] Team notified of deployment

---

## Setup Replit Environment

### Step 1: Create Replit Account

1. Go to [replit.com](https://replit.com)
2. Click "Sign up" (or login if you have account)
3. Complete account creation
4. Verify email address

### Step 2: Create New Replit Project

#### Option A: From GitHub (Recommended)

1. Go to dashboard
2. Click "+ Create"
3. Select "Import from GitHub"
4. Paste GitHub URL: `https://github.com/YOUR_USERNAME/ikigai-quest`
5. Click "Import"
6. Wait for Replit to clone repository (~2 min)

#### Option B: Upload Files

1. Click "+ Create" → "Create Replit"
2. Select "Node.js" template
3. Click "Create Replit"
4. Use Replit's editor to upload files or use Git CLI

### Step 3: Configure Replit Settings

1. Click "Secrets" (lock icon)
2. Add all environment variables (see below)
3. Keep secrets file secure (never share)

**Required Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://username:password@db.host:5432/ikigai_db

# Authentication
JWT_SECRET=your_very_secure_random_string_min_32_chars

# Deployment
NODE_ENV=production
REPLIT_DOMAIN=your-replit-name.repl.co

# API URLs (after deployment)
VITE_API_URL=https://your-replit-backend.repl.co/api
ADMIN_API_URL=https://your-replit-backend.repl.co/api

# Optional: Monitoring
SENTRY_DSN=https://your_sentry_dsn

# Optional: Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## Deploy Backend API

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup Database

#### Using Replit Database (if available)

Replit provides built-in PostgreSQL:

```bash
# Install Prisma CLI
npm install -D prisma

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

#### Using External PostgreSQL

Use services like:
- **Supabase** (PostgreSQL hosting) - Free tier available
- **Heroku Postgres** - Good for small projects
- **DigitalOcean Managed Database**
- **AWS RDS** - Enterprise option

**Setup Steps:**
1. Create PostgreSQL database on chosen service
2. Get connection string
3. Add to `DATABASE_URL` in Replit secrets
4. Run migrations

### Step 3: Configure Replit Run Command

1. Create `.replit` file in root:

```yaml
run = "cd backend && npm run start"

[env]
PORT = "3000"
```

2. Create `start` script in `backend/package.json`:

```json
{
  "scripts": {
    "start": "node dist/app.js",
    "build": "tsc",
    "dev": "tsx src/app.ts",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed"
  }
}
```

3. Build backend:

```bash
cd backend
npm run build
```

### Step 4: Run Backend

```bash
# In Replit terminal
npm start
```

**Expected Output:**
```
Server running on port 3000
Connected to PostgreSQL database
API documentation: http://localhost:3000/api/docs
```

### Step 5: Get Backend URL

1. Replit auto-generates URL: `https://REPLIT-NAME.repl.co`
2. Copy the full domain
3. Add to frontend `.env` files

---

## Deploy Web App

### Step 1: Create Web App Replit

For web app and admin, create separate Repls (or same Repl with multiple services):

**Option 1: Separate Replit**
1. Create new Replit project
2. Upload web-app folder

**Option 2: Monorepo in Same Replit**
1. Keep in same project
2. Configure multiple run commands

### Step 2: Build Web App

```bash
cd web-app

# Create .env.production
echo "VITE_API_URL=https://your-backend-repl.repl.co/api" > .env.production

# Install dependencies
npm install

# Build
npm run build
```

### Step 3: Serve Web App

**Option A: Using Vite Preview**

```bash
npm run preview -- --port 5174
```

**Option B: Using Node Server**

```bash
# Install serve package
npm install -g serve

# Serve build
serve -s dist -l 5174
```

**Option C: Replit Configuration**

Create `.replit` in web-app folder:

```yaml
run = "cd web-app && npm run preview -- --port 5174"

[env]
VITE_API_URL = "https://your-backend-repl.repl.co/api"
```

### Step 4: Configure Environment

Update `web-app/.env.production`:

```env
VITE_API_URL=https://your-backend-repl.repl.co/api
VITE_APP_NAME=IKIGAI Quest
VITE_APP_VERSION=1.0.0
```

---

## Deploy Admin Dashboard

### Step 1: Setup Admin Dashboard

```bash
cd admin-dashboard

# Create .env.production
echo "VITE_API_URL=https://your-backend-repl.repl.co/api" > .env.production

# Install dependencies
npm install

# Build
npm run build
```

### Step 2: Configure as Separate Service

Create `.replit`:

```yaml
run = "cd admin-dashboard && npm run preview -- --port 5173"

[env]
VITE_API_URL = "https://your-backend-repl.repl.co/api"
```

### Step 3: Serve Admin Dashboard

```bash
npm run preview -- --port 5173
```

---

## Database Setup

### Option 1: Supabase (Recommended for Easy Setup)

1. Go to [supabase.com](https://supabase.com)
2. Sign up and create new project
3. Copy PostgreSQL connection string
4. Paste into Replit `DATABASE_URL` secret

```bash
# Initialize database
cd backend
npx prisma db push
```

### Option 2: Replit PostgreSQL

If Replit offers managed database:

```bash
# Create database
# (Replit handles this)

# Connect via DATABASE_URL (provided by Replit)

# Push schema
npx prisma db push
```

### Option 3: External PostgreSQL Host

Use any PostgreSQL provider:

1. Create database instance
2. Get connection string: `postgresql://user:pass@host:5432/dbname`
3. Add to Replit secrets as `DATABASE_URL`
4. Run migrations

### Database Initialization

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Push schema
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

### Verify Database Connection

```typescript
// test-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log(`Database connected! Found ${users.length} users`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
```

Run test:
```bash
npx ts-node test-db.ts
```

---

## Post-Deployment Configuration

### Step 1: Update Frontend URLs

After deployment, update API URLs in all frontend apps:

**Web App** (`web-app/.env`):
```env
VITE_API_URL=https://your-backend-repl.repl.co/api
```

**Admin Dashboard** (`admin-dashboard/.env`):
```env
VITE_API_URL=https://your-backend-repl.repl.co/api
```

**Mobile App** (`mobile-app/.env`):
```env
REACT_APP_API_URL=https://your-backend-repl.repl.co/api
```

### Step 2: Test All Endpoints

```bash
# Test backend health
curl https://your-backend-repl.repl.co/api/health

# Test auth
curl -X POST https://your-backend-repl.repl.co/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test quiz endpoint
curl https://your-backend-repl.repl.co/api/quiz/available
```

### Step 3: Setup CORS (if needed)

```typescript
// backend/src/app.ts
import cors from 'cors'

app.use(cors({
  origin: [
    'https://your-web-app.repl.co',
    'https://your-admin.repl.co',
    'https://your-mobile.repl.co'
  ],
  credentials: true
}))
```

### Step 4: Configure HTTPS

Replit automatically provides HTTPS for `.repl.co` domains.

For custom domains:
1. Get custom domain
2. Configure DNS to point to Replit
3. Replit auto-provisions SSL certificate (Let's Encrypt)

---

## Monitoring & Troubleshooting

### Check Logs

**Backend Logs:**
```bash
# View in Replit console
# Logs appear in real-time as requests come in
```

**Frontend Logs:**
```bash
# Check browser console (F12)
# Check Network tab for failed requests
```

### Common Issues & Solutions

#### Issue 1: Database Connection Fails

**Error**: `Can't reach database server at 'db.host'`

**Solutions**:
1. Verify connection string in `DATABASE_URL`
2. Check database is running and accessible
3. Verify firewall allows Replit IP
4. Test locally first to isolate issue

```bash
# Test connection
npx prisma db execute --stdin < test-query.sql
```

#### Issue 2: API Returns 401 Unauthorized

**Error**: `Token invalid or expired`

**Solutions**:
1. Verify `JWT_SECRET` is set correctly
2. Check token expiration (24 hours)
3. Verify Authorization header format: `Bearer <token>`
4. Clear browser storage and re-login

#### Issue 3: CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions**:
1. Add frontend domains to CORS whitelist
2. Include `credentials: true` in CORS config
3. Verify API URL is correct in frontend `.env`

```typescript
// backend/src/app.ts
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true
}))
```

#### Issue 4: Build Fails

**Error**: `npm ERR! code ERESOLVE`

**Solutions**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm package-lock.json
npm install --legacy-peer-deps
```

### Performance Monitoring

**Metrics to Monitor:**
- API response time (should be < 500ms)
- Database query time (should be < 100ms)
- Memory usage (Replit free tier: 512MB limit)
- Request rate (watch for spikes)

**Enable APM (Application Performance Monitoring):**

```typescript
// Optional: Use Sentry for error tracking
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

---

## Production Checklist

Before going live, verify:

### Security
- [ ] JWT_SECRET is long and random (32+ characters)
- [ ] No API keys in code (use environment variables)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] HTTPS enabled (auto on Replit)
- [ ] Password hashing in place (bcrypt)

### Performance
- [ ] Database indexes created
- [ ] Caching configured
- [ ] Assets minified
- [ ] Gzip compression enabled
- [ ] Database connection pooling
- [ ] Load tested (simulate users)

### Functionality
- [ ] All quizzes load correctly
- [ ] QR code scanning works
- [ ] Leaderboard displays
- [ ] Login/register works
- [ ] File uploads work
- [ ] Email notifications work (if enabled)
- [ ] Mobile app works

### Operations
- [ ] Backup strategy in place
- [ ] Logs stored (for debugging)
- [ ] Monitoring alerts configured
- [ ] Deployment procedure documented
- [ ] Rollback plan ready
- [ ] Team trained on system

### Data
- [ ] Database backed up
- [ ] User data encrypted
- [ ] GDPR compliance (if needed)
- [ ] Privacy policy updated
- [ ] Terms of service ready

---

## Maintenance & Updates

### Regular Maintenance

```bash
# Daily
- Monitor logs for errors
- Check system performance

# Weekly
- Update dependencies: npm update
- Review security advisories

# Monthly
- Database cleanup/optimization
- Backup verification
- Performance analysis
- User feedback review
```

### Deployment Updates

```bash
# To deploy new version:

# 1. Test locally
npm run build
npm run test

# 2. Commit and push
git add .
git commit -m "Feature: description"
git push origin main

# 3. Pull in Replit
# (Auto if using GitHub sync)
# (Manual if not)

# 4. Rebuild
npm run build

# 5. Test production
curl https://your-app.repl.co/api/health

# 6. Monitor logs
# Watch for errors in first 5 minutes
```

---

## Scaling Considerations

### Limits on Replit Free Tier
- 512MB RAM
- 5GB storage (for databases, on paid tiers)
- CPU: Shared
- Network: Reasonable fair use

### When to Upgrade
- Frequent 429 (rate limited) errors
- Response time > 2 seconds
- Database size > 1GB
- 100+ concurrent users

### Scaling Options
1. **Replit Pro** - More resources ($7/month)
2. **External Services**:
   - Backend: Heroku, Railway, Render
   - Database: Supabase, Neon, Amazon RDS
   - Frontend: Vercel, Netlify, AWS S3
3. **Docker Deployment** - For production

---

## Rollback Procedure

If deployment breaks production:

```bash
# 1. Stop current services
# (Replit: Click "Stop")

# 2. Revert to last working commit
git log --oneline  # Find good commit
git revert <commit-hash>
git push origin main

# 3. Pull changes in Replit
git pull origin main

# 4. Rebuild
npm run build

# 5. Restart services
# (Replit: Click "Run")

# 6. Verify
curl https://your-app.repl.co/api/health
```

---

## Support & Resources

### Documentation
- [Replit Docs](https://docs.replit.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)

### Helpful Links
- [Replit Community](https://replit.com/community)
- [Stack Overflow](https://stackoverflow.com)
- [GitHub Issues](https://github.com)

### Getting Help
- Check logs first
- Search existing issues
- Ask in community forums
- Contact hosting provider support

---

**Last Updated**: June 5, 2026
**Version**: 1.0
**Tested On**: Node.js 18+, Replit, PostgreSQL 13+

