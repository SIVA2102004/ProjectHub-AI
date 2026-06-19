/**
 * Authentication Routes
 */

import express from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logoutUser);

export default router;
