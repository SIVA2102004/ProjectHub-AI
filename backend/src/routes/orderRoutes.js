/**
 * Orders and Downloads Routes
 */

import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getAllOrders,
  recordDownload, 
  getUserDownloads,
  processPayment 
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protected student routes
router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.post('/downloads', authMiddleware, recordDownload);
router.get('/downloads', authMiddleware, getUserDownloads);
router.post('/payments', authMiddleware, processPayment);

// Admin routes
router.get('/admin/orders', authMiddleware, adminMiddleware, getAllOrders);

export default router;
