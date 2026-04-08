require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Auth Route (Unprotected login and signup)
app.use('/api/auth', authRoutes);

// Optional: You could use authMiddleware to protect these routes, 
// but we'll apply it individually if needed in the routes files or just mount the middleware here.
app.use('/api/students', studentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Placement Dashboard API Backend Running with MongoDB!" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use. Attempting fallback to port 5001...`);
    app.listen(5001, () => {
       console.log(`Server is successfully running on port 5001`);
    });
  } else {
    console.error(err);
  }
});
