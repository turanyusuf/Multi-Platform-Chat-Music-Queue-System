const User = require('../models/User');
const config = require('../config');

class LimiterService {
  constructor({ maxPer12Hours = config.music.maxPer12Hours } = {}) {
    this.maxPer12Hours = maxPer12Hours;
  }

  async validateRequest({ userId, requesterName }) {
    const latestRequester = await User.getLatestRequester();
    if (latestRequester && latestRequester.requester_id === userId) {
      throw new Error('Aynı kullanıcı art arda şarkı ekleyemez.');
    }

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const count = await User.countRequestsInWindow(userId, twelveHoursAgo);
    if (count >= this.maxPer12Hours) {
      throw new Error('Bu kullanıcı 12 saat içinde maksimum şarkı limitine ulaştı.');
    }

    return { userId, requesterName, countInWindow: count };
  }

  async recordAcceptedRequest({ userId, requesterName, platform, queueId }) {
    await User.recordRequest({
      userId,
      requesterName,
      platform,
      queueId,
      createdAt: new Date().toISOString(),
    });
  }
}

module.exports = LimiterService;
