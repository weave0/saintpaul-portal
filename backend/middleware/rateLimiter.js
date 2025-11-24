const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware configurations
 * Protects endpoints from abuse and accidental overload
 */

// General API rate limiter - 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for write operations - 20 requests per 15 minutes
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many write requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for compute-intensive operations (diff, auto-generate)
const heavyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Rate limit exceeded for compute-intensive operations.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  writeLimiter,
  heavyLimiter
};
