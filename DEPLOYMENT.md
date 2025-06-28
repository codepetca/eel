# 🚀 Deployment Guide

Deploy your multiplayer game: **Frontend** to Netlify (free), **Backend** to Fly.io ($5-10/month).

## Backend: Deploy to Fly.io

### 1. Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### 2. Deploy
```bash
cd backend/
fly launch --name your-game-backend
fly deploy
```

Your backend: `https://your-game-backend.fly.dev`

## Frontend: Deploy to Netlify

### 1. Update WebSocket URL
Edit `frontend/game.js`:
```javascript
this.client = new Colyseus.Client('wss://your-game-backend.fly.dev');
```

### 2. Deploy to Netlify
**Option A**: Drag `frontend/` folder to [netlify.com](https://netlify.com)

**Option B**: Connect GitHub repo, set base directory to `frontend`

## Environment Variables (Optional)

```bash
fly secrets set CORS_ORIGIN=https://your-game.netlify.app
```

## Test Your Deployment

1. Visit your Netlify URL
2. Open in 2 browser tabs
3. Play multiplayer tic-tac-toe!

## Troubleshooting

**Can't connect to game?**
```bash
fly logs
curl https://your-game-backend.fly.dev/health
```

**Updates:**
- Backend: `fly deploy`
- Frontend: Push to GitHub (auto-deploys)

---
*Need help? Ask in WhatsApp group or create GitHub issue.*