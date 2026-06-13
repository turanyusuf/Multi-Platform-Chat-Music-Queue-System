const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const createWebApp = require('./web/app');
const createApiRouter = require('./routes/api');
const createAdminRouter = require('./routes/admin');
const LimiterService = require('./services/limiterService');
const MusicService = require('./services/musicService');
const QueueService = require('./services/queueService');
const PlayerService = require('./services/playerService');
const KickListener = require('./platforms/kickListener');
const TwitchListener = require('./platforms/twitchListener');
const YoutubeListener = require('./platforms/youtubeListener');
const DLiveListener = require('./platforms/dliveListener');

const queueService = new QueueService();
const limiterService = new LimiterService();
const musicService = new MusicService();

const appState = {
  prefix: config.app.prefix,
  backgroundImage: config.app.backgroundImage,
  platforms: {
    kick: config.platforms.kick.enabled,
    twitch: config.platforms.twitch.enabled,
    youtube: config.platforms.youtube.enabled,
    dlive: config.platforms.dlive.enabled,
  },
};

const listeners = {
  kick: new KickListener(config.platforms.kick),
  twitch: new TwitchListener(config.platforms.twitch),
  youtube: new YoutubeListener(config.platforms.youtube),
  dlive: new DLiveListener(config.platforms.dlive),
};

const apiRouter = createApiRouter({ queueService, appState });
let playerService;
const adminRouter = createAdminRouter({
  appState,
  getPlayerService: () => playerService,
  listeners,
});

const app = createWebApp({ apiRouter, adminRouter });
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

playerService = new PlayerService({ queueService, io });

async function onChatMessage(payload) {
  const message = payload.message?.trim() || '';
  if (!message.startsWith(appState.prefix)) {
    return;
  }

  const query = message.slice(appState.prefix.length).trim();
  if (!query) {
    return;
  }

  const userId = payload.userId || `${payload.platform}:${payload.username}`;

  try {
    await limiterService.validateRequest({ userId, requesterName: payload.username });

    const track = await musicService.findAndDownloadTrack({
      platform: payload.platform,
      userId,
      username: payload.username,
      query,
    });

    const queued = await queueService.enqueue(track);
    await limiterService.recordAcceptedRequest({
      userId,
      requesterName: payload.username,
      platform: payload.platform,
      queueId: queued.id,
    });

    await playerService.refreshState();
    await playerService.triggerPlaybackIfIdle();
  } catch (error) {
    console.error(`[${payload.platform}] şarkı isteği işlenemedi:`, error.message);
  }
}

Object.values(listeners).forEach((listener) => {
  listener.on('chat:message', onChatMessage);
});

io.on('connection', async (socket) => {
  socket.emit('config:update', {
    prefix: appState.prefix,
    backgroundImage: appState.backgroundImage,
    platforms: appState.platforms,
  });
  await playerService.refreshState();
});

async function bootstrap() {
  for (const [platform, listener] of Object.entries(listeners)) {
    try {
      await listener.start();
      if (listener.started) {
        console.log(`${platform} listener başlatıldı.`);
      }
    } catch (error) {
      console.error(`${platform} listener başlatılamadı:`, error.message);
    }
  }

  server.listen(config.app.port, () => {
    console.log(`Server hazır: http://localhost:${config.app.port}`);
  });
}

bootstrap();
