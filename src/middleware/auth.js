const config = require('../config');

function adminAuth(req, res, next) {
  if (!config.app.adminApiKey) {
    res.status(503).json({ error: 'Admin API key tanımlanmadı.' });
    return;
  }

  const provided = req.header('x-admin-key');
  if (!provided || provided !== config.app.adminApiKey) {
    res.status(401).json({ error: 'Yetkisiz işlem.' });
    return;
  }

  next();
}

module.exports = adminAuth;
