# ProjectHub AI - API Reference

Complete API documentation for ProjectHub AI backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

### JWT Token
- Obtained from `/auth/login` or `/auth/register`
- Include in all protected requests:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Format
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "student",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## 🔐 Authentication Endpoints

### Register
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "college": "MIT Chennai"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student"
    },
    "token": "eyJhbGc..."
  }
}
```

---

### Login
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get logged-in user details. **[Protected]**

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "college": "MIT Chennai"
  }
}
```

---

### Logout
**POST** `/auth/logout`

Logout user. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 📚 Projects Endpoints

### Get All Projects
**GET** `/projects`

Browse all projects with filtering.

**Query Parameters:**
- `search` - Search by title or description
- `category` - Filter by category ID
- `sort` - Sort by: `newest`, `popular`, `price-low`, `price-high`
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Example:**
```
/projects?search=react&category=1&sort=newest&limit=12&offset=0
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "React Todo App",
      "description": "Build a todo app with React",
      "categoryName": "Web Development",
      "difficulty": "beginner",
      "techStack": "React, Tailwind CSS",
      "price": 499,
      "isFree": false,
      "imageUrl": "...",
      "downloadCount": 45,
      "createdAt": "2024-06-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 12,
    "offset": 0,
    "pages": 9
  }
}
```

---

### Get Project by ID
**GET** `/projects/:id`

Get detailed information about a project.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "React Todo App",
    "description": "...",
    "categoryName": "Web Development",
    "difficulty": "beginner",
    "techStack": "React, Tailwind CSS",
    "price": 499,
    "isFree": false,
    "downloadCount": 45,
    "files": [
      {
        "id": 1,
        "fileType": "sourcecode",
        "fileName": "project.zip",
        "fileSize": 1024000
      }
    ]
  }
}
```

---

### Get Popular Projects
**GET** `/projects/popular`

Get top 6 most downloaded projects.

**Response (200):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### Create Project
**POST** `/projects`

Create new project. **[Admin Only]**

**Request Body:**
```json
{
  "title": "React Todo App",
  "description": "Build a todo application",
  "categoryId": 1,
  "difficulty": "beginner",
  "techStack": "React, Tailwind CSS",
  "price": 499,
  "isFree": false,
  "imageUrl": "..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": { ... }
}
```

---

### Update Project
**PUT** `/projects/:id`

Update project. **[Admin Only]**

**Request Body:** (Same as create, all fields optional)

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": { ... }
}
```

---

### Delete Project
**DELETE** `/projects/:id`

Delete project. **[Admin Only]**

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 📂 Categories Endpoints

### Get All Categories
**GET** `/categories`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Web Development",
      "description": "Web projects",
      "icon": "🌐"
    }
  ]
}
```

---

### Create Category
**POST** `/categories`

Create new category. **[Admin Only]**

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Web development projects",
  "icon": "🌐"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { ... }
}
```

---

### Update Category
**PUT** `/categories/:id`

Update category. **[Admin Only]**

---

### Delete Category
**DELETE** `/categories/:id`

Delete category. **[Admin Only]**

---

## 🛒 Orders Endpoints

### Create Order
**POST** `/orders`

Create purchase order. **[Protected]**

**Request Body:**
```json
{
  "projectId": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "projectId": 1,
    "amount": 499,
    "status": "pending",
    "orderDate": "2024-06-15T10:00:00Z"
  }
}
```

---

### Get User Orders
**GET** `/orders`

Get all orders by logged-in user. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "projectId": 1,
      "amount": 499,
      "status": "completed",
      "title": "React Todo App",
      "categoryName": "Web Development"
    }
  ]
}
```

---

### Process Payment
**POST** `/orders/payments`

Process payment for order. **[Protected]**

**Request Body:**
```json
{
  "orderId": 1,
  "amount": 499
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "transactionId": "TXN_1718429460000"
  }
}
```

---

## ⬇️ Downloads Endpoints

### Record Download
**POST** `/orders/downloads`

Record file download. **[Protected]**

**Request Body:**
```json
{
  "projectId": 1,
  "fileType": "sourcecode"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Download recorded successfully"
}
```

---

### Get User Downloads
**GET** `/orders/downloads`

Get user's download history. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "projectId": 1,
      "fileType": "sourcecode",
      "title": "React Todo App",
      "downloadedAt": "2024-06-15T10:00:00Z"
    }
  ]
}
```

