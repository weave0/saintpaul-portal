const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const pino = require('pino');
const pinoHttp = require('pino-http');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
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
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: 'GET,POST,PUT,DELETE,OPTIONS' }));
app.use(compression());
// Structured logging
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
app.use(pinoHttp({ logger }));
// Retain morgan for concise dev console output (optional)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.locals.logger = logger;

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
app.use('/api/metrics', require('./routes/metrics'));

// Swagger / OpenAPI docs
try {
  const openapiPath = path.join(__dirname, 'openapi.yaml');
  if (fs.existsSync(openapiPath)) {
    const doc = yaml.load(fs.readFileSync(openapiPath, 'utf8'));
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(doc));
  } else {
    logger.warn('OpenAPI spec not found at backend/openapi.yaml');
  }
} catch (e) {
  logger.error({ err: e }, 'Failed to load OpenAPI spec');
}

// Error handling
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only when not under Jest test runner
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Saint Paul API server running on port ${PORT}`);
  });
}

module.exports = app;
