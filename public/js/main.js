const socket = io();

const saveButton = document.getElementById('save-config');
const prefixInput = document.getElementById('prefix');
const bgInput = document.getElementById('background');

socket.on('config:update', (config) => {
  prefixInput.value = config.prefix;
  bgInput.value = config.backgroundImage;
  document.body.style.backgroundImage = `url('${config.backgroundImage}')`;
});

socket.on('player:update', (state) => {
  renderState(state);
});

async function fetchState() {
  const response = await fetch('/api/state');
  const data = await response.json();
  document.body.style.backgroundImage = `url('${data.config.backgroundImage}')`;
  prefixInput.value = data.config.prefix;
  bgInput.value = data.config.backgroundImage;
  renderState(data);
}

saveButton.addEventListener('click', async () => {
  const adminKey = prompt('Admin API key girin');
  if (!adminKey) return;

  const response = await fetch('/admin/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify({
      prefix: prefixInput.value,
      backgroundImage: bgInput.value,
    }),
  });

  if (response.ok) {
    await fetchState();
  } else {
    alert('Konfigürasyon kaydedilemedi.');
  }
});

fetchState().catch(() => {});
