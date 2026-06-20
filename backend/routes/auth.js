/**
 * ProjectHub AI - Authentication Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/me
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { generateToken } = require('../config/jwt');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── Register ───────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = db.prepare(`
      INSERT INTO users (uuid, name, email, password, role, college, phone)
      VALUES (?, ?, ?, ?, 'student', ?, ?)
    `).run(uuidv4(), name.trim(), email.toLowerCase().trim(), hashedPassword, college || null, phone || null);

    const newUser = db.prepare('SELECT id, uuid, name, email, role, college, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── Login ──────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account has been deactivated. Contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── Get Current User ───────────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const user = db.prepare(
    'SELECT id, uuid, name, email, role, college, phone, avatar, created_at FROM users WHERE id = ?'
  ).get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

// ── Update Profile ─────────────────────────────────────────────────────────────
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, college, phone } = req.body;
    db.prepare(`
      UPDATE users SET name = ?, college = ?, phone = ?, updated_at = datetime('now') WHERE id = ?
    `).run(name || req.user.name, college || null, phone || null, req.user.id);

    const updated = db.prepare(
      'SELECT id, uuid, name, email, role, college, phone, created_at FROM users WHERE id = ?'
    ).get(req.user.id);

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ── Change Password ────────────────────────────────────────────────────────────
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    db.prepare("UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?").run(hashed, req.user.id);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
