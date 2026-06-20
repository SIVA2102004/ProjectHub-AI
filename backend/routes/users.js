/**
 * ProjectHub AI - Users Management Routes (Admin)
 */
const express = require('express');
const { db } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Admin: Get all users
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    let query = 'SELECT id, uuid, name, email, role, college, phone, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) { query += ' AND role = ?'; params.push(role); }

    const countQuery = query.replace('SELECT id, uuid, name, email, role, college, phone, is_active, created_at', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const users = db.prepare(query).all(...params);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Get single user with stats
router.get('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, uuid, name, email, role, college, phone, is_active, created_at FROM users WHERE id = ?'
    ).get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const orders = db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE user_id = ? AND status = 'completed'"
    ).get(req.params.id);
    const downloads = db.prepare(
      'SELECT COUNT(*) as count FROM downloads WHERE user_id = ?'
    ).get(req.params.id);

    res.json({ user: { ...user, total_orders: orders.count, total_downloads: downloads.count } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Admin: Toggle user active status
router.patch('/:id/toggle-active', authenticate, requireAdmin, (req, res) => {
  try {
    const user = db.prepare('SELECT id, is_active FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newStatus = user.is_active ? 0 : 1;
    db.prepare("UPDATE users SET is_active = ?, updated_at = datetime('now') WHERE id = ?").run(newStatus, req.params.id);
    res.json({ message: `User ${newStatus ? 'activated' : 'deactivated'}`, is_active: newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Admin: Delete user
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin users' });

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
