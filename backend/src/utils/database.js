/**
 * Database Connection & Initialization
 * Uses better-sqlite3 for SQLite database
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, '../../data/projecthub.db');

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
export function initializeDatabase() {
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
export function getDatabase() {
  return db;
}

export { db };
