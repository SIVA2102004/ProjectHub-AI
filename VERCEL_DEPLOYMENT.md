# Vercel & Render Deployment Guide

Complete guide to deploy ProjectHub AI to production using Vercel (frontend) and Render (backend).

## 📋 Prerequisites

Before deployment, ensure you have:
- ✅ GitHub account with the repo pushed
- ✅ Vercel account (free tier available)
- ✅ Render account (free tier available)
- ✅ Backend deployed on Render and running

---

## 🚀 Step 1: Deploy Backend to Render

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Click "Connect GitHub"
4. Authorize Render to access your repositories

### 1.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Select the **ProjectHub-AI** repository
3. Configure:
   - **Name:** projecthub-api
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev`
   - **Plan:** Free (or paid for production)

### 1.3 Add Environment Variables
In Render dashboard, go to Environment:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-secret-key-here-change-this
DATABASE_PATH=/data/projecthub.db
```

⚠️ **Important:** Change JWT_SECRET to a secure random string:
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait 3-5 minutes for deployment
- Note the URL: `https://projecthub-api-xxxx.onrender.com`
- This will be your API_BASE_URL for frontend

✅ **Backend URL:** Use this in frontend deployment

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize and sign in

### 2.2 Import GitHub Project
1. Click **"Add New"** → **"Project"**
2. Click **"Import Git Repository"**
3. Paste: `https://github.com/SIVA2102004/ProjectHub-AI.git`
4. Click **"Continue"**

### 2.3 Configure Project
1. **Framework Preset:** Vite
2. **Root Directory:** frontend
3. **Build Command:** `npm run build`
4. **Install Command:** `npm install`
5. **Output Directory:** `dist`

### 2.4 Add Environment Variables
Add the following environment variables:

```
VITE_API_BASE_URL=https://projecthub-api-xxxx.onrender.com
```

Replace `xxxx` with your actual Render URL from Step 1.4

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL: `https://projecthub-ai-xxx.vercel.app`

✅ **Frontend Live:** Your site is now live!

---

## 🔄 Step 3: Verify Deployment

### 3.1 Test Frontend
1. Open your Vercel URL in browser
2. You should see the ProjectHub AI homepage
3. Click **"Register"** and create an account
4. Verify backend API connection

### 3.2 Test Backend
1. Open: `https://projecthub-api-xxxx.onrender.com/health`
2. Should return: `{"success": true, "message": "Backend server is running"}`

### 3.3 Test API Endpoints
```bash
# Test register (replace with your API URL)
curl -X POST https://projecthub-api-xxxx.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "college": "College Name"
  }'
```

---

## 📝 Step 4: Update Configuration Files

### 4.1 Update Frontend .env
Create `frontend/.env.production`:
```
VITE_API_BASE_URL=https://projecthub-api-xxxx.onrender.com
```

### 4.2 Update Backend .env
Update `backend/.env`:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-generated-secret-key
DATABASE_PATH=/data/projecthub.db
CORS_ORIGIN=https://projecthub-ai-xxx.vercel.app
```

### 4.3 Update CORS in Backend
Edit `backend/src/server.js` and update CORS:
```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Update DATABASE_PATH for production

### 2. Database
- ✅ Consider using PostgreSQL instead of SQLite for production
- ✅ Set up daily backups
- ✅ Use strong passwords if migrating to hosted database

### 3. API Keys
- ✅ Don't expose API keys in frontend code
- ✅ Use environment variables for all secrets
- ✅ Rotate keys regularly

### 4. CORS
- ✅ Only allow your frontend domain
- ✅ Don't use `*` for CORS in production
- ✅ Validate all incoming requests

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

Both Vercel and Render support automatic deployment:

**Vercel:**
- Automatically deploys on every push to `main` branch
- Can be configured in project settings

**Render:**
- Enable auto-deploy in service settings
- Select branch: `main`
- Redeploy on push: ✅ Enabled

### Deploy Preview URLs
- Vercel creates preview URLs for pull requests
- Test changes before merging to main

---

## 📊 Monitoring & Logs

### Vercel Logs
1. Go to project on vercel.com
2. Click **"Deployments"** tab
3. Click latest deployment
4. View **"Logs"** tab

### Render Logs
1. Go to service on render.com
2. Click **"Logs"** tab
3. View real-time logs
4. Use `tail -f` for streaming logs

---

## 🐛 Troubleshooting

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Verify backend is running on Render
- Check VITE_API_BASE_URL in frontend .env
- Ensure CORS is properly configured
- Check browser console for CORS errors

### Issue: Build Fails on Vercel
**Solution:**
- Check build logs in Vercel dashboard
- Verify `npm run build` works locally
- Ensure package.json has all dependencies
- Check for syntax errors

### Issue: Backend Not Starting on Render
**Solution:**
- Verify database PATH is writable
- Check environment variables are set
- View Render logs for error details
- Ensure Node version is compatible

### Issue: Database Connection Error
**Solution:**
- Verify database path in .env
- Check file permissions
- Ensure uploads folder exists
- Consider migrating to PostgreSQL for production

---

## 📈 Scaling & Performance

### Optimize Vercel
- ✅ Enable Image Optimization
- ✅ Use serverless functions for API routes
- ✅ Enable automatic compression
- ✅ Add CDN caching headers

### Optimize Render
- ✅ Upgrade to paid tier for better performance
- ✅ Use PostgreSQL instead of SQLite
- ✅ Enable disk persistence
- ✅ Configure horizontal scaling

### Performance Tips
- ✅ Minimize JavaScript bundle size
- ✅ Implement database indexing
- ✅ Add caching layer (Redis)
- ✅ Use CDN for static assets

---

## 🔄 Updating Production

### Update Backend Code
1. Make changes locally
2. Test with `npm run dev`
3. Commit: `git commit -m "message"`
4. Push: `git push origin main`
5. Render auto-deploys (wait 2-3 minutes)

### Update Frontend Code
1. Make changes locally
2. Test with `npm run dev`
3. Commit: `git commit -m "message"`
4. Push: `git push origin main`
5. Vercel auto-deploys (wait 1-2 minutes)

### Rollback to Previous Version
**Vercel:**
- Go to Deployments
- Click deployment you want
- Click "Promote to Production"

**Render:**
- Go to service
- Click desired deployment version
- Click "Deploy"

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Common Issues:** Check logs in dashboard
- **Email Support:** Contact platform support

---

## ✅ Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL noted (for frontend)
- [ ] Frontend environment variables updated
- [ ] Frontend deployed on Vercel
- [ ] Health check endpoint working
- [ ] Frontend can reach backend API
- [ ] Registration/login working
- [ ] Database persisting data
- [ ] Auto-deploy configured
- [ ] Environment variables secured

---

**🎉 Your ProjectHub AI is now live!**

Production URLs:
- 🌐 **Frontend:** https://projecthub-ai-xxx.vercel.app
- 🔌 **Backend API:** https://projecthub-api-xxxx.onrender.com
- 📊 **Admin Dashboard:** https://projecthub-ai-xxx.vercel.app/admin

Share your live links and start growing your platform! 🚀
