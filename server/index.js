const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Hardcoded Frontend URL
const FRONTEND_URL = 'https://taskly-ozmg.vercel.app/';  // Replace with your actual frontend URL

// Database Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Database Connected'))
.catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // Allow cookies
}));
app.use(express.json()); // To parse incoming JSON requests

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