---

## 📋 Custom Requests Endpoints

### Submit Custom Request
**POST** `/custom-requests`

Submit custom project request.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "college": "MIT Chennai",
  "projectTitle": "IoT Smart Home",
  "domain": "IoT",
  "description": "Build a smart home system",
  "budget": 5000
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Custom project request submitted successfully",
  "data": {
    "id": 1
  }
}
```

---

### Get My Requests
**GET** `/custom-requests/my-requests`

Get user's custom requests. **[Protected]**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "projectTitle": "IoT Smart Home",
      "domain": "IoT",
      "budget": 5000,
      "status": "pending",
      "createdAt": "2024-06-15T10:00:00Z"
    }
  ]
}
```

---

### Get All Requests
**GET** `/custom-requests`

Get all requests. **[Admin Only]**

**Query Parameters:**
- `status` - Filter by status
- `limit` - Results per page
- `offset` - Pagination

---

### Update Request Status
**PUT** `/custom-requests/:id`

Update request status. **[Admin Only]**

**Request Body:**
```json
{
  "status": "in-progress"
}
```

Valid statuses: `pending`, `in-progress`, `completed`, `rejected`

---

### Delete Request
**DELETE** `/custom-requests/:id`

Delete request. **[Admin Only]**

---

## 📊 Admin Endpoints

### Get Dashboard Analytics
**GET** `/admin/analytics`

Get admin dashboard data. **[Admin Only]**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 150,
      "totalProjects": 45,
      "totalDownloads": 1200,
      "totalOrders": 300,
      "totalRevenue": 150000
    },
    "monthlyRevenue": [ ... ],
    "recentUsers": [ ... ],
    "recentOrders": [ ... ],
    "categoryBreakdown": [ ... ]
  }
}
```

---

### Get Users
**GET** `/admin/users`

Get all users. **[Admin Only]**

**Query Parameters:**
- `role` - Filter by role (student, admin)
- `search` - Search by email or name
- `limit` - Results per page
- `offset` - Pagination

---

### Update User Role
**PUT** `/admin/users/:id/role`

Change user role. **[Admin Only]**

**Request Body:**
```json
{
  "role": "admin"
}
```

Valid roles: `student`, `admin`

---

### Delete User
**DELETE** `/admin/users/:id`

Delete user. **[Admin Only]**

---

## 📤 Upload Endpoints

### Upload Project Files
**POST** `/uploads/project-files`

Upload files for project. **[Admin Only]**

**Form Data:**
- `projectId` - Project ID
- `sourcecode` - ZIP file
- `report` - PDF file
- `ppt` - PPTX file
- `viva` - PDF/DOCX file
- `abstract` - PDF/DOCX file

**Response (200):**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "id": 1,
      "fileType": "sourcecode",
      "fileName": "project.zip",
      "fileSize": 1024000
    }
  ]
}
```

---

### Get Project Files
**GET** `/uploads/project-files/:projectId`

Get files for project.

**Response (200):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### Delete File
**DELETE** `/uploads/project-files/:fileId`

Delete uploaded file. **[Admin Only]**

---

## ✅ Health Check

### Server Health
**GET** `/health`

Check if backend is running.

**Response (200):**
```json
{
  "success": true,
  "message": "Backend server is running",
  "timestamp": "2024-06-15T10:00:00Z"
}
```

---

## Error Responses

### Common Error Codes

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**403 - Forbidden**
```json
{
  "success": false,
  "message": "Admin access required"
}
```

**404 - Not Found**
```json
{
  "success": false,
  "message": "Project not found"
}
```

**409 - Conflict**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**500 - Internal Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 🔄 Request/Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "message": "string",
  "data": "object or array",
  "pagination": {
    "total": number,
    "limit": number,
    "offset": number,
    "pages": number
  }
}
```

---

## 💡 Example Usage

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123","firstName":"John","lastName":"Doe"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}' | jq -r '.data.token')

# Get projects
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

### Using Axios (Frontend)

```javascript
import api from './utils/api'

// Register
await api.post('/auth/register', formData)

// Login
const { data } = await api.post('/auth/login', { email, password })

// Get projects
const { data } = await api.get('/projects')

// Create order
await api.post('/orders', { projectId: 1 })
```

---

**API Version:** 1.0.0  
**Last Updated:** June 2024
