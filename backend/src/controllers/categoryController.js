/**
 * Categories Controller
 * Handles category operations
 */

import { getDatabase } from '../utils/database.js';

const db = getDatabase();

/**
 * Get all categories
 * GET /api/categories
 */
export function getAllCategories(req, res) {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
}

/**
 * Create category (Admin only)
 * POST /api/categories
 */
export function createCategory(req, res) {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const result = db.prepare(`
      INSERT INTO categories (name, description, icon)
      VALUES (?, ?, ?)
    `).run(name, description || '', icon || '');

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
}

/**
 * Update category (Admin only)
 * PUT /api/categories/:id
 */
export function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    db.prepare(`
      UPDATE categories
      SET name = ?, description = ?, icon = ?
      WHERE id = ?
    `).run(
      name || category.name,
      description !== undefined ? description : category.description,
      icon !== undefined ? icon : category.icon,
      id
    );

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
}

/**
 * Delete category (Admin only)
 * DELETE /api/categories/:id
 */
export function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
}
