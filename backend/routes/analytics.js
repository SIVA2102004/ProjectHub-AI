/**
 * ProjectHub AI - Analytics Routes (Admin)
 */
const express = require('express');
const { db } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Dashboard summary analytics
router.get('/summary', authenticate, requireAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_active = 1').get().count;
    const totalDownloads = db.prepare('SELECT COUNT(*) as count FROM downloads').get().count;
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'").get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = 'completed'").get().total;
    const pendingRequests = db.prepare("SELECT COUNT(*) as count FROM custom_requests WHERE status = 'pending'").get().count;

    // Monthly revenue (last 6 months)
    const monthlyRevenue = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month,
             SUM(amount) as revenue,
             COUNT(*) as orders
      FROM orders
      WHERE status = 'completed'
        AND created_at >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `).all();

    // Recent users
    const recentUsers = db.prepare(`
      SELECT id, name, email, college, created_at
      FROM users WHERE role = 'student'
      ORDER BY created_at DESC LIMIT 5
    `).all();

    // Recent orders
    const recentOrders = db.prepare(`
      SELECT o.id, o.amount, o.status, o.created_at,
             u.name as user_name, u.email as user_email,
             p.title as project_title
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN projects p ON o.project_id = p.id
      ORDER BY o.created_at DESC LIMIT 5
    `).all();

    // Top projects by downloads
    const topProjects = db.prepare(`
      SELECT p.id, p.title, p.download_count, p.view_count, p.price,
             c.name as category_name
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.download_count DESC LIMIT 5
    `).all();

    // Category distribution
    const categoryStats = db.prepare(`
      SELECT c.name, COUNT(p.id) as project_count, SUM(p.download_count) as downloads
      FROM categories c
      LEFT JOIN projects p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY downloads DESC
    `).all();

    res.json({
      summary: {
        totalUsers,
        totalProjects,
        totalDownloads,
        totalOrders,
        totalRevenue,
        pendingRequests
      },
      monthlyRevenue,
      recentUsers,
      recentOrders,
      topProjects,
      categoryStats
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ── Public Stats ───────────────────────────────────────────────────────────────
router.get('/public-stats', (req, res) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_active = 1').get().count;
    const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;
    
    // Count real downloads from downloads log or sum project downloads
    const downloadsLogCount = db.prepare('SELECT COUNT(*) as count FROM downloads').get().count;
    const projectDownloadsSum = db.prepare('SELECT COALESCE(SUM(download_count), 0) as total FROM projects').get().total;
    const totalDownloads = Math.max(downloadsLogCount, projectDownloadsSum);

    const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM site_visits').get().count;

    res.json({
      projects: totalProjects,
      students: totalStudents,
      downloads: totalDownloads,
      categories: totalCategories,
      visits: totalVisits
    });
  } catch (err) {
    console.error('Public stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── Record Visit ────────────────────────────────────────────────────────────────
router.post('/visit', (req, res) => {
  try {
    const { page } = req.body;
    db.prepare('INSERT INTO site_visits (ip_address, page) VALUES (?, ?)')
      .run(req.ip, page || 'home');
    res.json({ success: true });
  } catch (err) {
    console.error('Record visit error:', err);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// ── Featured Reviews ───────────────────────────────────────────────────────────
router.get('/reviews/featured', (req, res) => {
  try {
    const reviews = db.prepare(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             u.name as user_name, u.college as user_college,
             p.title as project_title, p.slug as project_slug
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN projects p ON r.project_id = p.id
      WHERE r.rating >= 4 AND r.is_approved = 1
      ORDER BY r.created_at DESC
      LIMIT 6
    `).all();
    res.json({ reviews });
  } catch (err) {
    console.error('Featured reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
