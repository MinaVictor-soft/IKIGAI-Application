# Setup for Each Project on Replit

## 🔧 Backend

**Required Files:**
- ✅ `package.json` - dependencies
- ✅ `.env` - DATABASE_URL, JWT_SECRET
- ✅ `prisma/schema.prisma` - database schema
- ✅ `tsconfig.json` - TypeScript config

**Before sending to Replit:**
```bash
cd backend
npm install
npx prisma generate
npm run build
```

**Environment Variables (.env):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

**Start Command:**
```bash
npm run start
# or
npm run dev
```

---

## 🌐 Web App

**Required Files:**
- ✅ `package.json` - dependencies
- ✅ `vite.config.ts` - build config
- ✅ `.env.local` - VITE_API_URL
- ✅ `tsconfig.json` - TypeScript config

**Before sending to Replit:**
```bash
cd web-app
npm install
npm run build
```

**Environment Variables (.env.local):**
```
VITE_API_URL=http://localhost:3000/api
```

**Start Command:**
```bash
npm run dev
# Runs on port 5174
```

---

## 🛠️ Admin Dashboard

**Required Files:**
- ✅ `package.json` - dependencies
- ✅ `vite.config.ts` - build config
- ✅ `.env.local` - VITE_API_URL
- ✅ `tsconfig.json` - TypeScript config

**Before sending to Replit:**
```bash
cd admin-dashboard
npm install
npm run build
```

**Environment Variables (.env.local):**
```
VITE_API_URL=http://localhost:3000/api
```

**Start Command:**
```bash
npm run dev
# Runs on port 5173
```

---

## ✅ Quick Verification

Run these before sending:

```bash
# Backend
cd backend && npm install && npm run build && npm run dev &

# Web
cd web-app && npm install && npm run build && npm run dev &

# Admin
cd admin-dashboard && npm install && npm run build && npm run dev &
```

Check if they start without errors. If yes, ready for Replit! ✅

---

## 📤 Upload to Replit

Just upload the folders as-is. Replit will:
1. Detect `package.json`
2. Run `npm install`
3. Use `.env` variables
4. Run start command

All automatic! 🚀
