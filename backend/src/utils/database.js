/**
 * Database Connection & Initialization
 * Uses better-sqlite3 for SQLite database
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../uploads/../data/projecthub.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
function initializeDatabase() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    
    // Split and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement);
      }
    }
    
    console.log('✓ Database initialized successfully');
    return true;
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    return false;
  }
}

// Get database instance
function getDatabase() {
  return db;
}

module.exports = {
  db,
  getDatabase,
  initializeDatabase
};
