const fs = require('fs');
const path = require('path');
const YTDlpWrap = require('yt-dlp-wrap').default;
const config = require('../config');

class MusicService {
  constructor() {
    this.ytDlp = new YTDlpWrap(config.music.ytDlpPath);
    fs.mkdirSync(config.app.musicDir, { recursive: true });
  }

  static sanitizeFilename(input) {
    return input.replace(/[^a-z0-9\-_\. ]/gi, '').slice(0, 120).trim() || 'track';
  }

  async searchYoutube(query) {
    let output;
    try {
      output = await this.ytDlp.execPromise([
        `ytsearch1:${query}`,
        '--dump-single-json',
        '--no-playlist',
      ]);
    } catch (error) {
      throw new Error(`YouTube araması başarısız: ${error.message}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (error) {
      throw new Error('YouTube arama çıktısı işlenemedi.');
    }

    const entry = parsed.entries && parsed.entries[0] ? parsed.entries[0] : parsed;
    if (!entry || !entry.webpage_url || !entry.title) {
      throw new Error('YouTube üzerinde uygun şarkı bulunamadı.');
    }

    return {
      title: entry.title,
      url: entry.webpage_url,
      durationSeconds: Number(entry.duration || 0),
    };
  }

  async downloadAsMp3(video, requestContext) {
    const baseName = `${Date.now()}-${MusicService.sanitizeFilename(video.title)}`;
    const outputTemplate = path.join(config.app.musicDir, `${baseName}.%(ext)s`);

    const args = [
      video.url,
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--no-playlist',
      '-o',
      outputTemplate,
    ];

    try {
      await this.ytDlp.execPromise(args);
    } catch (error) {
      throw new Error(`Şarkı indirilemedi: ${error.message}`);
    }

    const finalPath = path.join(config.app.musicDir, `${baseName}.mp3`);
    if (!fs.existsSync(finalPath)) {
      throw new Error('Şarkı indirildi ancak mp3 dosyası bulunamadı.');
    }

    return {
      platform: requestContext.platform,
      requesterId: requestContext.userId,
      requesterName: requestContext.username,
      query: requestContext.query,
      title: video.title,
      sourceUrl: video.url,
      localPath: finalPath,
      durationSeconds: video.durationSeconds,
      createdAt: new Date().toISOString(),
    };
  }

  async findAndDownloadTrack(requestContext) {
    const video = await this.searchYoutube(requestContext.query);
    return this.downloadAsMp3(video, requestContext);
  }
}

module.exports = MusicService;
