/**
 * ProjectHub AI - Main Server Entry Point
 * Production-ready Express.js API server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database on startup
const { initializeDatabase } = require('./config/database');

// Import route modules
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const downloadRoutes = require('./routes/downloads');
const customRequestRoutes = require('./routes/custom_requests');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/uploads');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://projecthub-ai.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Initialize Database ───────────────────────────────────────────────────────
initializeDatabase();

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/contact', contactRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'ProjectHub AI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size too large. Max 50MB allowed.' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ProjectHub AI API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log(`📁 Uploads served at: /uploads\n`);
});

module.exports = app;
