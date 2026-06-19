# ProjectHub AI - Quick Start Guide

Get up and running with ProjectHub AI in 5 minutes!

## ⚡ Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git
- A text editor (VS Code recommended)

## 🚀 Installation (5 minutes)

### 1. Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start backend
npm run dev
```

✅ Backend running on `http://localhost:5000`

### 2. Frontend Setup (3 minutes)

```bash
# In new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start frontend
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## 🎯 First Steps

### 1. Open the Application
- Open browser to `http://localhost:3000`
- You should see the ProjectHub AI homepage

### 2. Create a Student Account
- Click "Register"
- Fill in details:
  - Name: John Doe
  - Email: john@example.com
  - Password: password123
  - College: MIT
- Click "Create Account"
- You'll be logged in automatically

### 3. Create an Admin Account
- Open another browser window
- Register with different email
- In SQLite, update the role to 'admin':
  ```bash
  sqlite3 backend/data/projecthub.db
  UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
  ```

### 4. Add Sample Data

#### Add Categories
- Login as Admin
- Go to Admin Dashboard
- You can view categories, but adding requires API or direct DB

#### Add Sample Project (Direct to DB)
```bash
sqlite3 backend/data/projecthub.db
```

```sql
INSERT INTO categories (name, description) VALUES ('Web Development', 'Web projects');
INSERT INTO projects (title, description, categoryId, difficulty, techStack, price, isFree, createdBy)
VALUES ('Todo App', 'Build a React Todo App', 1, 'beginner', 'React, Tailwind', 0, 1, 1);
```

### 5. Browse Projects
- Login as student
- Go to "Browse Projects"
- See your created project
- Click on it to view details

## 📁 Project Structure Overview

```
ProjectHub AI/
├── backend/          # Express.js API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── controllers/ # Business logic
│   │   └── server.js # Main server
│   └── package.json
│
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/
│   │   └── App.jsx   # Main app
│   └── package.json
│
└── database/         # Schema
    └── schema.sql
```

## 🔑 Key Files to Know

### Backend
- `backend/src/server.js` - Express server entry
- `backend/src/routes/` - API routes
- `backend/src/controllers/` - Business logic
- `backend/.env` - Configuration

### Frontend
- `frontend/src/App.jsx` - Main app
- `frontend/src/pages/` - Page components
- `frontend/src/context/AuthContext.jsx` - Auth state
- `frontend/src/utils/api.js` - API client

## 🧪 Testing the API

### Test Register/Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Token
- Copy the token from login response
- Use in Authorization header for protected routes

### Get Projects
```bash
curl http://localhost:5000/api/projects
```

## 🐛 Common Issues

### Backend won't start
- ✅ Check if port 5000 is free
- ✅ Ensure Node.js is installed: `node --version`
- ✅ Check .env file exists
- ✅ Try deleting `node_modules` and reinstalling

### Frontend won't connect
- ✅ Ensure backend is running on :5000
- ✅ Check VITE_API_BASE_URL in .env.local
- ✅ Try clearing browser cache

### Database errors
- ✅ Delete `backend/data/projecthub.db` and restart
- ✅ Check file permissions in uploads folder
- ✅ Ensure Node.js can write to directories

## 📚 Next Steps

### Learn More
1. Read [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
2. Check [backend/README.md](../backend/README.md)
3. Check [frontend/README.md](../frontend/README.md)
4. Study [database/README.md](../database/README.md)

### Customize
1. Change colors in `frontend/tailwind.config.js`
2. Add more categories in database
3. Create sample projects
4. Customize homepage

### Deploy
1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Update API URL in frontend .env
4. Set up custom domain

## 📝 Default Login Credentials

After first setup, create these test accounts:

**Student Account**
- Email: student@example.com
- Password: password123
- Role: student

**Admin Account**
- Email: admin@example.com
- Password: password123
- Role: admin

## 🎓 Learning Path

1. **Day 1:** Understand the folder structure
2. **Day 2:** Study the API endpoints
3. **Day 3:** Explore the React components
4. **Day 4:** Customize colors and theme
5. **Day 5:** Add sample data and test features

## 🤝 Need Help?

### Check Logs
```bash
# Backend logs
npm run dev

# Frontend logs
Check browser console (F12)
```

### Debug Mode
```bash
# Backend with detailed logging
DEBUG=* npm run dev
```

### Database Query
```bash
sqlite3 backend/data/projecthub.db
SELECT * FROM users;
SELECT * FROM projects;
```

## 🚀 Ready to Go!

You now have a fully functional ProjectHub AI platform running locally. 

Next:
1. Explore the admin dashboard
2. Create some test projects
3. Test the purchase flow
4. Check the code comments
5. Customize for your needs

## 📞 Support Resources

- 📖 README.md - Project overview
- 🔧 DEPLOYMENT_GUIDE.md - Production setup
- 📁 Each folder has its own README
- 💻 Code is well-commented
- 🐛 Check browser console for errors

---

**You're all set! Happy coding! 🎉**

For detailed information, see the main README and deployment guide.
