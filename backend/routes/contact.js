/**
 * ProjectHub AI - Contact Routes
 * POST /api/contact - Submit contact form
 * GET  /api/contact - Get contact messages (Admin)
 */

const express = require('express');
const { db } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Submit contact message
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    db.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(name.trim(), email.toLowerCase().trim(), phone ? phone.trim() : null, subject ? subject.trim() : null, message.trim());

    res.status(201).json({ message: 'Message sent successfully. We will get back to you shortly!' });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// Admin: Get all contact messages
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.json({ messages });
  } catch (err) {
    console.error('Fetch contact messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
