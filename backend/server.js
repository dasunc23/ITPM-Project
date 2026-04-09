// Import required packages
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import roomRoutes from './routes/roomRoutes.js';
import connectDB from './config/db.js';

// ✅ FIXED imports
import semesterRoutes from './routes/semesterRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

// Load environment variables
dotenv.config();

// Connect DB
connectDB();

// Init app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
//app.use('/api/rooms', roomRoutes);

// ============================================
// ROUTES
// ============================================
app.use('/api/rooms', roomRoutes);

app.use('/api/semesters', semesterRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/games', gameRoutes);

// ============================================
// TEST ROUTES
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Game API is running!',
    version: '1.0.0',
    status: 'active'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
