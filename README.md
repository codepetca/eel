# Eel - Multiplayer Games

Real-time multiplayer games built with Colyseus WebSocket technology.

## Structure

```
eel/
├── backend/          # Colyseus server (Bun + Elysia)
│   ├── src/
│   │   ├── server.ts          # Modern server setup
│   │   ├── TicTacToeRoom.ts   # Game room logic
│   │   └── TicTacToeState.ts  # Game state schema
│   └── package.json
├── frontend/         # Client-side game interface
│   ├── index.html
│   └── game.js
└── package.json      # Monorepo configuration
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js

### Installation
```bash
# Install dependencies for all workspaces
bun install

# Or install backend dependencies only
cd backend && bun install
```

### Development
```bash
# Start backend server (from root)
bun dev

# Or start from backend directory
cd backend && bun dev
```

### Playing the Game
1. Start the server
2. Open http://localhost:2567 in two browser tabs
3. Enter your names and play tic-tac-toe in real-time!

## 🌐 Deployment

Ready to share your game with the world? See **[DEPLOYMENT.md](DEPLOYMENT.md)** for production setup on Railway + Netlify.

## 🤝 Contributing (Simple & Fun!)

### 🚀 First Time Setup (One Command)
```bash
git clone https://github.com/codepetca/eel.git
cd eel
bun install && bun dev
```
**That's it!** Your server is running. Open http://localhost:2567 and start playing.

### 💻 Daily Development Flow (2 Minutes)
```bash
# Start your day
git pull origin main
bun dev  # Hot reload for instant feedback

# Make changes, then:
bun run type-check  # Quick validation
git add . && git commit -m "Add awesome feature"
git push origin main  # Share with team
```

### 🎮 Keep It Fun
- **Work on `main` branch** - No complex workflows
- **Commit often** - Small changes, less conflicts  
- **Fix broken code immediately** - Don't let it linger
- **Pair program** - Share screen, code together

### 🛠 When Things Break (Simple Recovery)
```bash
# Nuclear option (copies your work first!)
cp -r src/ ../backup/
git reset --hard origin/main
bun install
# Copy your work back and continue
```

### 🎯 Project Structure (Easy Navigation)
- **`backend/src/`** - All server code (Colyseus + Elysia)
- **`frontend/`** - Game UI (HTML + JavaScript)  
- **Educational comments everywhere** - Learn as you code!

### 📊 Health Checks
```bash
curl http://localhost:2567/health     # Server status
curl http://localhost:2567/api/info   # Game info
```

## How It Works

This project demonstrates modern real-time multiplayer architecture:

- **Server**: Colyseus + Elysia + Bun (fast, modern, type-safe)
- **Client**: Connects via WebSocket, receives real-time updates
- **State Management**: Schema-based automatic synchronization
- **Development**: Hot reload, TypeScript, educational comments

## Games Available
- **Tic-Tac-Toe**: Classic 3x3 grid game for 2 players

## Tech Stack
- **Backend**: Colyseus, Elysia, TypeScript, Bun
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real-time**: WebSocket communication
- **Developer Experience**: Hot reload, type checking, minimal config