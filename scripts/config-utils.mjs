export function parseEnv(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const index = line.indexOf('=');
      if (index === -1) return acc;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      acc[key] = value;
      return acc;
    }, {});
}

export function toWebSocketUrl(url) {
  if (!url) return '';
  if (url.startsWith('ws://') || url.startsWith('wss://')) return url;
  if (url.startsWith('https://')) return `wss://${url.slice('https://'.length)}`;
  if (url.startsWith('http://')) return `ws://${url.slice('http://'.length)}`;
  return '';
}

export function resolveRuntimeConfig(env) {
  const backendUrl = env.BACKEND_URL || env.API_BASE_URL || '';
  const apiBaseUrl = env.API_BASE_URL || (backendUrl ? `${backendUrl.replace(/\/$/, '')}/api` : '');
  const wsBaseUrl = env.WS_BASE_URL || toWebSocketUrl(backendUrl) || toWebSocketUrl(apiBaseUrl.replace(/\/api\/?$/, ''));

  return {
    API_BASE_URL: apiBaseUrl,
    WS_BASE_URL: wsBaseUrl,
    BACKEND_URL: backendUrl
  };
}
