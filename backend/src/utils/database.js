/**
 * Database Connection & Initialization
 * Uses sql.js (WebAssembly SQLite) for compiled-free serverless compatibility
 */

import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (writable /tmp on Vercel, local file otherwise)
const dbPath = process.env.VERCEL
  ? '/tmp/projecthub.db'
  : path.join(__dirname, '../../data/projecthub.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize sql.js engine
const SQL = await initSqlJs();

class StatementCompat {
  constructor(sqlJsStmt, dbInstance, dbPath) {
    this.stmt = sqlJsStmt;
    this.dbInstance = dbInstance;
    this.dbPath = dbPath;
  }

  get(...params) {
    try {
      this.stmt.bind(params);
      if (this.stmt.step()) {
        const result = this.stmt.getAsObject();
        this.stmt.reset();
        return result;
      }
      this.stmt.reset();
      return undefined;
    } catch (e) {
      this.stmt.reset();
      throw e;
    }
  }

  all(...params) {
    try {
      this.stmt.bind(params);
      const results = [];
      while (this.stmt.step()) {
        results.push(this.stmt.getAsObject());
      }
      this.stmt.reset();
      return results;
    } catch (e) {
      this.stmt.reset();
      throw e;
    }
  }

  run(...params) {
    try {
      this.stmt.bind(params);
      this.stmt.step();
      this.stmt.reset();
      
      // Save changes to file
      this.dbInstance.save();

      const lastInsertRowid = this.dbInstance.getLastInsertRowid();
      const changes = this.dbInstance.getRowsModified();

      return {
        changes,
        lastInsertRowid
      };
    } catch (e) {
      this.stmt.reset();
      throw e;
    }
  }
}

class DatabaseCompat {
  constructor(dbPath) {
    this.dbPath = dbPath;
    if (fs.existsSync(dbPath)) {
      try {
        const fileBuffer = fs.readFileSync(dbPath);
        this.sqlDb = new SQL.Database(fileBuffer);
      } catch (err) {
        console.error('Failed to load database file, starting fresh:', err);
        this.sqlDb = new SQL.Database();
      }
    } else {
      this.sqlDb = new SQL.Database();
    }
  }

  pragma(str) {
    this.sqlDb.run(`PRAGMA ${str}`);
  }

  prepare(sql) {
    const stmt = this.sqlDb.prepare(sql);
    return new StatementCompat(stmt, this, this.dbPath);
  }

  exec(sql) {
    this.sqlDb.run(sql);
    this.save();
  }

  save() {
    try {
      const data = this.sqlDb.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    } catch (e) {
      console.error('Failed to save sqlite database:', e);
    }
  }

  getLastInsertRowid() {
    const res = this.sqlDb.exec('SELECT last_insert_rowid() AS id');
    if (res && res[0] && res[0].values && res[0].values[0]) {
      return res[0].values[0][0];
    }
    return 0;
  }

  getRowsModified() {
    const res = this.sqlDb.exec('SELECT changes() AS changes');
    if (res && res[0] && res[0].values && res[0].values[0]) {
      return res[0].values[0][0];
    }
    return 0;
  }
}

// Initialize database
const db = new DatabaseCompat(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initializeDatabase() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
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
