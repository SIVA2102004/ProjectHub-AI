/**
 * ProjectHub AI - File Upload Routes
 * Handles source code, reports, PPTs, abstracts, viva questions
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['sourcecode', 'reports', 'ppt', 'abstract', 'viva', 'images'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', 'uploads', dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const typeMap = {
      source: 'sourcecode',
      report: 'reports',
      ppt: 'ppt',
      abstract: 'abstract',
      viva: 'viva',
      image: 'images'
    };
    const fileType = req.params.fileType || req.body.fileType || 'sourcecode';
    const dir = typeMap[fileType] || 'sourcecode';
    cb(null, path.join(__dirname, '..', 'uploads', dir));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${safeOriginal}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = /zip|pdf|pptx|ppt|docx|doc|png|jpg|jpeg|gif|webp/i;
  const ext = path.extname(file.originalname).slice(1);
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Upload project file (Admin only)
router.post('/project/:projectId/:fileType', authenticate, requireAdmin, upload.single('file'), (req, res) => {
  try {
    const { projectId, fileType } = req.params;
    const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fieldMap = {
      source: 'source_file',
      report: 'report_file',
      ppt: 'ppt_file',
      abstract: 'abstract_file',
      viva: 'viva_file',
      image: 'image_url'
    };

    const typeToDir = {
      source: 'sourcecode',
      report: 'reports',
      ppt: 'ppt',
      abstract: 'abstract',
      viva: 'viva',
      image: 'images'
    };

    const field = fieldMap[fileType];
    if (!field) return res.status(400).json({ error: 'Invalid file type' });

    const filePath = `${typeToDir[fileType]}/${req.file.filename}`;

    db.prepare(`UPDATE projects SET ${field} = ?, updated_at = datetime('now') WHERE id = ?`).run(filePath, projectId);

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: filePath,
      size: req.file.size,
      url: `/uploads/${filePath}`
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// Delete a project file (Admin only)
router.delete('/project/:projectId/:fileType', authenticate, requireAdmin, (req, res) => {
  try {
    const { projectId, fileType } = req.params;
    const fieldMap = {
      source: 'source_file', report: 'report_file', ppt: 'ppt_file',
      abstract: 'abstract_file', viva: 'viva_file', image: 'image_url'
    };
    const field = fieldMap[fileType];
    if (!field) return res.status(400).json({ error: 'Invalid file type' });

    const project = db.prepare(`SELECT ${field} as filePath FROM projects WHERE id = ?`).get(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.filePath) {
      const fullPath = path.join(__dirname, '..', 'uploads', project.filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    db.prepare(`UPDATE projects SET ${field} = NULL, updated_at = datetime('now') WHERE id = ?`).run(projectId);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
