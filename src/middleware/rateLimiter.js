function createRateLimiter({ windowMs = 60_000, max = 30 } = {}) {
  const hits = new Map();

  return function rateLimiter(req, res, next) {
    const key = req.ip || 'unknown';
    const now = Date.now();

    const previous = hits.get(key) || [];
    const valid = previous.filter((timestamp) => now - timestamp < windowMs);
    valid.push(now);
    hits.set(key, valid);

    if (valid.length > max) {
      res.status(429).json({ error: 'Çok fazla istek gönderildi, lütfen tekrar deneyin.' });
      return;
    }

    next();
  };
}

module.exports = createRateLimiter;
