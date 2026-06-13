# Multi-Platform Chat Music Queue System

Profesyonel, Kick öncelikli ve YouTube/Twitch/DLive destekli bir chat tabanlı müzik istek sistemi.

## Özellikler

- 7/24 chat listener altyapısı (Kick öncelikli)
- Prefix ile şarkı ekleme (`.mç şarkı adı`)
- YouTube arama + `yt-dlp` ile MP3 indirme
- Otomatik queue ve playback yönetimi
- Kullanıcı sınırları:
  - Art arda aynı kullanıcı şarkı ekleyemez
  - 12 saatte en fazla 3 şarkı
- Socket.IO ile real-time web arayüzü
- SQLite ile queue/history/user request takibi
- Admin panelinden prefix ve arkaplan ayarı

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasını doldurun (özellikle `KICK_CHANNEL` ve `ADMIN_API_KEY`).

## Çalıştırma

```bash
npm run dev
# veya
npm start
```

Uygulama: `http://localhost:3000`

## Mimari

```text
src/
├── index.js
├── config.js
├── platforms/
├── services/
├── middleware/
├── routes/
├── models/
└── web/
public/
music/
```

## API

- `GET /api/health` - sağlık kontrolü
- `GET /api/state` - anlık oynatma, queue ve config
- `POST /admin/config` - admin config güncelleme (`x-admin-key` gerekli)
- `POST /admin/skip` - çalan şarkıyı geç
- `POST /admin/inject/:platform` - webhook/inject mesajı (YouTube/DLive için)

## Notlar

- MP3 indirme için sistemde `yt-dlp` ve `ffmpeg` kurulu olmalıdır.
- Kick listener, chatroom verisini Kick API üzerinden çözümler ve Pusher kanalıyla dinler.
