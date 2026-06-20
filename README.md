# 🚀 ProjectHub AI — Smart Projects. Better Learning.

ProjectHub AI is a production-ready SaaS platform built for engineering students to browse, purchase, and download complete project packages (containing clean source code, IEEE reports, PPT presentations, abstracts, and viva questions) or request custom modifications.

---

## 🔑 Demo Credentials

| Role | Email | Password | Redirect Target |
|---|---|---|---|
| **Admin** | `admin@projecthub.ai` | `Admin@123` | `/admin` (Dashboard) |
| **Student** | `student@projecthub.ai` | `Student@123` | `/` (Home/Student Dashboard) |

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, Axios
- **Backend**: Node.js, Express.js, JWT Authentication, Multer (file uploads), bcryptjs
- **Database**: SQLite (powered by `better-sqlite3` for performance)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🌟 Core Features

### 1. Database-Driven Real Data
*   **Live Landing Page Stats**: Dynamically retrieves active projects count, registered student registrations, project downloads, and visitor traffic directly from the SQLite database (`GET /api/analytics/public-stats`).
*   **Visitor Logging**: Automatically records student visits to the database on landing page mount (`POST /api/analytics/visit`).
*   **Real Reviews & Testimonials**: Displays approved high-rating reviews queried from the reviews table (`GET /api/analytics/reviews/featured`).

### 2. Sandbox Payment Gateway
*   **Checkout Simulator**: Click "Buy Now" on any project to launch a dark-mode Razorpay Sandbox modal displaying Card, UPI, and Net Banking options.
*   **Verification Sandbox**: Simulates checkout states and submits to `POST /api/orders/verify` to approve payment records, generate transaction hashes, and activate download privileges.

### 3. Contact Support Center
*   **Interactive Form**: Users can submit questions regarding project modifications or purchases.
*   **Message Database Log**: Inbound messages are saved to the `contact_messages` table and are retrievable by administrators.

### 4. Robust Security Fixes
*   **Session Handler Fix**: Fixes response interceptor redirect bugs so incorrect password inputs trigger clean red danger panels rather than forced index refreshes.
*   **Secure Authenticated Downloads**: Downloads are fetched via authorized Axios blob streams and saved locally, resolving original 401 unauthenticated window opening errors.

---

## 📁 Project Structure

```
ProjectHub AI/
├── backend/
│   ├── config/
│   │   ├── database.js      # SQLite schema bootstrap + data seeds
│   │   └── jwt.js           # JWT signature helpers
│   ├── middleware/
│   │   └── auth.js          # Authentication guard (authenticate, requireAdmin)
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Profile updates
│   │   ├── projects.js      # Projects listing, details & reviews submission
│   │   ├── categories.js    # Category listing
│   │   ├── orders.js        # Order creation & checkout verification
│   │   ├── downloads.js     # Secure file server with download logging
│   │   ├── custom_requests.js # Custom student requests
│   │   ├── users.js         # User list management (Admin)
│   │   ├── analytics.js     # Analytics summaries & public counts
│   │   └── contact.js       # Contact query management
│   ├── uploads/             # Assets folders (sourcecode, reports, ppt, etc.)
│   ├── server.js            # Main entry file
│   └── .env                 # Environment config
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Authorized Axios interceptor configurations
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # Global User login states
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation header
│   │   │   ├── Footer.jsx      # Information footer
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── ProjectDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CustomRequestPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── ContactPage.jsx # Contact details and feedback form
│   │   └── App.jsx
│   └── package.json
```

---

## ⚡ Setup & Launch Process

### 1. Backend Server Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` configuration file (refer to `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   DB_PATH=./database/projecthub.db
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the database bootstrap and server:
   ```bash
   npm start
   ```
   *Note: On launch, the database directory is verified, the SQLite DB file is built, tables are generated, and categories/admin/student/reviews are automatically seeded.*

### 2. Frontend Client Setup

1. Open a secondary terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install client packages:
   ```bash
   npm install
   ```
3. Initialize a `.env` configuration mapping the backend URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Fire up the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to **http://localhost:5173** to use the application!

---

## 💰 Packages & Pricing

| Plan | Pricing | Features Included |
|---|---|---|
| **Starter** | ₹499 | Clean Source Code + Abstract + Basic Docs |
| **Standard** | ₹999 | Source Code + IEEE Report + Presentation PPT + Viva Q&A |
| **Premium** | ₹1999 | Everything in Standard + Modifications + Developer Support |
| **Custom Major** | ₹3000+ | Bespoke Custom Project built entirely to user specifications |

---

## 💾 Git Tracking & Deployment

### Push updates to Git
```bash
git add -A
git commit -m "Build ProjectHub-AI: SaaS Platform with Real Data, Contact Page, Payments, and fixes"
git push origin main
```

### Production Deployments

*   **Backend Deployment (Render)**:
    1. Log in to Render and create a new Web Service pointing to your repository.
    2. Configure the build command as `npm install` and start command as `npm start` in the `backend/` root directory.
    3. Setup env variables matching `.env.example` (ensure `NODE_ENV` is set to `production` and provide a secure custom `JWT_SECRET`).
*   **Frontend Deployment (Vercel)**:
    1. Import the project repository in Vercel.
    2. Override the root directory setting to build the `frontend` folder.
    3. Define the Build Command as `npm run build` and output directory as `dist`.
    4. Set `VITE_API_URL` pointing to your live Render API service endpoint before building.
