class PlayerService {
  constructor({ queueService, io }) {
    this.queueService = queueService;
    this.io = io;
    this.currentTrack = null;
    this.playbackTimer = null;
  }

  async refreshState() {
    const [nowPlaying, queue] = await Promise.all([
      this.queueService.getCurrentTrack(),
      this.queueService.getQueue(),
    ]);

    this.io.emit('player:update', {
      nowPlaying,
      queue,
    });
  }

  async triggerPlaybackIfIdle() {
    if (this.currentTrack || this.playbackTimer) {
      return;
    }

    await this.playNext();
  }

  async playNext() {
    const track = await this.queueService.startNextTrack();

    if (!track) {
      this.currentTrack = null;
      this.playbackTimer = null;
      await this.refreshState();
      return;
    }

    this.currentTrack = track;
    await this.refreshState();

    const durationMs = Math.max((track.duration_seconds || 180) * 1000, 15_000);
    this.playbackTimer = setTimeout(async () => {
      const finishedTrack = this.currentTrack;
      this.currentTrack = null;
      this.playbackTimer = null;

      if (finishedTrack) {
        await this.queueService.completeTrack(finishedTrack);
      }

      await this.playNext();
    }, durationMs);
  }

  async skipCurrent() {
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }

    if (this.currentTrack) {
      await this.queueService.completeTrack(this.currentTrack);
      this.currentTrack = null;
    }

    await this.playNext();
  }
}

module.exports = PlayerService;
