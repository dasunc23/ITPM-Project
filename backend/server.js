// Import required packages
import express from 'express';
import semesterRoutes from './routes/semesterRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import roomRoutes from './routes/roomRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import connectDB from './config/db.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();


// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS - allows frontend to communicate with backend
// This permits requests from different origins (e.g., React dev server on port 3000)
app.use(cors());

// Parse JSON request bodies
// This allows us to access req.body in our routes
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ============================================
app.use('/api/rooms', roomRoutes);
// ============================================
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
//app.use('/api/rooms', roomRoutes);

// Root endpoint - test if API is running
app.get('/', (req, res) => {
  res.json({
    message: 'Moovie API is running!',
    version: '1.0.0',
    status: 'active'
  });
});

// Health check endpoint - useful for monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// API ROUTES (added feature routes)
// ============================================

app.use('/api/semesters', semesterRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - catches requests to undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler - catches all errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    // Only show error stack in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

// Get port from environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start server after connecting to database
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start listening for requests
    const server = app.listen(PORT, () => {
      console.log(`💻 Server is ready at http://localhost:${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
