const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

// Import the modular student routes
const studentRoutes = require('./routes/studentRoutes');

// Initialize the Express app
const app = express();

// Middleware
// Configure CORS to properly accept requests from Vite default ports (both localhost and 127.0.0.1)
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Apply CORS with specific options

app.use(express.json()); // Automatically parse JSON bodies attached to requests

// Register API Routes
// Any request starting with /api/students will be routed to studentRoutes
app.use('/api/students', studentRoutes);

// Environment setup
const PORT = process.env.PORT || 5001;
// Note: If you have a cluster, store the string in a .env file under MONGO_URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placementDB';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Database');

    // Once Database connects successfully, start the server listening on the assigned port
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
