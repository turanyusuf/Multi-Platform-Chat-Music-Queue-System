const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const dbPath = config.db.path;
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT NOT NULL,
      requester_id TEXT NOT NULL,
      requester_name TEXT NOT NULL,
      query TEXT NOT NULL,
      title TEXT NOT NULL,
      source_url TEXT NOT NULL,
      local_path TEXT,
      duration_seconds INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'queued',
      created_at TEXT NOT NULL,
      started_at TEXT,
      ended_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      requester_name TEXT NOT NULL,
      platform TEXT NOT NULL,
      queue_id INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY(queue_id) REFERENCES queue(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      queue_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      requester_name TEXT NOT NULL,
      platform TEXT NOT NULL,
      source_url TEXT NOT NULL,
      created_at TEXT NOT NULL,
      played_at TEXT,
      FOREIGN KEY(queue_id) REFERENCES queue(id)
    )
  `);
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows || []);
    });
  });
}

module.exports = { db, run, get, all };
