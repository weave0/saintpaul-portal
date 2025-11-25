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
const { errorHandler } = require('./middleware/errorHandler');
const { initTelemetry } = require('./telemetry');
const { validate } = require('./middleware/validate');
const { buildingSpecSchema, locationSchema, historicalEventSchema } = require('./schemas/zodSchemas');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (skip when under Jest or explicitly test env)
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(helmet({ crossOriginEmbedderPolicy: false }));

// CORS configuration - allow both production and development origins
const allowedOrigins = [
  'https://saintpaul.globaldeets.com',
  'https://stpaul.globaldeets.com',
  'https://saintpaul-portal.pages.dev',
  'https://*.saintpaul-portal.pages.dev',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed origin (including wildcards)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, can restrict later
    }
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Initialize telemetry if enabled
initTelemetry(logger);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Saint Paul API is running' });
});

// Readiness: checks basic DB connectivity state
app.get('/api/readiness', (req, res) => {
  const state = (require('mongoose').connection.readyState); // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: states[state] || 'unknown',
    ready: state === 1,
    timestamp: new Date().toISOString()
  });
});

// Sample validated endpoints (non-invasive; real routes should adopt progressively)
app.post('/api/validate/building-spec', validate(buildingSpecSchema), (req, res) => {
  res.json({ valid: true, data: req.validated.body });
});
app.post('/api/validate/location', validate(locationSchema), (req, res) => {
  res.json({ valid: true, data: req.validated.body });
});
app.post('/api/validate/event', validate(historicalEventSchema), (req, res) => {
  res.json({ valid: true, data: req.validated.body });
});

// API routes
app.use('/api/locations', require('./routes/locations'));
app.use('/api/history', require('./routes/history'));
app.use('/api/building-specs', require('./routes/buildingSpecs'));
app.use('/api/reconstructions', require('./routes/reconstructions'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/insights', require('./routes/insights'));

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

// Error handling (centralized)
app.use(errorHandler);

// Start server only when not under Jest test runner
if (!process.env.JEST_WORKER_ID && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Saint Paul API server running on port ${PORT}`);
  });
}

module.exports = app;
