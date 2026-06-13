const EventEmitter = require('events');

class BaseListener extends EventEmitter {
  constructor(platform) {
    super();
    this.platform = platform;
    this.started = false;
  }

  emitMessage({ userId, username, message }) {
    this.emit('chat:message', {
      platform: this.platform,
      userId,
      username,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  async start() {
    this.started = true;
  }

  async stop() {
    this.started = false;
  }
}

module.exports = BaseListener;
