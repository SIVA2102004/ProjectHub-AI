/**
 * Authentication Middleware
 * Verify JWT tokens and enforce role-based access
 */

import { verifyToken } from '../utils/auth.js';

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export function authMiddleware(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);
    
    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

/**
 * Middleware to verify user is admin
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
}

/**
 * Middleware to verify user is student
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export function studentMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Student access required'
    });
  }

  next();
}

/**
 * Middleware to handle errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
}
