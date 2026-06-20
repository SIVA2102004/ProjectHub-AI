/**
 * ProjectHub AI - Orders Routes
 */
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Create order (Purchase project)
router.post('/', authenticate, (req, res) => {
  try {
    const { project_id, payment_method = 'manual', transaction_id, notes } = req.body;

    if (!project_id) return res.status(400).json({ error: 'Project ID is required' });

    const project = db.prepare('SELECT * FROM projects WHERE id = ? AND is_active = 1').get(project_id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Check if already purchased
    const existing = db.prepare(
      "SELECT id FROM orders WHERE user_id = ? AND project_id = ? AND status = 'completed'"
    ).get(req.user.id, project_id);
    if (existing) return res.status(409).json({ error: 'You already own this project' });

    const orderUuid = uuidv4();
    const result = db.prepare(`
      INSERT INTO orders (uuid, user_id, project_id, amount, status, payment_method, transaction_id, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(orderUuid, req.user.id, project_id, project.price,
      project.is_free ? 'completed' : 'pending',
      payment_method, transaction_id || null, notes || null);

    // Create payment record
    db.prepare(`
      INSERT INTO payments (order_id, user_id, amount, status, gateway, gateway_transaction_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(result.lastInsertRowid, req.user.id, project.price,
      project.is_free ? 'success' : 'pending', payment_method, transaction_id || null);

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Order created', order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my', authenticate, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, p.title as project_title, p.slug as project_slug, 
             p.image_url, c.name as category_name
      FROM orders o
      JOIN projects p ON o.project_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Get all orders
router.get('/', authenticate, requireAdmin, (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email,
             p.title as project_title
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN projects p ON o.project_id = p.id
    `;
    const params = [];
    if (status) { query += ' WHERE o.status = ?'; params.push(status); }
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const orders = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.patch('/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Verify payment for a pending order
router.post('/verify', authenticate, (req, res) => {
  try {
    const { order_id, transaction_id, status } = req.body;

    if (!order_id || !status) {
      return res.status(400).json({ error: 'Order ID and status are required' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(order_id, req.user.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status === 'success') {
      const txId = transaction_id || 'tx_mock_' + uuidv4().replace(/-/g, '').substring(0, 12);
      db.prepare(`
        UPDATE orders 
        SET status = 'completed', transaction_id = ?, updated_at = datetime('now') 
        WHERE id = ?
      `).run(txId, order_id);

      db.prepare(`
        UPDATE payments 
        SET status = 'success', gateway_transaction_id = ? 
        WHERE order_id = ?
      `).run(txId, order_id);

      res.json({ message: 'Payment verified and order completed successfully' });
    } else {
      db.prepare(`
        UPDATE orders 
        SET status = 'cancelled', updated_at = datetime('now') 
        WHERE id = ?
      `).run(order_id);

      db.prepare(`
        UPDATE payments 
        SET status = 'failed' 
        WHERE order_id = ?
      `).run(order_id);

      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
