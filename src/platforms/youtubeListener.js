const BaseListener = require('./baseListener');

class YoutubeListener extends BaseListener {
  constructor(config) {
    super('youtube');
    this.config = config;
  }

  async start() {
    if (!this.config.enabled) {
      return;
    }

    await super.start();
  }

  injectMessage(payload) {
    this.emitMessage(payload);
  }
}

module.exports = YoutubeListener;
