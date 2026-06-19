/**
 * Custom Requests Controller
 * Handles custom project requests from students
 */

import { getDatabase } from '../utils/database.js';

const db = getDatabase();

/**
 * Submit custom project request
 * POST /api/custom-requests
 */
export function submitCustomRequest(req, res) {
  try {
    const { name, email, college, projectTitle, domain, description, budget } = req.body;
    const userId = req.user ? req.user.id : null;

    // Validation
    if (!name || !email || !college || !projectTitle || !domain || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Budget validation
    if (budget < 3000) {
      return res.status(400).json({
        success: false,
        message: 'Minimum budget is ₹3000'
      });
    }

    const result = db.prepare(`
      INSERT INTO custom_requests (userId, name, email, college, projectTitle, domain, description, budget, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      name,
      email,
      college,
      projectTitle,
      domain,
      description,
      budget,
      'pending'
    );

    return res.status(201).json({
      success: true,
      message: 'Custom project request submitted successfully',
      data: {
        id: result.lastInsertRowid
      }
    });
  } catch (error) {
    console.error('Submit custom request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit custom request'
    });
  }
}

/**
 * Get all custom requests (Admin only)
 * GET /api/custom-requests
 */
export function getAllCustomRequests(req, res) {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT * FROM custom_requests WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const requests = db.prepare(query).all(...params);

    // Get count
    let countQuery = 'SELECT COUNT(*) as total FROM custom_requests WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const countResult = db.prepare(countQuery).get(...countParams);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total: countResult.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get custom requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch custom requests'
    });
  }
}

/**
 * Get user's custom requests
 * GET /api/custom-requests/my-requests
 */
export function getMyCustomRequests(req, res) {
  try {
    const userId = req.user.id;

    const requests = db.prepare(`
      SELECT * FROM custom_requests WHERE userId = ? ORDER BY createdAt DESC
    `).all(userId);

    return res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get my custom requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch custom requests'
    });
  }
}

/**
 * Update custom request status (Admin only)
 * PUT /api/custom-requests/:id
 */
export function updateCustomRequest(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'in-progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = db.prepare('SELECT * FROM custom_requests WHERE id = ?').get(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    db.prepare(`
      UPDATE custom_requests SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, id);

    const updated = db.prepare('SELECT * FROM custom_requests WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update custom request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update request'
    });
  }
}

/**
 * Delete custom request
 * DELETE /api/custom-requests/:id
 */
export function deleteCustomRequest(req, res) {
  try {
    const { id } = req.params;

    const request = db.prepare('SELECT * FROM custom_requests WHERE id = ?').get(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    db.prepare('DELETE FROM custom_requests WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete custom request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete request'
    });
  }
}
