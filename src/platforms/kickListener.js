const axios = require('axios');
const Pusher = require('pusher-js');
const BaseListener = require('./baseListener');

class KickListener extends BaseListener {
  constructor(config) {
    super('kick');
    this.config = config;
    this.pusher = null;
    this.channel = null;
  }

  async resolveChatroomId() {
    const response = await axios.get(`https://kick.com/api/v2/channels/${this.config.channel}`);
    if (!response.data || !response.data.chatroom || !response.data.chatroom.id) {
      throw new Error('Kick chatroom bilgisi alınamadı.');
    }

    return response.data.chatroom.id;
  }

  async start() {
    if (!this.config.enabled || !this.config.channel) {
      return;
    }

    const chatroomId = await this.resolveChatroomId();
    this.pusher = new Pusher(this.config.pusherKey, {
      cluster: this.config.cluster,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
    });

    this.channel = this.pusher.subscribe(`chatrooms.${chatroomId}.v2`);
    this.channel.bind('App\\Events\\ChatMessageEvent', (event) => {
      const sender = event?.sender;
      const content = event?.content;
      if (!sender || !content) {
        return;
      }

      this.emitMessage({
        userId: `kick:${sender.id}`,
        username: sender.username,
        message: content,
      });
    });

    await super.start();
  }

  async stop() {
    if (this.channel && this.pusher) {
      this.pusher.unsubscribe(this.channel.name);
      this.pusher.disconnect();
      this.channel = null;
      this.pusher = null;
    }

    await super.stop();
  }
}

module.exports = KickListener;
