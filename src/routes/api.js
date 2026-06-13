const express = require('express');
const createRateLimiter = require('../middleware/rateLimiter');
const History = require('../models/History');

function createApiRouter({ queueService, appState }) {
  const router = express.Router();

  router.use(createRateLimiter());

  router.get('/health', (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  router.get('/state', async (req, res, next) => {
    try {
      const [nowPlaying, queue, history] = await Promise.all([
        queueService.getCurrentTrack(),
        queueService.getQueue(),
        History.getHistory(),
      ]);

      res.json({
        nowPlaying,
        queue,
        history,
        config: {
          prefix: appState.prefix,
          backgroundImage: appState.backgroundImage,
          platforms: appState.platforms,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createApiRouter;
