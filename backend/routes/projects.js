/**
 * ProjectHub AI - Projects Routes
 * Full CRUD + search + filter
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ── Get All Projects (public with search/filter) ───────────────────────────────
router.get('/', optionalAuth, (req, res) => {
  try {
    const {
      search, category, difficulty, is_free, is_featured,
      sort = 'created_at', order = 'desc',
      page = 1, limit = 12
    } = req.query;

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.tech_stack LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (category) {
      query += ` AND (c.slug = ? OR c.name = ?)`;
      params.push(category, category);
    }
    if (difficulty) {
      query += ` AND p.difficulty = ?`;
      params.push(difficulty);
    }
    if (is_free !== undefined) {
      query += ` AND p.is_free = ?`;
      params.push(is_free === 'true' ? 1 : 0);
    }
    if (is_featured !== undefined) {
      query += ` AND p.is_featured = ?`;
      params.push(is_featured === 'true' ? 1 : 0);
    }

    // Count total
    const countQuery = query.replace('SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon', 'SELECT COUNT(*) as total');
    const { total } = db.prepare(countQuery).get(...params);

    // Sort and paginate
    const validSorts = ['created_at', 'price', 'download_count', 'rating', 'title'];
    const sortField = validSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const projects = db.prepare(query).all(...params);

    res.json({
      projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ── Get Single Project ─────────────────────────────────────────────────────────
router.get('/:slug', optionalAuth, (req, res) => {
  try {
    const project = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color, c.icon as category_icon
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.slug = ? OR p.uuid = ?) AND p.is_active = 1
    `).get(req.params.slug, req.params.slug);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Increment view count
    db.prepare('UPDATE projects SET view_count = view_count + 1 WHERE id = ?').run(project.id);

    // Get reviews
    const reviews = db.prepare(`
      SELECT r.*, u.name as user_name FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.project_id = ? AND r.is_approved = 1
      ORDER BY r.created_at DESC LIMIT 10
    `).all(project.id);

    res.json({ project: { ...project, reviews } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ── Create Project (Admin) ─────────────────────────────────────────────────────
router.post('/', authenticate, requireAdmin, (req, res) => {
  try {
    const {
      title, description, short_description, category_id, tech_stack,
      difficulty, price, is_free, is_featured
    } = req.body;

    if (!title || !description || !category_id || !tech_stack) {
      return res.status(400).json({ error: 'Title, description, category, and tech stack are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    const result = db.prepare(`
      INSERT INTO projects (uuid, title, slug, description, short_description, category_id, tech_stack, difficulty, price, is_free, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), title, slug, description, short_description || '', category_id, tech_stack,
      difficulty || 'Intermediate', parseFloat(price) || 0, is_free ? 1 : 0, is_featured ? 1 : 0);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// ── Update Project (Admin) ─────────────────────────────────────────────────────
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, short_description, category_id, tech_stack,
      difficulty, price, is_free, is_featured, is_active
    } = req.body;

    const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    db.prepare(`
      UPDATE projects SET
        title = ?, description = ?, short_description = ?, category_id = ?,
        tech_stack = ?, difficulty = ?, price = ?, is_free = ?, is_featured = ?,
        is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(title, description, short_description, category_id, tech_stack,
      difficulty, parseFloat(price) || 0, is_free ? 1 : 0, is_featured ? 1 : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1, id);

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.json({ message: 'Project updated', project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// ── Delete Project (Admin) ─────────────────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    db.prepare("UPDATE projects SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ── Update Project Files (Admin) ──────────────────────────────────────────────
router.patch('/:id/files', authenticate, requireAdmin, (req, res) => {
  try {
    const { source_file, report_file, ppt_file, abstract_file, viva_file, image_url } = req.body;
    db.prepare(`
      UPDATE projects SET
        source_file = COALESCE(?, source_file),
        report_file = COALESCE(?, report_file),
        ppt_file = COALESCE(?, ppt_file),
        abstract_file = COALESCE(?, abstract_file),
        viva_file = COALESCE(?, viva_file),
        image_url = COALESCE(?, image_url),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(source_file, report_file, ppt_file, abstract_file, viva_file, image_url, req.params.id);
    res.json({ message: 'Project files updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project files' });
  }
});

// ── Submit Review ──────────────────────────────────────────────────────────────
router.post('/:id/reviews', authenticate, (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    db.prepare(`
      INSERT OR REPLACE INTO reviews (user_id, project_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `).run(req.user.id, req.params.id, rating, comment || '');
    res.status(201).json({ message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
