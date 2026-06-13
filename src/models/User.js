const { get, all, run } = require('./database');

async function countRequestsInWindow(userId, fromISODate) {
  const row = await get(
    `SELECT COUNT(*) AS request_count
     FROM user_requests
     WHERE user_id = ? AND created_at >= ?`,
    [userId, fromISODate]
  );
  return row ? row.request_count : 0;
}

async function getLatestRequester() {
  const row = await get(
    `SELECT requester_id, requester_name
     FROM queue
     WHERE status IN ('queued', 'playing')
     ORDER BY id DESC LIMIT 1`
  );
  return row;
}

async function recordRequest({ userId, requesterName, platform, queueId, createdAt }) {
  return run(
    `INSERT INTO user_requests (user_id, requester_name, platform, queue_id, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, requesterName, platform, queueId, createdAt]
  );
}

async function getRecentRequests(limit = 50) {
  return all(
    `SELECT user_id, requester_name, platform, created_at
     FROM user_requests
     ORDER BY id DESC
     LIMIT ?`,
    [limit]
  );
}

module.exports = {
  countRequestsInWindow,
  getLatestRequester,
  recordRequest,
  getRecentRequests,
};
