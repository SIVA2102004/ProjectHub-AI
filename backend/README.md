# ProjectHub AI - Backend

Express.js backend API for ProjectHub AI platform.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
DATABASE_PATH=./data/projecthub.db
```

### Development

```bash
npm run dev
```

Server starts on `http://localhost:5000`

## 📁 Directory Structure

```
backend/
├── src/
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── projectRoutes.js   # Project routes
│   │   ├── categoryRoutes.js  # Category routes
│   │   ├── customRequestRoutes.js
│   │   ├── orderRoutes.js     # Orders and downloads
│   │   ├── adminRoutes.js     # Admin routes
│   │   └── uploadRoutes.js    # File upload routes
│   │
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── categoryController.js
│   │   ├── customRequestController.js
│   │   ├── orderController.js
│   │   ├── analyticsController.js
│   │   └── uploadController.js
│   │
│   ├── middleware/             # Middleware
│   │   └── auth.js            # Auth & error handling
│   │
│   ├── utils/                  # Utilities
│   │   ├── database.js        # Database connection
│   │   ├── auth.js            # JWT & password utils
│   │   └── fileUpload.js      # Multer configuration
│   │
│   └── server.js              # Express app
│
├── uploads/                    # Uploaded files
│   ├── sourcecode/
│   ├── reports/
│   ├── ppt/
│   ├── viva/
│   └── abstract/
│
├── data/                       # SQLite database
│   └── projecthub.db
│
├── package.json
└── .env.example
```

## 🔑 API Routes

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/popular` - Get popular projects
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `POST /api/orders/downloads` - Record download (Protected)
- `GET /api/orders/downloads` - Get downloads (Protected)
- `POST /api/payments` - Process payment (Protected)
- `GET /api/admin/orders` - Get all orders (Admin)

### Custom Requests
- `POST /api/custom-requests` - Submit request
- `GET /api/custom-requests/my-requests` - Get my requests (Protected)
- `GET /api/custom-requests` - Get all requests (Admin)
- `PUT /api/custom-requests/:id` - Update request (Admin)
- `DELETE /api/custom-requests/:id` - Delete request (Admin)

### Admin
- `GET /api/admin/analytics` - Dashboard analytics (Admin)
- `GET /api/admin/users` - Get users (Admin)
- `PUT /api/admin/users/:id/role` - Update user role (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)

### File Upload
- `POST /api/uploads/project-files` - Upload files (Admin)
- `GET /api/uploads/project-files/:projectId` - Get project files
- `DELETE /api/uploads/project-files/:fileId` - Delete file (Admin)

## 🔐 Authentication

JWT-based authentication system:
- Register with email and password
- Login returns JWT token
- Token stored in Authorization header
- Token expires in 24 hours
- Protected routes require valid token

## 📊 Database

### Schema
The application uses SQLite with tables for:
- users
- projects
- categories
- orders
- payments
- downloads
- custom_requests
- reviews
- project_files

### Initialization
Database schema is automatically created on first server start from `schema.sql`

## 📤 File Upload

### Supported File Types
- **Source Code:** ZIP files (max 100MB)
- **Reports:** PDF files (max 50MB)
- **PPTs:** PPTX files (max 100MB)
- **Viva Questions:** PDF/DOCX (max 50MB)
- **Abstracts:** PDF/DOCX (max 50MB)

### Upload Paths
Files are stored in:
```
uploads/
├── sourcecode/
├── reports/
├── ppt/
├── viva/
└── abstract/
```

## 🧪 Testing

### Test User Credentials
Create test users through `/api/auth/register`

### Test Admin
Ask developers to promote user to admin role

## 📈 Analytics

Admin dashboard provides:
- Total users count
- Total projects count
- Total downloads count
- Total revenue
- Monthly revenue trends
- Recent users list
- Recent orders list
- Projects by category breakdown

## 🐛 Debugging

### Enable Detailed Logging
```bash
NODE_ENV=development npm run dev
```

### Check Database
```bash
sqlite3 data/projecthub.db
```

### Test API Endpoints
Use Postman or similar tools to test API

## 🚀 Production Deployment

### Environment Variables
```
NODE_ENV=production
PORT=5000
JWT_SECRET=strong-random-secret
```

### Recommendations
- Use environment variables for sensitive data
- Enable HTTPS
- Set up database backups
- Enable rate limiting
- Use reverse proxy (Nginx)

## 📦 Dependencies

- **express** - Web framework
- **better-sqlite3** - SQLite database
- **jwt-simple** - JWT handling
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **cors** - CORS handling
- **dotenv** - Environment variables

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create PR

## 📝 Code Style

- Use ES6+ syntax
- Add JSDoc comments
- Follow existing patterns
- Use meaningful variable names
- Handle errors properly

## ❓ FAQ

**Q: How to reset the database?**
A: Delete `data/projecthub.db` and restart the server

**Q: How to change JWT secret?**
A: Update `JWT_SECRET` in `.env`

**Q: How to add new file type?**
A: Add new multer config in `utils/fileUpload.js`

---

**Version:** 1.0.0
**Last Updated:** June 2024
