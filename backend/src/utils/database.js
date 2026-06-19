/**
 * Database Connection & Initialization
 * Uses alasql (Pure JS SQL engine) for compiled-free serverless compatibility
 */

import alasql from 'alasql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (writable /tmp on Vercel, local file otherwise)
const dbPath = process.env.VERCEL
  ? '/tmp/projecthub.json'
  : path.join(__dirname, '../../data/projecthub.json');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

class StatementCompat {
  constructor(sql, dbInstance) {
    this.sql = sql;
    this.dbInstance = dbInstance;
  }

  get(...params) {
    try {
      const results = alasql(this.sql, params);
      return results[0] || undefined;
    } catch (e) {
      console.error('alasql get error on query:', this.sql, e);
      throw e;
    }
  }

  all(...params) {
    try {
      return alasql(this.sql, params);
    } catch (e) {
      console.error('alasql all error on query:', this.sql, e);
      throw e;
    }
  }

  run(...params) {
    try {
      const result = alasql(this.sql, params);
      
      // Save changes to file
      this.dbInstance.save();

      let lastInsertRowid = 0;
      if (this.sql.toLowerCase().includes('insert')) {
        // Find name of table being inserted into
        const matches = this.sql.match(/insert\s+into\s+(\w+)/i);
        const tableName = matches ? matches[1] : null;
        if (tableName) {
          const lastIdRes = alasql(`SELECT MAX(id) AS id FROM ${tableName}`);
          if (lastIdRes && lastIdRes[0]) {
            lastInsertRowid = lastIdRes[0].id || 0;
          }
        }
      }

      return {
        changes: typeof result === 'number' ? result : 1,
        lastInsertRowid
      };
    } catch (e) {
      console.error('alasql run error on query:', this.sql, e);
      throw e;
    }
  }
}

class DatabaseCompat {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.load();
  }

  pragma(str) {
    // Ignore SQLite pragma statements in alasql
  }

  prepare(sql) {
    return new StatementCompat(sql, this);
  }

  exec(sql) {
    try {
      alasql(sql);
      this.save();
    } catch (e) {
      // Suppress minor index or SQLite-specific syntax warnings
      if (!sql.toLowerCase().includes('index')) {
        console.error('alasql exec error:', e);
      }
    }
  }

  save() {
    try {
      const tables = alasql.databases.alasql.tables;
      const dbData = {};
      for (const name in tables) {
        if (tables[name] && tables[name].data) {
          dbData[name] = tables[name].data;
        }
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(dbData, null, 2));
    } catch (e) {
      console.error('Failed to save alasql database:', e);
    }
  }

  load() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const fileContent = fs.readFileSync(this.dbPath, 'utf8');
        const dbData = JSON.parse(fileContent);
        
        for (const name in dbData) {
          alasql(`CREATE TABLE IF NOT EXISTS ${name}`);
          if (alasql.databases.alasql.tables[name]) {
            alasql.databases.alasql.tables[name].data = dbData[name];
          }
        }
      } catch (err) {
        console.error('Failed to load alasql database, starting fresh:', err);
      }
    }
  }
}

// Initialize database
const db = new DatabaseCompat(dbPath);

// Initialize schema
export function initializeDatabase() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    
    const cleanSchema = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanSchema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        db.exec(statement);
      }
    }
    
    db.load();
    
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
