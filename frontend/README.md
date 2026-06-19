# ProjectHub AI - Frontend

React 18 + Vite frontend for ProjectHub AI platform.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

```bash
npm run dev
```

App runs on `http://localhost:3000`

### Build

```bash
npm run build
```

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── pages/                  # Page components
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── LoginPage.jsx      # Login page
│   │   ├── RegisterPage.jsx   # Registration page
│   │   ├── ProjectsPage.jsx   # Projects browsing
│   │   ├── ProjectDetailsPage.jsx
│   │   ├── CustomProjectPage.jsx
│   │   └── AdminDashboard.jsx # Admin panel
│   │
│   ├── components/             # Reusable components
│   │   ├── Header.jsx         # Navigation header
│   │   ├── Footer.jsx         # Footer
│   │   └── ProtectedRoute.jsx # Route protection
│   │
│   ├── context/                # React Context
│   │   └── AuthContext.jsx    # Authentication state
│   │
│   ├── utils/                  # Utility functions
│   │   └── api.js             # Axios instance
│   │
│   ├── styles/                 # Global styles
│   │   └── globals.css        # Tailwind + custom
│   │
│   ├── App.jsx                # Main app
│   └── main.jsx               # Entry point
│
├── public/                     # Static assets
├── index.html                  # HTML template
├── vite.config.js             # Vite config
├── tailwind.config.js         # Tailwind config
├── postcss.config.js          # PostCSS config
├── package.json
└── .env.example
```

## 🎨 Design System

### Colors
- **Primary:** #3B82F6 (Blue)
- **Secondary:** #1E40AF (Dark Blue)
- **Dark:** #0F172A (Background)
- **Light:** #F8FAFC (Text)

### Components
- **Buttons:** `btn-primary`, `btn-secondary`, `btn-outline`
- **Cards:** `card`, `card-hover`
- **Badges:** `badge`
- **Inputs:** `input-field`
- **Animations:** `fade-in`, `slide-in`

## 📄 Pages

### Public Pages

#### Home Page
- Hero section with CTA
- Features showcase
- Project categories
- Pricing section
- Testimonials
- FAQ section
- Footer with links

#### Login Page
- Email/password form
- Error handling
- Link to register
- Submit button

#### Register Page
- Name, email, password form
- College/institution field
- Form validation
- Terms acceptance
- Link to login

#### Projects Page
- Project grid/list view
- Search functionality
- Category filter
- Sort options (newest, popular, price)
- Pagination
- Project cards with preview

#### Project Details Page
- Full project information
- Tech stack display
- Difficulty level
- Pricing
- Download options
- Buy/Free access button
- Related projects
- Share buttons

#### Custom Project Page
- Form for custom requests
- Project domain selection
- Budget input
- Description textarea
- Email and name fields
- Success/error messages

### Protected Pages

#### Admin Dashboard
- Analytics overview
- KPI cards
- Recent users list
- Recent orders list
- Category breakdown
- Project management table
- User management table
- Order tracking
- Custom request handling

## 🔐 Authentication

### Auth Context
Manages:
- User state
- Authentication token
- Login/Register/Logout
- Role-based checks

### Protected Routes
Routes protected by `ProtectedRoute` component:
- `/admin` - Admin only
- `/orders` - Logged in users

## 🌐 API Integration

### Axios Instance
Centralized API calls with:
- Automatic token injection
- Base URL configuration
- Error handling
- Auto logout on 401

### API Service
```javascript
import api from './utils/api.js'

// Automatic token handling
api.post('/auth/login', {...})
api.get('/projects')
```

## 🎯 Key Features

### Student Features
✅ Browse projects with filters
✅ Search by keyword
✅ Filter by category
✅ View project details
✅ Purchase premium projects
✅ Download resources
✅ Request custom projects
✅ View order history

### Admin Features
✅ View dashboard analytics
✅ Manage projects (CRUD)
✅ Manage users
✅ Track orders
✅ Handle custom requests
✅ Export analytics

## 💾 State Management

### Context API
- `AuthContext` - Global auth state

### Local Storage
- Auth token storage
- User profile caching

### Component State
- Form inputs
- UI toggles
- Loading states

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Dark mode by default
- Custom theme colors
- Responsive breakpoints

### Custom CSS
```css
- globals.css - Global styles
- btn-* - Button variants
- card - Card component
- input-field - Form inputs
- badge - Label badges
- Animations (fade-in, slide-in)
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Touch-friendly buttons
- Hamburger menu
- Stacked layout
- Optimized images

## ⚡ Performance

### Optimizations
- Lazy loading with React.lazy
- Code splitting by route
- Image optimization
- Bundle analysis with Vite

### Lighthouse Scores
Target:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🧪 Component Examples

### Header
```jsx
<Header />
// Shows nav, user menu, auth buttons
```

### Protected Route
```jsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### API Call
```jsx
const response = await api.get('/projects')
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel
```

### Environment Variables
```
VITE_API_BASE_URL=your-backend-url
```

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM
- **react-router-dom** - Routing
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **vite** - Build tool

## 🐛 Debugging

### React DevTools
- Install React DevTools browser extension
- Inspect component tree
- Check props and state

### Network Tab
- Check API calls
- Verify token in headers
- Monitor response times

### Console
- Check for errors
- Log component renders
- Monitor state changes

## 📚 Component Guide

### Creating New Component
```jsx
export function MyComponent() {
  return (
    <div className="card">
      {/* Component content */}
    </div>
  )
}
```

### Using Auth
```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  // ...
}
```

### API Calls
```jsx
import api from '../utils/api'

// In useEffect
api.get('/projects')
  .then(res => setProjects(res.data.data))
  .catch(err => console.error(err))
```

## 🤝 Contributing

1. Follow React best practices
2. Use functional components
3. Add PropTypes or TypeScript
4. Keep components small and focused
5. Add comments for complex logic

## ❓ FAQ

**Q: How to add a new page?**
A: Create new .jsx file in pages/, import in App.jsx, add route

**Q: How to add global styles?**
A: Add to styles/globals.css

**Q: How to call API?**
A: Use `api` from utils/api.js

**Q: How to protect a route?**
A: Wrap with `<ProtectedRoute>` component

---

**Version:** 1.0.0
**Last Updated:** June 2024
