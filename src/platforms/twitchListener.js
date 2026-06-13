const tmi = require('tmi.js');
const BaseListener = require('./baseListener');

class TwitchListener extends BaseListener {
  constructor(config) {
    super('twitch');
    this.config = config;
    this.client = null;
  }

  async start() {
    if (!this.config.enabled || !this.config.channels.length) {
      return;
    }

    this.client = new tmi.Client({
      identity: {
        username: this.config.username,
        password: this.config.oauthToken,
      },
      channels: this.config.channels,
      connection: {
        reconnect: true,
        secure: true,
      },
    });

    this.client.on('message', (channel, tags, message, self) => {
      if (self) {
        return;
      }

      this.emitMessage({
        userId: `twitch:${tags['user-id'] || tags.username}`,
        username: tags['display-name'] || tags.username,
        message,
      });
    });

    await this.client.connect();
    await super.start();
  }

  async stop() {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }

    await super.stop();
  }
}

module.exports = TwitchListener;
