/**
 * Admin Routes
 */

import express from 'express';
import { 
  getDashboardAnalytics, 
  getUsers, 
  updateUserRole, 
  deleteUser 
} from '../controllers/analyticsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected
router.use(authMiddleware, adminMiddleware);

// Analytics
router.get('/analytics', getDashboardAnalytics);

// Users management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
