# 📍 Quick File Reference

**Where to find everything in IKIGAI Quest**

---

## 📂 Project Structure

```
IKIGAI/
├── 📁 backend/                    Backend API (Node.js)
├── 📁 web-app/                    Web application (React)
├── 📁 admin-dashboard/            Admin panel (React)
├── 📁 mobile-app/                 Mobile app (React Native)
├── 📁 docs/                       📖 ALL DOCUMENTATION HERE
├── 📄 package.json
├── 📄 README.md                   Project overview
```

---

## 📚 Documentation Location

All documentation is in the **`docs/`** folder:

### Main Guides (Start Here!)

| File | For | Access |
|------|-----|--------|
| **README.md** | Everyone | [View](README.md) |
| **BUSINESS_GUIDE.md** | Users & Admins | [MD](BUSINESS_GUIDE.md) / [DOCX](BUSINESS_GUIDE.docx) |
| **CODE_STRUCTURE.md** | Developers | [MD](CODE_STRUCTURE.md) / [DOCX](CODE_STRUCTURE.docx) |
| **TECHNICAL_DETAILS.md** | Advanced Devs | [MD](TECHNICAL_DETAILS.md) / [DOCX](TECHNICAL_DETAILS.docx) |
| **DEPLOYMENT_REPLIT.md** | DevOps | [MD](DEPLOYMENT_REPLIT.md) / [DOCX](DEPLOYMENT_REPLIT.docx) |

---

## 🔍 Find Code By Feature

### Web App Pages

| Feature | File | Location |
|---------|------|----------|
| Leaderboard | LeaderboardPage.tsx | `web-app/src/pages/` |
| Quiz Playing | QuizPlayPage.tsx | `web-app/src/pages/` |
| QR Scanning | ScannerPage.tsx | `web-app/src/pages/` |
| All Routes | App.tsx | `web-app/src/` |

### Backend Modules

| Module | Files | Location |
|--------|-------|----------|
| Auth | auth.controller.ts, auth.routes.ts | `backend/src/modules/auth/` |
| Quiz | quiz.controller.ts, quiz.routes.ts | `backend/src/modules/quiz/` |
| Attendance (QR) | attendance.controller.ts | `backend/src/modules/attendance/` |
| XP/Leaderboard | xp.controller.ts, xp.service.ts | `backend/src/modules/xp/` |
| Sports | sports.controller.ts, sports.routes.ts | `backend/src/modules/sports/` |
| Admin | admin.controller.ts, admin.routes.ts | `backend/src/modules/admin/` |

### Database

| Item | File | Location |
|------|------|----------|
| Schema | schema.prisma | `backend/prisma/` |
| Migrations | migrations/ | `backend/prisma/migrations/` |
| Seeding | seed.ts | `backend/prisma/` |

### Translations

| Language | File | Location |
|----------|------|----------|
| English | en.json | `web-app/src/i18n/locales/` |
| Arabic | ar.json | `web-app/src/i18n/locales/` |

---

## 🛠️ Development Commands

### Web App
```bash
cd web-app
npm install           # Install dependencies
npm run dev          # Start dev server (port 5174)
npm run build        # Build for production
npm run lint         # Run linter
npm run type-check   # Check TypeScript
```

### Backend
```bash
cd backend
npm install
npm run dev          # Start dev server (port 3000)
npm run build
npm start
npx prisma db push  # Update database
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev          # Start (port 5173)
npm run build
```

### Mobile
```bash
cd mobile-app
npm install
expo start           # Start dev (port 8081)
eas build            # Build APK
```

---

## 📊 Key Statistics

| Item | Count |
|------|-------|
| Web App Pages | 11 |
| Mobile Screens | 14 |
| Backend Modules | 6 |
| API Endpoints | 30+ |
| Database Tables | 10+ |
| Documentation Files | 10 |
| Total Documentation | 18,500+ words |
| Languages Supported | 2 (EN, AR) |

---

## 🔐 Credentials & Secrets

Location: **`.env`** files (not in Git, create locally)

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Web App (.env)
```
VITE_API_URL=http://localhost:3000/api
```

### Mobile (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

---

## 🌐 Deployment URLs

After deployment to Replit:
- Backend: `https://your-replit-name.repl.co`
- Web App: `https://your-web-app.repl.co`
- Admin: `https://your-admin.repl.co`

---

## 📱 Test Accounts

**Development** (use after seeding):
```
User Account:
  Email: user@example.com
  Password: password123

Staff Account:
  Email: staff@example.com
  Password: password123

Admin Account:
  Email: admin@example.com
  Password: password123
```

---

## 🆘 Troubleshooting

### Build Fails
→ See [DEPLOYMENT_REPLIT.md](DEPLOYMENT_REPLIT.md#troubleshooting)

### API Connection Error
→ Check `VITE_API_URL` in `.env` files

### Database Issues
→ See [CODE_STRUCTURE.md](CODE_STRUCTURE.md#database-schema)

### Feature Not Working
→ Check [BUSINESS_GUIDE.md](BUSINESS_GUIDE.md#faq)

---

## 📞 Key Contacts

- **Technical Questions** → See [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md)
- **User Support** → See [BUSINESS_GUIDE.md](BUSINESS_GUIDE.md#faq)
- **Deployment Help** → See [DEPLOYMENT_REPLIT.md](DEPLOYMENT_REPLIT.md)

---

**Last Updated**: June 5, 2026  
**Status**: ✅ Production Ready
