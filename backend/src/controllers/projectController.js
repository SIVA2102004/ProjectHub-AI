/**
 * Projects Controller
 * Handles project CRUD operations
 */

import { getDatabase } from '../utils/database.js';

const db = getDatabase();

/**
 * Get all projects with filtering
 * GET /api/projects
 */
export function getAllProjects(req, res) {
  try {
    const { category, search, sort, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT p.*, c.name as categoryName FROM projects p LEFT JOIN categories c ON p.categoryId = c.id WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND p.categoryId = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Sorting
    if (sort === 'price-low') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price-high') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.createdAt DESC';
    } else if (sort === 'popular') {
      query += ' ORDER BY p.downloadCount DESC';
    } else {
      query += ' ORDER BY p.createdAt DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const projects = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM projects WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND categoryId = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const countResult = db.prepare(countQuery).get(...countParams);

    return res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        total: countResult.total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
}

/**
 * Get single project by ID
 * GET /api/projects/:id
 */
export function getProjectById(req, res) {
  try {
    const { id } = req.params;

    const project = db.prepare(`
      SELECT p.*, c.name as categoryName
      FROM projects p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ?
    `).get(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get project files
    const files = db.prepare(`
      SELECT id, fileType, fileName, fileSize FROM project_files WHERE projectId = ?
    `).all(id);

    project.files = files;

    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
}

/**
 * Create new project (Admin only)
 * POST /api/projects
 */
export function createProject(req, res) {
  try {
    const { title, description, categoryId, difficulty, techStack, price, isFree, imageUrl } = req.body;
    const userId = req.user.id;

    // Validation
    if (!title || !description || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const result = db.prepare(`
      INSERT INTO projects (title, description, categoryId, difficulty, techStack, price, isFree, imageUrl, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      description,
      categoryId,
      difficulty || 'intermediate',
      techStack || '',
      price || 0,
      isFree ? 1 : 0,
      imageUrl || '',
      userId
    );

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
}

/**
 * Update project (Admin only)
 * PUT /api/projects/:id
 */
export function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, description, categoryId, difficulty, techStack, price, isFree, imageUrl } = req.body;

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    db.prepare(`
      UPDATE projects
      SET title = ?, description = ?, categoryId = ?, difficulty = ?, techStack = ?, price = ?, isFree = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || project.title,
      description || project.description,
      categoryId || project.categoryId,
      difficulty || project.difficulty,
      techStack || project.techStack,
      price !== undefined ? price : project.price,
      isFree !== undefined ? (isFree ? 1 : 0) : project.isFree,
      imageUrl || project.imageUrl,
      id
    );

    const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
}

/**
 * Delete project (Admin only)
 * DELETE /api/projects/:id
 */
export function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(id);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
}

/**
 * Get popular projects
 * GET /api/projects/popular
 */
export function getPopularProjects(req, res) {
  try {
    const projects = db.prepare(`
      SELECT p.*, c.name as categoryName
      FROM projects p
      LEFT JOIN categories c ON p.categoryId = c.id
      ORDER BY p.downloadCount DESC
      LIMIT 6
    `).all();

    return res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get popular projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch popular projects'
    });
  }
}
