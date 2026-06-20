/**
 * ProjectHub AI - Database Configuration
 * SQLite database initialization with schema creation and seeding
 */

const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/projecthub.db';

// Ensure database directory exists
const dbDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create/open database connection
const db = new Database(path.resolve(DB_PATH));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initialize all database tables and seed initial data
 */
function initializeDatabase() {
  console.log('🗄️  Initializing database...');

  // ── Create Tables ──────────────────────────────────────────────────────────

  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'admin')),
      college TEXT,
      phone TEXT,
      avatar TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      description TEXT,
      color TEXT DEFAULT '#3B82F6',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Projects table
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      category_id INTEGER NOT NULL,
      tech_stack TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'Intermediate' CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
      price REAL NOT NULL DEFAULT 0,
      is_free INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      includes_source INTEGER DEFAULT 1,
      includes_report INTEGER DEFAULT 1,
      includes_ppt INTEGER DEFAULT 1,
      includes_abstract INTEGER DEFAULT 1,
      includes_viva INTEGER DEFAULT 1,
      source_file TEXT,
      report_file TEXT,
      ppt_file TEXT,
      abstract_file TEXT,
      viva_file TEXT,
      download_count INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled', 'refunded')),
      payment_method TEXT DEFAULT 'manual',
      transaction_id TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    -- Payments table
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed', 'refunded')),
      gateway TEXT DEFAULT 'manual',
      gateway_transaction_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Downloads table
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      file_type TEXT NOT NULL CHECK(file_type IN ('source', 'report', 'ppt', 'abstract', 'viva')),
      downloaded_at TEXT NOT NULL DEFAULT (datetime('now')),
      ip_address TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    -- Custom Requests table
    CREATE TABLE IF NOT EXISTS custom_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      college TEXT NOT NULL,
      project_title TEXT NOT NULL,
      domain TEXT NOT NULL,
      description TEXT NOT NULL,
      budget TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_review', 'accepted', 'completed', 'rejected')),
      admin_notes TEXT,
      user_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Reviews table
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      is_approved INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, project_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    -- Site visits table
    CREATE TABLE IF NOT EXISTS site_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visited_at TEXT NOT NULL DEFAULT (datetime('now')),
      ip_address TEXT,
      page TEXT
    );

    -- Contact messages table
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // ── Seed Categories ────────────────────────────────────────────────────────
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare(`
      INSERT INTO categories (name, slug, icon, description, color) VALUES (?, ?, ?, ?, ?)
    `);
    const categories = [
      ['AI & ML', 'ai-ml', '🤖', 'Artificial Intelligence and Machine Learning projects', '#8B5CF6'],
      ['Web Development', 'web-development', '🌐', 'Full-stack and frontend web projects', '#3B82F6'],
      ['Python', 'python', '🐍', 'Python programming projects', '#10B981'],
      ['Data Science', 'data-science', '📊', 'Data analysis and visualization projects', '#F59E0B'],
      ['Blockchain', 'blockchain', '⛓️', 'Blockchain and cryptocurrency projects', '#6366F1'],
      ['IoT', 'iot', '📡', 'Internet of Things projects', '#EC4899'],
      ['Android', 'android', '📱', 'Android mobile application projects', '#14B8A6'],
      ['Computer Vision', 'computer-vision', '👁️', 'Image processing and CV projects', '#F97316'],
      ['NLP', 'nlp', '💬', 'Natural Language Processing projects', '#06B6D4'],
    ];
    categories.forEach(c => insertCategory.run(...c));
    console.log('✅ Categories seeded');
  }

  // ── Seed Admin User ────────────────────────────────────────────────────────
  const adminExists = db.prepare("SELECT id FROM users WHERE email = 'admin@projecthub.ai'").get();
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('Admin@123', 12);
    db.prepare(`
      INSERT INTO users (uuid, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin-uuid-001', 'Admin', 'admin@projecthub.ai', hashedPassword, 'admin');
    console.log('✅ Admin user created: admin@projecthub.ai / Admin@123');
  }

  // ── Seed Sample Projects ───────────────────────────────────────────────────
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectCount.count === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (uuid, title, slug, description, short_description, category_id, tech_stack, difficulty, price, is_free, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const projects = [
      ['proj-001', 'Face Recognition Attendance System', 'face-recognition-attendance',
        'A smart attendance system using computer vision and deep learning. Uses OpenCV and face_recognition library to detect and identify faces in real-time. Records attendance automatically in a database with timestamp.',
        'Automated attendance using facial recognition technology', 8, 'Python, OpenCV, face_recognition, SQLite, Tkinter', 'Advanced', 999, 0, 1],
      ['proj-002', 'AI Resume Analyzer', 'ai-resume-analyzer',
        'An intelligent resume analyzer that uses NLP techniques to parse and evaluate resumes. Provides skill matching, ATS score, and improvement suggestions using Python and spaCy.',
        'Smart resume parsing and scoring with NLP', 9, 'Python, NLP, spaCy, Flask, React', 'Intermediate', 799, 0, 1],
      ['proj-003', 'AI Chatbot with NLP', 'ai-chatbot-nlp',
        'A conversational AI chatbot built using Natural Language Processing. Supports intent recognition, context management, and multi-turn conversations. Integrated with a React frontend.',
        'Conversational AI chatbot with intent recognition', 9, 'Python, NLTK, TensorFlow, Flask, React', 'Advanced', 1299, 0, 1],
      ['proj-004', 'Expense Tracker App', 'expense-tracker',
        'A full-featured personal finance tracker with budget management, expense categorization, charts, and monthly reports. Built with React and Node.js backend.',
        'Personal finance management web application', 2, 'React, Node.js, Express, SQLite, Chart.js', 'Beginner', 499, 1, 0],
      ['proj-005', 'E-Commerce Website', 'ecommerce-website',
        'A complete e-commerce platform with product listings, cart management, user authentication, admin panel, payment integration, and order tracking.',
        'Full-featured online shopping platform', 2, 'React, Node.js, Express, SQLite, Stripe', 'Intermediate', 1999, 0, 1],
      ['proj-006', 'Student Management System', 'student-management-system',
        'A comprehensive student management system for colleges. Manages student records, attendance, grades, course enrollment, and generates reports.',
        'Complete college student record management', 2, 'Python, Django, PostgreSQL, Bootstrap', 'Intermediate', 699, 0, 0],
      ['proj-007', 'Library Management System', 'library-management-system',
        'A digital library management system with book catalog, member management, issue/return tracking, fine calculation, and search functionality.',
        'Digital library catalog and circulation system', 3, 'Python, Tkinter, SQLite, ReportLab', 'Beginner', 499, 1, 0],
      ['proj-008', 'Attendance Management System', 'attendance-management-system',
        'A web-based attendance management system with QR code scanning, manual entry, leave management, and detailed reporting for educational institutions.',
        'QR-based attendance tracking for institutions', 2, 'React, Node.js, Express, SQLite, QR Code', 'Intermediate', 799, 0, 0],
      ['proj-009', 'Blockchain Voting System', 'blockchain-voting-system',
        'A secure and transparent voting system built on Ethereum blockchain. Uses smart contracts to ensure vote integrity, anonymity, and prevent tampering.',
        'Decentralized secure voting on Ethereum', 5, 'Solidity, Ethereum, Web3.js, React, Truffle', 'Advanced', 1999, 0, 1],
      ['proj-010', 'Sales Prediction System', 'sales-prediction-system',
        'A machine learning system that predicts future sales using historical data. Implements multiple regression models, time series forecasting, and visualizes predictions with interactive charts.',
        'ML-powered sales forecasting and analytics', 4, 'Python, Scikit-learn, Pandas, Flask, Chart.js', 'Advanced', 1299, 0, 0],
    ];
    projects.forEach(p => insertProject.run(...p));
    console.log('✅ Sample projects seeded');
  }

  // ── Seed Student User & Reviews ─────────────────────────────────────────────
  const studentExists = db.prepare("SELECT id FROM users WHERE email = 'student@projecthub.ai'").get();
  let studentId;
  if (!studentExists) {
    const hashedPassword = bcrypt.hashSync('Student@123', 12);
    const result = db.prepare(`
      INSERT INTO users (uuid, name, email, password, role, college, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('student-uuid-001', 'Rohan Sharma', 'student@projecthub.ai', hashedPassword, 'student', 'IIT Delhi', '+919876543210');
    studentId = result.lastInsertRowid;
    console.log('✅ Student user created: student@projecthub.ai / Student@123');
  } else {
    studentId = studentExists.id;
  }

  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  if (reviewCount.count === 0) {
    const insertReview = db.prepare(`
      INSERT INTO reviews (user_id, project_id, rating, comment, is_approved) VALUES (?, ?, ?, ?, 1)
    `);
    const reviewsToSeed = [
      [studentId, 1, 5, 'Absolutely saved my project! The facial recognition attendance works flawlessly and the code is highly readable.'],
      [studentId, 2, 5, 'The spaCy parsing was very accurate and the React UI is stunning. Highly recommended!'],
      [studentId, 3, 4, 'Great chatbot logic. The multi-turn conversation holds up well. Documentation was very detailed.'],
      [studentId, 5, 5, 'Complete web store package. Saved me weeks of development for my web tech lab.'],
      [studentId, 9, 5, 'Brilliant smart contracts implementation. Easy to deploy with truffle/hardhat. 10/10!']
    ];
    reviewsToSeed.forEach(r => {
      const proj = db.prepare('SELECT id FROM projects WHERE id = ?').get(r[1]);
      if (proj) {
        insertReview.run(...r);
      }
    });
    console.log('✅ Sample reviews seeded');
  }

  console.log('✅ Database initialized successfully\n');
}

module.exports = { db, initializeDatabase };
