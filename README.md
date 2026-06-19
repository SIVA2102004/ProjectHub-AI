# ProjectHub AI

> **Smart Projects. Better Learning.**

A production-ready SaaS platform for engineering students to browse, purchase, and download project packages including source code, reports, PPTs, abstracts, and viva questions.

## 🚀 Features

### Student Features
- 📚 Browse thousands of engineering projects
- 🔍 Advanced search and filtering by category
- 💳 Purchase premium project packages
- ⬇️ Download source code, reports, PPTs, abstracts, and viva questions
- 🎯 View project details and tech stack
- 🛒 Order history and download tracking
- ✨ Request custom projects tailored to needs
- 👤 User profile management

### Admin Features
- ➕ Add, edit, and delete projects
- 📤 Upload source code ZIP files
- 📄 Upload reports (PDF)
- 📊 Upload presentations (PPT/PPTX)
- ❓ Upload viva questions (PDF/DOCX)
- 📝 Upload abstracts (PDF/DOCX)
- 👥 Manage users and roles
- 📈 View comprehensive analytics
- 🛒 Manage orders and payments
- 📋 Manage custom project requests

## 📋 Project Categories

- AI & ML
- Web Development
- Python
- Data Science
- Blockchain
- IoT
- Android
- Computer Vision
- NLP

## 💰 Pricing

| Package | Price | Features |
|---------|-------|----------|
| Starter | ₹499 | Access to projects, Download source code |
| Standard | ₹999 | Everything in Starter + Reports & PPTs + Viva Questions |
| Premium | ₹1999 | Everything in Standard + Abstracts + Priority support |
| Custom | ₹3000+ | Tailored projects, Dedicated support, Custom features |

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **SQLite** with better-sqlite3
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads

### Frontend
- **React 18** with Hooks
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Hosting
- **Frontend:** Vercel
- **Backend:** Render

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📚 Database Schema

### Main Tables
- **users** - User accounts (Students & Admins)
- **projects** - Engineering projects
- **categories** - Project categories
- **orders** - Purchase orders
- **payments** - Payment records
- **downloads** - Download history
- **custom_requests** - Custom project requests
- **reviews** - Project reviews
- **project_files** - Associated files

## 🔐 Authentication

- JWT-based authentication
- Email and password registration
- Secure password hashing
- Protected routes
- Role-based access control (Student/Admin)

## 📱 Pages

### Public Pages
- **Home** - Landing page with hero section
- **Projects** - Browse and search projects
- **Project Details** - Full project information
- **Login** - User authentication
- **Register** - New user signup

### Protected Pages
- **Custom Project** - Submit custom project requests
- **Admin Dashboard** - Analytics and management

## 🎨 UI/UX

- **Modern dark theme** with blue gradient accents
- **Responsive design** for all devices
- **Smooth animations** and transitions
- **Beautiful card-based layout**
- **Professional SaaS styling**

## 📊 Admin Dashboard

### Analytics
- Total users
- Total projects
- Total downloads
- Total revenue
- Monthly revenue trends
- Recent users
- Recent orders
- Projects by category

### Management
- Project CRUD operations
- User management and role assignment
- Order tracking
- Custom request handling

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
vercel
```

### Backend Deployment (Render)
- Push to GitHub
- Connect Render to repository
- Set environment variables
- Deploy automatically

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📖 API Documentation

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

### Projects
```
GET    /api/projects
GET    /api/projects/:id
GET    /api/projects/popular
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

### Categories
```
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Orders & Downloads
```
POST   /api/orders
GET    /api/orders
POST   /api/orders/downloads
GET    /api/orders/downloads
POST   /api/payments
```

### Custom Requests
```
POST   /api/custom-requests
GET    /api/custom-requests/my-requests
GET    /api/custom-requests
PUT    /api/custom-requests/:id
DELETE /api/custom-requests/:id
```

### Admin
```
GET    /api/admin/analytics
GET    /api/admin/users
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

## 🔒 Security

- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected API routes
- ✅ File type validation
- ✅ CORS configuration
- ✅ Environment variable protection

## 🎯 Future Enhancements

- [ ] Real payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications
- [ ] User reviews and ratings
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Wishlist feature
- [ ] Community discussions
- [ ] Certificates
- [ ] Video tutorials

## 📝 File Structure

```
ProjectHub AI/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── database/
│   └── schema.sql
└── DEPLOYMENT_GUIDE.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

ProjectHub AI Team

## 📞 Support

For support, email support@projecthubai.com or create an issue on GitHub.

---

**Version:** 1.0.0  
**Last Updated:** June 2024

**Happy Learning! 🎓**
