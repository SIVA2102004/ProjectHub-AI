/**
 * ProjectHub AI - Custom Project Requests Routes
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Submit custom request (public or authenticated)
router.post('/', optionalAuth, (req, res) => {
  try {
    const { name, email, college, project_title, domain, description, budget } = req.body;

    if (!name || !email || !college || !project_title || !domain || !description) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const result = db.prepare(`
      INSERT INTO custom_requests (uuid, name, email, college, project_title, domain, description, budget, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), name, email, college, project_title, domain, description,
      budget || null, req.user?.id || null);

    const request = db.prepare('SELECT * FROM custom_requests WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Custom project request submitted successfully!', request });
  } catch (err) {
    console.error('Custom request error:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Admin: Get all custom requests
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM custom_requests';
    const params = [];
    if (status) { query += ' WHERE status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const requests = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM custom_requests').get().count;
    res.json({ requests, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Admin: Update request status
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const validStatuses = ['pending', 'in_review', 'accepted', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    db.prepare(`
      UPDATE custom_requests SET status = ?, admin_notes = ?, updated_at = datetime('now') WHERE id = ?
    `).run(status, admin_notes || null, req.params.id);

    res.json({ message: 'Request status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Get user's own requests
router.get('/my', authenticate, (req, res) => {
  try {
    const requests = db.prepare(
      'SELECT * FROM custom_requests WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.id);
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;
