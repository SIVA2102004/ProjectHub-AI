/**
 * ProjectHub AI - Categories Routes
 */
const express = require('express');
const { db } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all categories with project counts
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as project_count
      FROM categories c
      LEFT JOIN projects p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.name
    `).all();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category (Admin)
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, icon, description, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
    const result = db.prepare(
      'INSERT INTO categories (name, slug, icon, description, color) VALUES (?, ?, ?, ?, ?)'
    ).run(name, slug, icon || '📁', description || '', color || '#3B82F6');

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

module.exports = router;
