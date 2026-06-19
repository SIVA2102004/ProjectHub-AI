# ProjectHub AI - Database

SQLite database schema and configuration for ProjectHub AI.

## 📊 Database Overview

- **Type:** SQLite 3
- **ORM:** None (better-sqlite3 direct queries)
- **Initialization:** Automatic on server start
- **Location:** `backend/data/projecthub.db`

## 📋 Tables

### users
User accounts for Students and Admins.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,           -- bcryptjs hashed
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',  -- 'student' or 'admin'
    college TEXT,
    phone TEXT,
    profileImage TEXT,
    isActive BOOLEAN DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### projects
Engineering projects available on the platform.

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    categoryId INTEGER NOT NULL,
    difficulty TEXT DEFAULT 'intermediate',  -- beginner, intermediate, advanced
    techStack TEXT,
    price REAL DEFAULT 0,
    isFree BOOLEAN DEFAULT 1,
    imageUrl TEXT,
    downloadCount INTEGER DEFAULT 0,
    createdBy INTEGER NOT NULL,             -- Admin user ID
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (createdBy) REFERENCES users(id)
);
```

### categories
Project categories for organization.

```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### project_files
Files associated with projects (source code, reports, PPTs, etc.).

```sql
CREATE TABLE project_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    fileType TEXT NOT NULL,  -- 'sourcecode', 'report', 'ppt', 'viva', 'abstract'
    filePath TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileSize INTEGER,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id)
);
```

### orders
Purchase orders from students.

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'cancelled'
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    completedDate DATETIME,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (projectId) REFERENCES projects(id)
);
```

### payments
Payment transactions.

```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    transactionId TEXT UNIQUE,
    amount REAL NOT NULL,
    paymentMethod TEXT,
    status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'failed'
    paidAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id)
);
```

### downloads
Track file downloads from students.

```sql
CREATE TABLE downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    fileType TEXT NOT NULL,
    downloadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (projectId) REFERENCES projects(id)
);
```

### custom_requests
Custom project requests from students.

```sql
CREATE TABLE custom_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    college TEXT NOT NULL,
    projectTitle TEXT NOT NULL,
    domain TEXT NOT NULL,
    description TEXT NOT NULL,
    budget REAL NOT NULL,
    status TEXT DEFAULT 'pending',  -- 'pending', 'in-progress', 'completed', 'rejected'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);
```

### reviews
User reviews for projects.

```sql
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    rating INTEGER NOT NULL,          -- 1-5 stars
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES projects(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);
```

## 🔑 Indexes

For performance optimization:

```sql
CREATE INDEX idx_projects_categoryId ON projects(categoryId);
CREATE INDEX idx_projects_createdBy ON projects(createdBy);
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_projectId ON orders(projectId);
CREATE INDEX idx_downloads_userId ON downloads(userId);
CREATE INDEX idx_downloads_projectId ON downloads(projectId);
CREATE INDEX idx_custom_requests_userId ON custom_requests(userId);
CREATE INDEX idx_project_files_projectId ON project_files(projectId);
```

## 📊 Data Types

| Type | Description |
|------|-------------|
| INTEGER | Whole numbers |
| REAL | Decimal numbers (prices, budgets) |
| TEXT | Strings, JSON |
| BOOLEAN | 0 (false) or 1 (true) |
| DATETIME | Timestamps with format |

## 🔄 Relationships

```
users (1) ──→ (many) projects
users (1) ──→ (many) orders
users (1) ──→ (many) downloads
users (1) ──→ (many) custom_requests
users (1) ──→ (many) reviews

categories (1) ──→ (many) projects

projects (1) ──→ (many) orders
projects (1) ──→ (many) downloads
projects (1) ──→ (many) project_files
projects (1) ──→ (many) reviews

