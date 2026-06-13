const path = require('path');
const express = require('express');
const config = require('../config');

function createWebApp({ apiRouter, adminRouter }) {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRouter);
  app.use('/admin', adminRouter);

  app.use('/music', express.static(path.resolve(config.app.musicDir)));
  app.use(express.static(path.resolve(__dirname, '..', '..', 'public')));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Beklenmeyen bir hata oluştu.' });
  });

  return app;
}

module.exports = createWebApp;
