// Load all the packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// Load route files
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Load the .env file
const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Handle JSON input
app.use(xss()); // Stop malicious scripts
app.use(mongoSanitize()); // Sanitize MongoDB queries

// Prevent too many requests from same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Route for user login and register
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log('MongoDB Error:', err));
