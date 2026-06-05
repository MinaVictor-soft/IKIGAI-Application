# ⚡ Quick Start - Zero Config Deployment

## What You Get

✅ **One Click Deploy to Replit** - Just import from GitHub and click Run  
✅ **Automatic Setup** - All dependencies, build, database setup (no manual steps)  
✅ **All Services Running** - Backend, Web App, Admin Dashboard simultaneously  
✅ **Production Ready** - Fully configured for day-1 usage  

---

## 🎯 Deploy in 30 Seconds

### 1️⃣ Go to Replit
Visit: https://replit.com

### 2️⃣ Import Project
- Click: **+ Create Repl**
- Select: **Import from GitHub**
- Paste: `https://github.com/MinaVictor-soft/IKIGAI-APP`
- Click: **Import**

### 3️⃣ Click Run
- Wait 2-3 minutes for setup
- Services start automatically

### 4️⃣ Access Your App
```
Web App        → https://your-replit-name.repl.co:5174
Admin Panel    → https://your-replit-name.repl.co:5173
Backend API    → https://your-replit-name.repl.co:3000
API Docs       → https://your-replit-name.repl.co:3000/api-docs
```

---

## 🔑 Login Credentials

```
Email:    admin@example.com
Password: password123
```

**⚠️ Change these immediately after login for production!**

---

## 🤔 How It Works

### What Happens When You Click Run:

1. **setup.sh** runs:
   - Installs dependencies for all 4 apps
   - Builds backend, web, and admin apps
   - Creates database tables
   - Sets up environment variables

2. **.replit** configures:
   - Automatic build command
   - Environment variables
   - Port forwarding
   - Node.js settings

3. **start.sh** then:
   - Starts backend API on port 3000
   - Starts web app on port 5174
   - Starts admin dashboard on port 5173
   - All running simultaneously

---

## 📁 Project Structure

```
IKIGAI-APP/
├── backend/              ← Node.js/Express API
├── web-app/              ← React web application
├── admin-dashboard/      ← React admin panel
├── mobile-app/           ← React Native (mobile)
├── docs/                 ← Complete documentation
├── .replit               ← Replit configuration
├── setup.sh              ← Auto-setup script
├── start.sh              ← Start all services
└── package.json          ← Root scripts
```

---

## 🚀 Available Commands

```bash
# Deploy (one-time)
npm run setup

# Start all services
npm run start
npm run dev

# Start individual services
npm run backend       # Backend only
npm run web          # Web app only
npm run admin        # Admin dashboard only

# Build all
npm run build
npm run build:backend
npm run build:web
npm run build:admin
```

---

## ✨ Features Included

### Backend API
- ✅ User authentication (JWT)
- ✅ Quiz system with scoring
- ✅ Leaderboard & XP tracking
- ✅ QR code attendance
- ✅ Sports match tracking
- ✅ Publication system
- ✅ Swagger API documentation
- ✅ Role-based access control

### Web Application
- ✅ Responsive design (desktop)
- ✅ Real-time notifications
- ✅ Quiz participation
- ✅ Leaderboard viewing
- ✅ Event management
- ✅ Multi-language (EN/AR)
- ✅ Dark/light theme

### Admin Dashboard
- ✅ User management
- ✅ Quiz creation & editing
- ✅ Analytics & reports
- ✅ System configuration
- ✅ Audit logging
- ✅ Event management

### Mobile App
- ✅ Cross-platform (iOS/Android)
- ✅ QR code scanner
- ✅ Offline support
- ✅ Push notifications
- ✅ Multi-language support

---

## 🔧 Configuration

### Environment Variables
Automatically set in `.env` files:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ikigai_quest
JWT_SECRET=ikigai-quest-super-secret-key
VITE_API_URL=https://your-replit-name.repl.co/api
NODE_ENV=production
```

**For production:** Edit these values in Replit Secrets

---

## ⚠️ Important Notes

### Before Going Live

1. **Change JWT_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Add to Replit Secrets

2. **Change Admin Password**
   - Login to admin dashboard
   - Go to Users → Edit Admin
   - Reset password

3. **Update Database**
   - Use managed PostgreSQL (not local)
   - Set `DATABASE_URL` in Replit Secrets

4. **Configure CORS**
   - Backend: Add your domain to CORS whitelist
   - File: `backend/src/app.ts`

---

## 🆘 Troubleshooting

### App won't start

**Check logs:**
```bash
# View build output
# Click "Shell" tab in Replit
tail -f .logs
```

**Clear and rebuild:**
```bash
rm -rf node_modules
rm -rf */node_modules
npm run setup
```

### Port conflicts

```bash
# Kill existing processes
pkill -f node

# Then click Run again
```

### Database issues

```bash
# Check if PostgreSQL is running
psql --version

# Reset database
npx prisma db push --force-reset
```

### CSS not loading

```bash
cd web-app
npm run build
# Wait for build to complete
```

---

## 📊 Performance

### Replit Resources (Free tier)
- ✅ Perfect for development
- ✅ Small teams testing
- ✅ Demo deployments

### For Production
Consider upgrading to:
- **Replit Hacker** (paid tier)
- **Railway** / **Render** / **Heroku**
- **Cloud providers** (AWS, Azure, GCP)

---

## 📚 Complete Documentation

For more details:
- API Reference: `docs/API_ENDPOINTS_REFERENCE.md`
- Database Schema: `docs/DATABASE_SCHEMA_COMPLETE.md`
- Deployment Guide: `docs/DEPLOYMENT_REPLIT.md`
- Troubleshooting: `docs/FIX_DESIGN_AFTER_REPLIT_DEPLOYMENT.md`
- Post-Deployment: `docs/POST_DEPLOYMENT_CHECKLIST.md`

---

## ✅ Deployment Checklist

- [ ] Import from GitHub
- [ ] Click Run
- [ ] Wait for setup (2-3 min)
- [ ] Open Web App URL
- [ ] Test login with admin@example.com / password123
- [ ] Change admin password
- [ ] Update JWT_SECRET
- [ ] Verify all services running
- [ ] Test API endpoints
- [ ] Check admin dashboard
- [ ] Test QR scanner (if mobile)
- [ ] Go live! 🚀

---

## 🎉 That's All!

Your app is ready to go!

**No complex configuration. No manual setup. Just click and run.**

---

## 📞 Support

Questions? Check the docs folder or review:
- GitHub: https://github.com/MinaVictor-soft/IKIGAI-APP
- Issues: Feel free to open an issue

---

**Happy deploying! 🚀**

