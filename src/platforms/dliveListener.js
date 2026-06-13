const BaseListener = require('./baseListener');

class DLiveListener extends BaseListener {
  constructor(config) {
    super('dlive');
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

module.exports = DLiveListener;
