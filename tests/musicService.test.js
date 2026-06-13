const test = require('node:test');
const assert = require('node:assert/strict');

const MusicService = require('../src/services/musicService');

test('sanitizeFilename removes unsafe characters', () => {
  const value = MusicService.sanitizeFilename('a:b/c*d?e"f<g>h|i');
  assert.equal(value.includes(':'), false);
  assert.equal(value.includes('/'), false);
  assert.ok(value.length > 0);
});
