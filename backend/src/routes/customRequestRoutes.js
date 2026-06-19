/**
 * Custom Requests Routes
 */

import express from 'express';
import { 
  submitCustomRequest, 
  getAllCustomRequests, 
  getMyCustomRequests,
  updateCustomRequest, 
  deleteCustomRequest 
} from '../controllers/customRequestController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', submitCustomRequest);

// Protected student routes
router.get('/my-requests', authMiddleware, getMyCustomRequests);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllCustomRequests);
router.put('/:id', authMiddleware, adminMiddleware, updateCustomRequest);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCustomRequest);

export default router;
