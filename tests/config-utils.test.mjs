import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEnv, resolveRuntimeConfig, toWebSocketUrl } from '../scripts/config-utils.mjs';

test('parseEnv parses simple key-value pairs', () => {
  const env = parseEnv('API_BASE_URL=https://api.example.com\n#comment\nBACKEND_URL=https://backend.example.com');
  assert.equal(env.API_BASE_URL, 'https://api.example.com');
  assert.equal(env.BACKEND_URL, 'https://backend.example.com');
});

test('toWebSocketUrl converts http/https to ws/wss', () => {
  assert.equal(toWebSocketUrl('https://example.com'), 'wss://example.com');
  assert.equal(toWebSocketUrl('http://example.com'), 'ws://example.com');
  assert.equal(toWebSocketUrl('wss://example.com'), 'wss://example.com');
});

test('resolveRuntimeConfig prefers explicit websocket and falls back to backend', () => {
  const explicit = resolveRuntimeConfig({
    API_BASE_URL: 'https://api.example.com',
    WS_BASE_URL: 'wss://socket.example.com',
    BACKEND_URL: 'https://backend.example.com'
  });
  assert.equal(explicit.WS_BASE_URL, 'wss://socket.example.com');

  const fallback = resolveRuntimeConfig({ BACKEND_URL: 'https://backend.example.com' });
  assert.equal(fallback.API_BASE_URL, 'https://backend.example.com/api');
  assert.equal(fallback.WS_BASE_URL, 'wss://backend.example.com');
});
