/**
 * Authentication Utilities
 * JWT token generation and verification
 */

import jwt from 'jwt-simple';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'projecthub-ai-secret-key-2024';

/**
 * Generate JWT Token
 * @param {Object} payload - User data to encode
 * @returns {string} JWT token
 */
export function generateToken(payload) {
  try {
    return jwt.encode(payload, JWT_SECRET);
  } catch (error) {
    console.error('Token generation failed:', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
export function verifyToken(token) {
  try {
    return jwt.decode(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}

/**
 * Hash Password
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare Password with Hash
 * @param {string} password - Plain password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate User Payload for Token
 * @param {Object} user - User object
 * @returns {Object} Token payload
 */
export function generatePayload(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
}
