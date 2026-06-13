const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const rootDir = path.resolve(__dirname, '..');

const config = {
  app: {
    port: Number(process.env.PORT || 3000),
    adminApiKey: process.env.ADMIN_API_KEY || '',
    prefix: process.env.COMMAND_PREFIX || '.mç',
    backgroundImage: process.env.BACKGROUND_IMAGE || '/assets/backgrounds/default.jpg',
    musicDir: process.env.MUSIC_DIR || path.join(rootDir, 'music'),
  },
  platforms: {
    kick: {
      enabled: process.env.KICK_ENABLED !== 'false',
      channel: process.env.KICK_CHANNEL || '',
      pusherKey: process.env.KICK_PUSHER_KEY || '32cbd69e4b950bf97679',
      cluster: process.env.KICK_PUSHER_CLUSTER || 'us2',
    },
    twitch: {
      enabled: process.env.TWITCH_ENABLED === 'true',
      username: process.env.TWITCH_BOT_USERNAME || '',
      oauthToken: process.env.TWITCH_OAUTH_TOKEN || '',
      channels: (process.env.TWITCH_CHANNELS || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    },
    youtube: {
      enabled: process.env.YOUTUBE_ENABLED === 'true',
      webhookSecret: process.env.YOUTUBE_WEBHOOK_SECRET || '',
    },
    dlive: {
      enabled: process.env.DLIVE_ENABLED === 'true',
      webhookSecret: process.env.DLIVE_WEBHOOK_SECRET || '',
    },
  },
  music: {
    maxPer12Hours: Number(process.env.MAX_TRACKS_PER_12H || 3),
    ytDlpPath: process.env.YTDLP_BINARY || 'yt-dlp',
  },
  db: {
    path: process.env.DATABASE_PATH || path.join(rootDir, 'data.sqlite'),
  },
};

module.exports = config;
