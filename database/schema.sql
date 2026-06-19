-- ProjectHub AI Database Schema
-- SQLite Database using better-sqlite3

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    college TEXT,
    phone TEXT,
    profileImage TEXT,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    categoryId INTEGER NOT NULL,
    difficulty TEXT DEFAULT 'intermediate',
    techStack TEXT,
    price REAL DEFAULT 0,
    isFree BOOLEAN DEFAULT 1,
    imageUrl TEXT,
    downloadCount INTEGER DEFAULT 0,
    createdBy INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (createdBy) REFERENCES users(id)
);

-- Project Files Table (for source code, reports, PPTs, etc.)
CREATE TABLE IF NOT EXISTS project_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    fileType TEXT NOT NULL,
    filePath TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileSize INTEGER,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    completedDate DATETIME,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (projectId) REFERENCES projects(id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    transactionId TEXT UNIQUE,
    amount REAL NOT NULL,
    paymentMethod TEXT,
    status TEXT DEFAULT 'pending',
    paidAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id)
);

-- Downloads Table (Track user downloads)
CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    fileType TEXT NOT NULL,
    downloadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (projectId) REFERENCES projects(id)
);

-- Custom Requests Table
CREATE TABLE IF NOT EXISTS custom_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    college TEXT NOT NULL,
    projectTitle TEXT NOT NULL,
    domain TEXT NOT NULL,
    description TEXT NOT NULL,
    budget REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_categoryId ON projects(categoryId);
CREATE INDEX IF NOT EXISTS idx_projects_createdBy ON projects(createdBy);
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders(userId);
CREATE INDEX IF NOT EXISTS idx_orders_projectId ON orders(projectId);
CREATE INDEX IF NOT EXISTS idx_downloads_userId ON downloads(userId);
CREATE INDEX IF NOT EXISTS idx_downloads_projectId ON downloads(projectId);
CREATE INDEX IF NOT EXISTS idx_custom_requests_userId ON custom_requests(userId);
CREATE INDEX IF NOT EXISTS idx_project_files_projectId ON project_files(projectId);
