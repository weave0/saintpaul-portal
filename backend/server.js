const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const connectDB = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (skip when under Jest or explicitly test env)
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Saint Paul API is running' });
});

// API routes
app.use('/api/locations', require('./routes/locations'));
app.use('/api/history', require('./routes/history'));
app.use('/api/building-specs', require('./routes/buildingSpecs'));
app.use('/api/reconstructions', require('./routes/reconstructions'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only when not under Jest test runner
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Saint Paul API server running on port ${PORT}`);
  });
}

module.exports = app;
