const fallbackConfig = {
  API_BASE_URL: 'http://localhost:3000/api',
  WS_BASE_URL: 'ws://localhost:3000',
  BACKEND_URL: 'http://localhost:3000'
};

const config = {
  ...fallbackConfig,
  ...(window.__APP_CONFIG__ || {})
};

const statusElement = document.getElementById('status');
const endpointsElement = document.getElementById('endpoints');

function websocketFallback(primary) {
  if (primary) return primary;

  if (config.BACKEND_URL?.startsWith('https://')) {
    return config.BACKEND_URL.replace('https://', 'wss://');
  }

  if (config.BACKEND_URL?.startsWith('http://')) {
    return config.BACKEND_URL.replace('http://', 'ws://');
  }

  return fallbackConfig.WS_BASE_URL;
}

const wsBaseUrl = websocketFallback(config.WS_BASE_URL);

statusElement.textContent = 'Frontend production konfigürasyonu yüklendi.';
endpointsElement.textContent = `API: ${config.API_BASE_URL} | WebSocket: ${wsBaseUrl}`;
