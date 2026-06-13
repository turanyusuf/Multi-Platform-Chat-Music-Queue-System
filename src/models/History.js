const { run, all } = require('./database');

async function addHistory(item) {
  await run(
    `INSERT INTO history
      (queue_id, title, requester_name, platform, source_url, created_at, played_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      item.queueId,
      item.title,
      item.requesterName,
      item.platform,
      item.sourceUrl,
      item.createdAt,
      item.playedAt,
    ]
  );
}

async function getHistory(limit = 25) {
  return all(
    `SELECT * FROM history ORDER BY id DESC LIMIT ?`,
    [limit]
  );
}

module.exports = {
  addHistory,
  getHistory,
};
