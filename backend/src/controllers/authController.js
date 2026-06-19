/**
 * Authentication Controller
 * Handles user registration, login, and logout
 */

import { getDatabase } from '../utils/database.js';
import { hashPassword, comparePassword, generatePayload, generateToken } from '../utils/auth.js';

const db = getDatabase();

/**
 * Register new user
 * POST /api/auth/register
 */
export function registerUser(req, res) {
  try {
    const { username, email, password, firstName, lastName, college } = req.body;

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists'
      });
    }

    // Hash password
    hashPassword(password).then(hashedPassword => {
      try {
        // Insert new user
        const result = db.prepare(`
          INSERT INTO users (username, email, password, firstName, lastName, role, college)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(username, email, hashedPassword, firstName, lastName, 'student', college || null);

        // Fetch created user
        const user = db.prepare('SELECT id, username, email, firstName, lastName, role FROM users WHERE id = ?').get(result.lastInsertRowid);

        // Generate token
        const payload = generatePayload(user);
        const token = generateToken(payload);

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: {
            user,
            token
          }
        });
      } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to register user'
        });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
export function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    comparePassword(password, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate token
      const payload = generatePayload(user);
      const token = generateToken(payload);

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          token
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Get current user
 * GET /api/auth/me
 */
export function getCurrentUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = db.prepare('SELECT id, username, email, firstName, lastName, role, college FROM users WHERE id = ?').get(req.user.id);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export function logoutUser(req, res) {
  try {
    // In JWT-based auth, logout is typically handled on client side
    // by removing the token. Server-side can optionally maintain a blacklist.
    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
