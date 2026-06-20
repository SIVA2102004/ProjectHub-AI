/**
 * ProjectHub AI - Downloads Routes
 * Track and serve file downloads
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const { db } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Check if user has access to download a project file
function hasAccess(userId, projectId, project) {
  if (project.is_free) return true;
  const order = db.prepare(
    "SELECT id FROM orders WHERE user_id = ? AND project_id = ? AND status = 'completed'"
  ).get(userId, projectId);
  return !!order;
}

// Download a project file
router.get('/:projectId/:fileType', authenticate, (req, res) => {
  try {
    const { projectId, fileType } = req.params;
    const validTypes = ['source', 'report', 'ppt', 'abstract', 'viva'];

    if (!validTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const project = db.prepare('SELECT * FROM projects WHERE id = ? AND is_active = 1').get(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!hasAccess(req.user.id, parseInt(projectId), project)) {
      return res.status(403).json({ error: 'Purchase this project to download files' });
    }

    const fileFieldMap = {
      source: 'source_file',
      report: 'report_file',
      ppt: 'ppt_file',
      abstract: 'abstract_file',
      viva: 'viva_file'
    };

    const filePath = project[fileFieldMap[fileType]];
    if (!filePath) {
      return res.status(404).json({ error: `${fileType} file not available yet` });
    }

    const absolutePath = path.join(__dirname, '..', 'uploads', filePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Track download
    db.prepare(`
      INSERT INTO downloads (user_id, project_id, file_type, ip_address)
      VALUES (?, ?, ?, ?)
    `).run(req.user.id, project.id, fileType, req.ip);

    // Increment download count
    db.prepare('UPDATE projects SET download_count = download_count + 1 WHERE id = ?').run(project.id);

    res.download(absolutePath);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Get user download history
router.get('/history', authenticate, (req, res) => {
  try {
    const downloads = db.prepare(`
      SELECT d.*, p.title as project_title, p.slug as project_slug
      FROM downloads d
      JOIN projects p ON d.project_id = p.id
      WHERE d.user_id = ?
      ORDER BY d.downloaded_at DESC
      LIMIT 50
    `).all(req.user.id);
    res.json({ downloads });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch download history' });
  }
});

module.exports = router;
