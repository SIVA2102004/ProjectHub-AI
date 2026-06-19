# ProjectHub AI - Deployment Guide

## Overview
ProjectHub AI is a full-stack SaaS platform for engineering students to browse, purchase, and download project packages.

**Tagline:** Smart Projects. Better Learning.

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Authentication:** JWT
- **File Upload:** Multer
- **Password Hashing:** bcryptjs
- **API Format:** RESTful JSON

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **CSS:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Theme:** Dark mode with blue accents

### Hosting
- **Frontend:** Vercel (Recommended)
- **Backend:** Render (Recommended)

---

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your values:**
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
```

5. **Create data directory for SQLite:**
```bash
mkdir -p data
```

6. **Start the server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env.local file:**
```bash
cp .env.example .env.local
```

4. **Update .env.local:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

5. **Start development server:**
```bash
npm run dev
```

App will run on `http://localhost:3000`

---

## Database Schema

The application uses SQLite with the following main tables:

- **users** - Student and Admin accounts
- **projects** - Engineering projects
- **categories** - Project categories
- **orders** - Purchase orders
- **payments** - Payment records
- **downloads** - Download tracking
- **custom_requests** - Custom project requests
- **reviews** - Project reviews
- **project_files** - Associated files (source code, reports, PPTs, etc.)

**Database initialization:** Automatic on first server start

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get project details
- `GET /api/projects/popular` - Get popular projects
- `POST /api/projects` - Create project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders & Downloads
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `POST /api/orders/downloads` - Record download (Protected)
- `GET /api/orders/downloads` - Get user downloads (Protected)
- `POST /api/payments` - Process payment (Protected)

### Custom Requests
- `POST /api/custom-requests` - Submit custom request
- `GET /api/custom-requests/my-requests` - Get user's requests (Protected)
- `GET /api/custom-requests` - Get all requests (Admin only)
- `PUT /api/custom-requests/:id` - Update request (Admin only)
- `DELETE /api/custom-requests/:id` - Delete request (Admin only)

### Admin
- `GET /api/admin/analytics` - Get dashboard analytics (Admin only)
- `GET /api/admin/users` - Get all users (Admin only)
- `PUT /api/admin/users/:id/role` - Update user role (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

### File Uploads
- `POST /api/uploads/project-files` - Upload project files (Admin only)
- `GET /api/uploads/project-files/:projectId` - Get project files
- `DELETE /api/uploads/project-files/:fileId` - Delete file (Admin only)

---

## Deployment to Production

### Backend Deployment (Render)

1. **Push code to GitHub**

2. **Create new Web Service on Render:**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Add environment variables on Render:**
   - `NODE_ENV=production`
   - `JWT_SECRET=your-production-secret`
   - `PORT=5000`

4. **Deploy and get backend URL**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy to Vercel:**
```bash
cd frontend
vercel
```

3. **Update environment variables:**
   - `VITE_API_BASE_URL=your-backend-url/api`

4. **Redeploy with new env vars**

---

## Key Features Implementation

### 1. Authentication
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes with role-based access
- Token stored in localStorage

### 2. Project Management
- CRUD operations for projects
- Category-based organization
- Difficulty levels (beginner, intermediate, advanced)
- Tech stack information

### 3. File Management
- Source code uploads (ZIP)
- Report uploads (PDF)
- PPT uploads (PPTX)
- Viva questions (PDF/DOCX)
- Abstract uploads (PDF/DOCX)

### 4. Pricing & Orders
- Free and premium projects
- Order management
- Payment processing (mock)
- Download tracking

### 5. Admin Dashboard
- Analytics dashboard
- User management
- Project management
- Order tracking
- Custom request management

---

## Project Structure

```
ProjectHub AI/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, error handling
│   │   ├── utils/           # Database, auth, file upload
│   │   └── server.js        # Express app
│   ├── uploads/             # Uploaded files
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── utils/           # API service
│   │   ├── styles/          # Global CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql           # Database schema
│
└── uploads/
    ├── sourcecode/
    ├── reports/
    ├── ppt/
    ├── viva/
    └── abstract/
```

---

## Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure Node.js is installed
- Check if port 5000 is available
- Verify .env file is created
- Check database permissions

**Frontend won't connect to backend:**
- Ensure backend is running on port 5000
- Check VITE_API_BASE_URL in .env.local
- Clear browser cache and localStorage

**Database issues:**
- Delete `data/projecthub.db` to reset
- Check file permissions in uploads directory

**Authentication failing:**
- Verify JWT_SECRET is set in backend .env
- Check token expiration time
- Clear localStorage and login again

---

## Security Considerations

1. **Environment Variables:** Never commit .env files
2. **JWT Secret:** Use strong, random secret in production
3. **Password Hashing:** All passwords hashed with bcryptjs
4. **File Upload:** Validate file types and sizes
5. **CORS:** Configure CORS for production URLs
6. **Rate Limiting:** Implement in production
7. **HTTPS:** Use HTTPS in production

---

## Performance Tips

1. **Database:** Add indexes for frequently queried fields
2. **Caching:** Implement Redis for session management
3. **CDN:** Use CDN for static assets on frontend
4. **Compression:** Enable gzip compression
5. **Code Splitting:** Implement lazy loading in React
6. **Database Queries:** Use pagination for large datasets

---

## Future Enhancements

1. **Payment Integration:** Real Razorpay/Stripe integration
2. **Email Notifications:** Send order confirmations
3. **Reviews & Ratings:** User review system
4. **Advanced Analytics:** More detailed dashboards
5. **Search Enhancement:** Elasticsearch integration
6. **Mobile App:** React Native mobile version
7. **Wishlist:** Add projects to wishlist
8. **Comments:** Community discussion on projects

---

## Support & Documentation

- **Issue Tracking:** GitHub Issues
- **Documentation:** See README files in each directory
- **API Documentation:** Postman collection available

---

## License

MIT License - See LICENSE file for details

---

## Author

ProjectHub AI Team

---

**Last Updated:** June 2024
**Version:** 1.0.0
