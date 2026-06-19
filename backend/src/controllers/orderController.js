/**
 * Orders and Downloads Controller
 * Handles orders, payments, and downloads
 */

import { getDatabase } from '../utils/database.js';

const db = getDatabase();

/**
 * Create order
 * POST /api/orders
 */
export function createOrder(req, res) {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Check if project exists
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user already has this project
    const existingOrder = db.prepare(`
      SELECT * FROM orders WHERE userId = ? AND projectId = ? AND status = 'completed'
    `).get(userId, projectId);

    if (existingOrder && !project.isFree) {
      return res.status(400).json({
        success: false,
        message: 'You already own this project'
      });
    }

    // Create order
    const result = db.prepare(`
      INSERT INTO orders (userId, projectId, amount, status)
      VALUES (?, ?, ?, ?)
    `).run(
      userId,
      projectId,
      project.price || 0,
      project.isFree ? 'completed' : 'pending'
    );

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
}

/**
 * Get user orders
 * GET /api/orders
 */
export function getUserOrders(req, res) {
  try {
    const userId = req.user.id;

    const orders = db.prepare(`
      SELECT o.*, p.title, p.imageUrl, c.name as categoryName
      FROM orders o
      JOIN projects p ON o.projectId = p.id
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE o.userId = ?
      ORDER BY o.orderDate DESC
    `).all(userId);

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
}

/**
 * Get all orders (Admin only)
 * GET /api/admin/orders
 */
export function getAllOrders(req, res) {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT o.*, p.title, u.email, u.firstName, u.lastName
      FROM orders o
      JOIN projects p ON o.projectId = p.id
      JOIN users u ON o.userId = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.orderDate DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const orders = db.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const countResult = db.prepare(countQuery).get(...countParams);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total: countResult.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
}

/**
 * Record download
 * POST /api/downloads
 */
export function recordDownload(req, res) {
  try {
    const { projectId, fileType } = req.body;
    const userId = req.user.id;

    if (!projectId || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'Project ID and file type are required'
      });
    }

    // Check if user has access to project
    const order = db.prepare(`
      SELECT * FROM orders WHERE userId = ? AND projectId = ? AND status = 'completed'
    `).get(userId, projectId);

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);

    if (!order && !project.isFree) {
      return res.status(403).json({
        success: false,
        message: 'You don\'t have access to this project'
      });
    }

    // Record download
    const result = db.prepare(`
      INSERT INTO downloads (userId, projectId, fileType)
      VALUES (?, ?, ?)
    `).run(userId, projectId, fileType);

    // Update download count
    db.prepare(`
      UPDATE projects SET downloadCount = downloadCount + 1 WHERE id = ?
    `).run(projectId);

    return res.status(201).json({
      success: true,
      message: 'Download recorded successfully'
    });
  } catch (error) {
    console.error('Record download error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record download'
    });
  }
}

/**
 * Get user's downloads
 * GET /api/downloads
 */
export function getUserDownloads(req, res) {
  try {
    const userId = req.user.id;

    const downloads = db.prepare(`
      SELECT d.*, p.title, p.imageUrl
      FROM downloads d
      JOIN projects p ON d.projectId = p.id
      WHERE d.userId = ?
      GROUP BY d.projectId, d.fileType
      ORDER BY d.downloadedAt DESC
    `).all(userId);

    return res.status(200).json({
      success: true,
      data: downloads
    });
  } catch (error) {
    console.error('Get user downloads error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch downloads'
    });
  }
}

/**
 * Process payment (Mock)
 * POST /api/payments
 */
export function processPayment(req, res) {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Mock payment processing
    const transactionId = 'TXN_' + Date.now();

    // Create payment record
    const result = db.prepare(`
      INSERT INTO payments (orderId, transactionId, amount, status, paidAt)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(orderId, transactionId, amount, 'completed');

    // Update order status
    db.prepare(`
      UPDATE orders SET status = 'completed', completedDate = CURRENT_TIMESTAMP WHERE id = ?
    `).run(orderId);

    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process payment'
    });
  }
}
