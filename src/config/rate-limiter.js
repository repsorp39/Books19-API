const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: 'You hit your threshold of requests. Try later',
});

module.exports = limiter;
