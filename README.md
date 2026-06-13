# Multi-Platform-Chat-Music-Queue-System

Bu repository, frontend'in GitHub Pages üzerinde yayınlanması için CI/CD ve deployment yapılandırmasını içerir.

## Live Demo

GitHub Pages aktif olduktan sonra canlı adres:

`https://turanyusuf.github.io/Multi-Platform-Chat-Music-Queue-System/`

## Frontend Deployment (GitHub Pages)

Frontend dosyaları `docs/` klasöründe tutulur ve GitHub Actions ile otomatik olarak `gh-pages` branch'ine deploy edilir.

### Local kontrol

```bash
npm ci
npm test
npm run build
```

Build adımı `.env.production` dosyasını okuyup `docs/config.js` üretir.

## Environment Variables

### `.env.local`

Geliştirme için:

- `API_BASE_URL=http://localhost:3000/api`
- `WS_BASE_URL=ws://localhost:3000`
- `BACKEND_URL=http://localhost:3000`

### `.env.production`

Production için backend URL'lerini buradan ayarlayın:

- `API_BASE_URL=https://your-backend-domain.example/api`
- `WS_BASE_URL=wss://your-backend-domain.example`
- `BACKEND_URL=https://your-backend-domain.example`

`WS_BASE_URL` boş bırakılırsa sistem `BACKEND_URL` üzerinden WebSocket fallback üretir (`https -> wss`, `http -> ws`).

## CI/CD Pipeline

Workflow: `.github/workflows/deploy.yml`

Pipeline adımları:

1. Node.js 20 kurulumu
2. `npm ci`
3. `npm test`
4. `npm run build`
5. `docs/` klasörünü `gh-pages` branch'ine deploy

## GitHub Pages Aktifleştirme

1. Repository > **Settings** > **Pages**
2. Source olarak **Deploy from a branch** seçin
3. Branch: `gh-pages`, Folder: `/ (root)`

## Backend Deployment ve CORS

Backend'i Railway, Render, Fly.io veya benzeri bir Node.js hostunda yayınlayabilirsiniz.

CORS için backend tarafında en az şu origin'i açın:

- `https://turanyusuf.github.io`

Örnek Express CORS ayarı:

```js
app.use(cors({
  origin: ['https://turanyusuf.github.io'],
  credentials: true
}));
```

> Copilot branch'inde yapılan değişiklikleri `main` branch'ine merge ettikten sonra `main` push'u workflow'u tetikler ve GitHub Pages deploy edilir.
