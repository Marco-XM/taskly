const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// CORS Configuration
app.use(cors({
  origin: 'https://taskly-ozmg.vercel.app', // Replace with your frontend domain
  credentials: true // If you are using cookies or authentication headers
}));

// Database Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(express.json()); // To parse incoming JSON requests

// Routes
app.use('/api', authRoutes);
// app.post('/login', loginUser);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
