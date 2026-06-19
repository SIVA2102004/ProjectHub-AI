/**
 * Projects Routes
 */

import express from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  getPopularProjects
} from '../controllers/projectController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/popular', getPopularProjects);
router.get('/:id', getProjectById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createProject);
router.put('/:id', authMiddleware, adminMiddleware, updateProject);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

export default router;
