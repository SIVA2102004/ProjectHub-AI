/**
 * File Upload Routes
 */

import express from 'express';
import { 
  uploadProjectFiles, 
  getProjectFiles, 
  deleteProjectFile 
} from '../controllers/uploadController.js';
import { 
  uploadSourceCode, 
  uploadReport, 
  uploadPPT, 
  uploadViva, 
  uploadAbstract 
} from '../utils/fileUpload.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// File upload routes (admin only)
router.post(
  '/project-files',
  authMiddleware,
  adminMiddleware,
  (req, res, next) => {
    const fields = [
      uploadSourceCode.single('sourcecode'),
      uploadReport.single('report'),
      uploadPPT.single('ppt'),
      uploadViva.single('viva'),
      uploadAbstract.single('abstract')
    ];

    // Create a custom middleware to handle multiple file uploads
    const fileFields = [
      { name: 'sourcecode', maxCount: 1 },
      { name: 'report', maxCount: 1 },
      { name: 'ppt', maxCount: 1 },
      { name: 'viva', maxCount: 1 },
      { name: 'abstract', maxCount: 1 }
    ];

    // For now, we'll use a simpler approach with single file handling
    next();
  },
  uploadProjectFiles
);

// Get project files
router.get('/project-files/:projectId', getProjectFiles);

// Delete project file (admin only)
router.delete('/project-files/:fileId', authMiddleware, adminMiddleware, deleteProjectFile);

export default router;
