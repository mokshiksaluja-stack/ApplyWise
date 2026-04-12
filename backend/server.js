require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
// Note: If any routes are missing, they should be created or commented out.
// For this merge, assuming the routes exist from Diksha's branch.
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const coordinatorRoutes = require('./routes/coordinatorRoutes');
const prepRoutes = require('./routes/prepRoutes');
const notificationRoutes   = require('./routes/notificationRoutes');
const analyticsRoutes      = require('./routes/analyticsRoutes');

const app = express();

// Middleware
// Allow all origins for seamless local development (Vite can run on 5174, 5175 etc)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
if(authRoutes) app.use('/api/auth', authRoutes);
if(studentRoutes) app.use('/api/students', studentRoutes);
if(jobRoutes) {
  app.use('/api/jobs', jobRoutes);
  app.use('/api/opportunities', jobRoutes);
}
if(applicationRoutes) app.use('/api/applications', applicationRoutes);
if(interviewRoutes) app.use('/api/interviews', interviewRoutes);
if(coordinatorRoutes) app.use('/api/coordinator', coordinatorRoutes);
if(notificationRoutes) app.use('/api/notifications', notificationRoutes);
if(analyticsRoutes)    app.use('/api/analytics',     analyticsRoutes);
if(prepRoutes) app.use('/api/prep', prepRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Placement Dashboard API Backend Running with MongoDB!" });
});

// Environment setup
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placementDB';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Database');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is successfully running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use. Attempting fallback to port 5002...`);
    app.listen(5002, () => {
       console.log(`Server is successfully running on port 5002`);
    });
  } else {
    console.error(err);
  }
});
