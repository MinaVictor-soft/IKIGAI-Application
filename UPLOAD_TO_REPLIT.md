# 📤 Upload Folders to Replit - Instructions

Each folder is ready to upload independently to Replit. Each has its own `.replit` config file.

---

## 🔧 Backend

**Upload:** `backend` folder

**Steps:**
1. Go to https://replit.com
2. Click `+ Create Repl`
3. Select `Import from GitHub` OR upload as `.zip`
4. Upload the `backend` folder
5. Click `Run` button
6. Add these to **Secrets** (click lock icon):
   - `DATABASE_URL` = `postgresql://...`
   - `JWT_SECRET` = your secret key
7. Done! ✅ API runs on port 3000

---

## 🌐 Web App

**Upload:** `web-app` folder

**Steps:**
1. Go to https://replit.com
2. Click `+ Create Repl`
3. Upload the `web-app` folder
4. Click `Run` button
5. Web app runs on port 5174
6. Update `.env.local`:
   ```
   VITE_API_URL=http://your-backend-url/api
   ```
7. Done! ✅

---

## 🛠️ Admin Dashboard

**Upload:** `admin-dashboard` folder

**Steps:**
1. Go to https://replit.com
2. Click `+ Create Repl`
3. Upload the `admin-dashboard` folder
4. Click `Run` button
5. Admin runs on port 5173
6. Update `.env.local`:
   ```
   VITE_API_URL=http://your-backend-url/api
   ```
7. Done! ✅

---

## 🔑 Environment Variables

Each folder already has `.env.example` showing what's needed.

### Backend `.env`
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

### Web App `.env`
```
VITE_API_URL=http://your-backend-replit.repl.co/api
```

### Admin Dashboard `.env`
```
VITE_API_URL=http://your-backend-replit.repl.co/api
```

---

## ✅ That's It!

Each folder:
- ✅ Has `.replit` config (auto-detects start command)
- ✅ Has `package.json` (npm install automatic)
- ✅ Has `.env.example` (shows what vars needed)
- ✅ Ready to upload "as-is"

No changes needed. Just upload and click Run! 🚀