orders (1) ──→ (many) payments
```

## 🔍 Common Queries

### Get user orders
```sql
SELECT o.*, p.title, c.name as categoryName
FROM orders o
JOIN projects p ON o.projectId = p.id
LEFT JOIN categories c ON p.categoryId = c.id
WHERE o.userId = ? AND o.status = 'completed'
ORDER BY o.orderDate DESC;
```

### Get project statistics
```sql
SELECT
  COUNT(DISTINCT o.id) as totalOrders,
  COUNT(DISTINCT d.id) as totalDownloads,
  SUM(o.amount) as totalRevenue
FROM projects p
LEFT JOIN orders o ON p.id = o.projectId AND o.status = 'completed'
LEFT JOIN downloads d ON p.id = d.projectId
WHERE p.id = ?;
```

### Get monthly revenue
```sql
SELECT
  strftime('%Y-%m', completedDate) as month,
  COUNT(*) as orderCount,
  SUM(amount) as revenue
FROM orders
WHERE status = 'completed' AND completedDate >= date('now', '-12 months')
GROUP BY strftime('%Y-%m', completedDate)
ORDER BY month DESC;
```

### Get user purchase history
```sql
SELECT
  o.*,
  p.title,
  p.imageUrl,
  c.name as categoryName
FROM orders o
JOIN projects p ON o.projectId = p.id
LEFT JOIN categories c ON p.categoryId = c.id
WHERE o.userId = ?
ORDER BY o.orderDate DESC;
```

## 🛠 Database Management

### Reset Database
```bash
# Delete the database file
rm backend/data/projecthub.db

# Restart server to reinitialize
npm run dev
```

### Backup Database
```bash
cp backend/data/projecthub.db backup/projecthub_$(date +%Y%m%d_%H%M%S).db
```

### Access Database Directly
```bash
sqlite3 backend/data/projecthub.db
```

### View Table Structure
```sql
.schema tableName
```

### List All Tables
```sql
.tables
```

## 📈 Performance Tips

1. **Indexes:** Check if frequently queried columns are indexed
2. **Query Optimization:** Use EXPLAIN QUERY PLAN to analyze queries
3. **Pagination:** Always use LIMIT and OFFSET for large datasets
4. **Denormalization:** Consider storing calculated values (like downloadCount)
5. **Archiving:** Archive old orders/downloads periodically

## 🔒 Security

- ✅ Passwords are bcryptjs hashed
- ✅ Foreign key constraints enabled
- ✅ No sensitive data in logs
- ✅ SQL injection prevention via parameterized queries
- ✅ Data validation before insertion

## 📝 Migrations

Schema updates are handled manually in `schema.sql`. For new versions:

1. Update `schema.sql`
2. Create migration script
3. Test on backup database
4. Deploy migration

## 🚀 Scaling Considerations

### When to migrate to PostgreSQL/MySQL:
- > 1M users
- > 100M records
- High concurrent users (>1000)
- Need for advanced querying
- Complex reporting requirements

### Preparation for migration:
- Keep SQL standard and compatible
- Avoid SQLite-specific features
- Use parameterized queries consistently
- Document schema changes

## 📊 Monitoring

### Key Metrics to Monitor
- Database file size
- Query response time
- Number of active users
- Monthly revenue trends
- Popular projects
- User retention

### Queries for Monitoring
```sql
-- Database file size
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();

-- Active users (last 30 days)
SELECT COUNT(DISTINCT userId) FROM downloads
WHERE downloadedAt >= date('now', '-30 days');

-- Top projects
SELECT p.title, COUNT(o.id) as orders
FROM projects p
LEFT JOIN orders o ON p.id = o.projectId
GROUP BY p.id
ORDER BY orders DESC LIMIT 10;
```

## ❓ FAQ

**Q: How to add new column to table?**
A: Use `ALTER TABLE` - backup first!

**Q: How to delete user and cascade?**
A: Foreign key constraints will prevent deletion. Consider soft deletes.

**Q: How to export data?**
A: Use `.mode csv` then `.output file.csv` in SQLite CLI

**Q: How to import data?**
A: Use `.mode csv` then `.import file.csv tableName` in SQLite CLI

---

**Version:** 1.0.0
**Last Updated:** June 2024
