const Queue = require('../models/Queue');
const History = require('../models/History');

class QueueService {
  async enqueue(track) {
    return Queue.insertQueueItem(track);
  }

  async getQueue() {
    return Queue.getQueuedItems();
  }

  async getCurrentTrack() {
    return Queue.getCurrentlyPlaying();
  }

  async startNextTrack() {
    return Queue.popNextQueued();
  }

  async completeTrack(track) {
    await Queue.markPlayed(track.id);
    await History.addHistory({
      queueId: track.id,
      title: track.title,
      requesterName: track.requester_name,
      platform: track.platform,
      sourceUrl: track.source_url,
      createdAt: track.created_at,
      playedAt: new Date().toISOString(),
    });
  }
}

module.exports = QueueService;
