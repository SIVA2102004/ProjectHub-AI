/**
 * Analytics and Admin Controller
 * Handles analytics and admin dashboard data
 */

import { getDatabase } from '../utils/database.js';

const db = getDatabase();

/**
 * Get dashboard analytics
 * GET /api/admin/analytics
 */
export function getDashboardAnalytics(req, res) {
  try {
    // Total users
    const totalUsersResult = db.prepare('SELECT COUNT(*) as total FROM users').get();
    const totalUsers = totalUsersResult.total;

    // Total projects
    const totalProjectsResult = db.prepare('SELECT COUNT(*) as total FROM projects').get();
    const totalProjects = totalProjectsResult.total;

    // Total downloads
    const totalDownloadsResult = db.prepare('SELECT COUNT(*) as total FROM downloads').get();
    const totalDownloads = totalDownloadsResult.total;

    // Total orders
    const totalOrdersResult = db.prepare('SELECT COUNT(*) as total FROM orders WHERE status = "completed"').get();
    const totalOrders = totalOrdersResult.total;

    // Total revenue
    const revenueResult = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = 'completed'
    `).get();
    const totalRevenue = revenueResult.total;

    // Monthly revenue (last 12 months)
    const monthlyRevenue = db.prepare(`
      SELECT
        strftime('%Y-%m', completedDate) as month,
        COALESCE(SUM(amount), 0) as revenue
      FROM orders
      WHERE status = 'completed'
        AND completedDate >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', completedDate)
      ORDER BY month DESC
    `).all();

    // Recent users
    const recentUsers = db.prepare(`
      SELECT id, firstName, lastName, email, createdAt
      FROM users
      ORDER BY createdAt DESC
      LIMIT 5
    `).all();

    // Recent orders
    const recentOrders = db.prepare(`
      SELECT o.*, p.title, u.email
      FROM orders o
      JOIN projects p ON o.projectId = p.id
      JOIN users u ON o.userId = u.id
      ORDER BY o.orderDate DESC
      LIMIT 5
    `).all();

    // Category breakdown
    const categoryBreakdown = db.prepare(`
      SELECT c.name, COUNT(p.id) as projectCount
      FROM categories c
      LEFT JOIN projects p ON c.id = p.categoryId
      GROUP BY c.id
    `).all();

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalProjects,
          totalDownloads,
          totalOrders,
          totalRevenue
        },
        monthlyRevenue,
        recentUsers,
        recentOrders,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
}

/**
 * Get user management data
 * GET /api/admin/users
 */
export function getUsers(req, res) {
  try {
    const { limit = 20, offset = 0, role, search } = req.query;

    let query = 'SELECT id, username, email, firstName, lastName, role, college, createdAt FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      query += ' AND (email LIKE ? OR firstName LIKE ? OR lastName LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = db.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    if (search) {
      countQuery += ' AND (email LIKE ? OR firstName LIKE ? OR lastName LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = db.prepare(countQuery).get(...countParams);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: countResult.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
}

/**
 * Update user role
 * PUT /api/admin/users/:id/role
 */
export function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
}

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
}
