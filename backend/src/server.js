/**
 * Express Server - ProjectHub AI Backend
 * Main server setup and initialization
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './utils/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Import middleware
import { errorHandler } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Initialize database
console.log('Initializing database...');
initializeDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   ProjectHub AI Backend Server Started ║
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
╚════════════════════════════════════════╝
  `);
});
