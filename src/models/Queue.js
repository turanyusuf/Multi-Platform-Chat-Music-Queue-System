const { run, all, get } = require('./database');

async function insertQueueItem(item) {
  const result = await run(
    `INSERT INTO queue
      (platform, requester_id, requester_name, query, title, source_url, local_path, duration_seconds, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?)`,
    [
      item.platform,
      item.requesterId,
      item.requesterName,
      item.query,
      item.title,
      item.sourceUrl,
      item.localPath,
      item.durationSeconds,
      item.createdAt,
    ]
  );

  return get('SELECT * FROM queue WHERE id = ?', [result.id]);
}

async function getQueuedItems() {
  return all(
    `SELECT * FROM queue
     WHERE status = 'queued'
     ORDER BY id ASC`
  );
}

async function getCurrentlyPlaying() {
  return get(`SELECT * FROM queue WHERE status = 'playing' ORDER BY id DESC LIMIT 1`);
}

async function popNextQueued() {
  const next = await get(
    `SELECT * FROM queue
     WHERE status = 'queued'
     ORDER BY id ASC LIMIT 1`
  );

  if (!next) {
    return null;
  }

  await run(
    `UPDATE queue
     SET status = 'playing', started_at = ?
     WHERE id = ?`,
    [new Date().toISOString(), next.id]
  );

  return get('SELECT * FROM queue WHERE id = ?', [next.id]);
}

async function markPlayed(queueId) {
  await run(
    `UPDATE queue
     SET status = 'played', ended_at = ?
     WHERE id = ?`,
    [new Date().toISOString(), queueId]
  );
}

module.exports = {
  insertQueueItem,
  getQueuedItems,
  getCurrentlyPlaying,
  popNextQueued,
  markPlayed,
};
