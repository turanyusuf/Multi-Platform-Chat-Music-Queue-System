const express = require('express');
const adminAuth = require('../middleware/auth');

function createAdminRouter({ appState, getPlayerService, listeners }) {
  const router = express.Router();

  router.use(adminAuth);

  router.post('/config', async (req, res) => {
    const { prefix, backgroundImage, platforms } = req.body;

    if (typeof prefix === 'string' && prefix.trim()) {
      appState.prefix = prefix.trim();
    }

    if (typeof backgroundImage === 'string' && backgroundImage.trim()) {
      appState.backgroundImage = backgroundImage.trim();
    }

    if (platforms && typeof platforms === 'object') {
      Object.keys(appState.platforms).forEach((platform) => {
        if (typeof platforms[platform] === 'boolean') {
          appState.platforms[platform] = platforms[platform];
        }
      });
    }

    res.json({
      ok: true,
      config: {
        prefix: appState.prefix,
        backgroundImage: appState.backgroundImage,
        platforms: appState.platforms,
      },
    });
  });

  router.post('/skip', async (req, res, next) => {
    try {
      await getPlayerService().skipCurrent();
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  router.post('/inject/:platform', async (req, res) => {
    const platform = req.params.platform;
    const listener = listeners[platform];
    if (!listener || typeof listener.injectMessage !== 'function') {
      res.status(404).json({ error: 'Bu platform için inject desteklenmiyor.' });
      return;
    }

    listener.injectMessage({
      userId: req.body.userId,
      username: req.body.username,
      message: req.body.message,
    });

    res.json({ ok: true });
  });

  return router;
}

module.exports = createAdminRouter;
