window.renderState = function renderState(state) {
  const nowTitle = document.getElementById('now-title');
  const nowRequester = document.getElementById('now-requester');
  const queueList = document.getElementById('queue-list');

  const now = state.nowPlaying;
  if (now) {
    nowTitle.textContent = now.title;
    nowRequester.textContent = `${now.requester_name} (${now.platform})`;
  } else {
    nowTitle.textContent = 'Şu an bir şarkı çalmıyor';
    nowRequester.textContent = '';
  }

  queueList.innerHTML = '';
  state.queue.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.title} — ${item.requester_name}`;
    queueList.appendChild(li);
  });
};
