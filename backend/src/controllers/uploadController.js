/**
 * File Upload Controller
 * Handles file uploads for projects
 */

import { getDatabase } from '../utils/database.js';

const db = getDatabase();

/**
 * Upload project files
 * POST /api/uploads/project-files
 */
export function uploadProjectFiles(req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Verify project exists
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const uploadedFiles = [];

    // Process each file type
    const fileTypes = ['sourcecode', 'report', 'ppt', 'viva', 'abstract'];

    for (const fileType of fileTypes) {
      if (req.files[fileType]) {
        const file = req.files[fileType];
        const fileName = file.filename;
        const filePath = file.path;
        const fileSize = file.size;

        // Insert file record in database
        const result = db.prepare(`
          INSERT INTO project_files (projectId, fileType, filePath, fileName, fileSize)
          VALUES (?, ?, ?, ?, ?)
        `).run(projectId, fileType, filePath, fileName, fileSize);

        uploadedFiles.push({
          id: result.lastInsertRowid,
          fileType,
          fileName,
          fileSize
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
}

/**
 * Get project files
 * GET /api/uploads/project-files/:projectId
 */
export function getProjectFiles(req, res) {
  try {
    const { projectId } = req.params;

    const files = db.prepare(`
      SELECT * FROM project_files WHERE projectId = ?
    `).all(projectId);

    return res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get project files error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch files'
    });
  }
}

/**
 * Delete project file
 * DELETE /api/uploads/project-files/:fileId
 */
export function deleteProjectFile(req, res) {
  try {
    const { fileId } = req.params;

    const file = db.prepare('SELECT * FROM project_files WHERE id = ?').get(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    db.prepare('DELETE FROM project_files WHERE id = ?').run(fileId);

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
}
