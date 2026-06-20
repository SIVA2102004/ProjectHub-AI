/**
 * ProjectHub AI - Authentication & Authorization Middleware
 */

const { verifyToken } = require('../config/jwt');
const { db } = require('../config/database');

/**
 * Middleware: Authenticate JWT token
 * Attaches decoded user to req.user
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    // Verify user still exists and is active
    const user = db.prepare(
      'SELECT id, uuid, name, email, role, is_active FROM users WHERE id = ?'
    ).get(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware: Require admin role
 * Must be used after authenticate()
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

/**
 * Middleware: Optional authentication (attaches user if token present)
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    const user = db.prepare(
      'SELECT id, uuid, name, email, role FROM users WHERE id = ?'
    ).get(decoded.id);
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { authenticate, requireAdmin, optionalAuth };
