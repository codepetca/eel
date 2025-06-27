# Eel - Multiplayer Games

Real-time multiplayer games built with Colyseus WebSocket technology.

## Structure

```
eel/
├── backend/          # Colyseus server (Bun + Express)
│   ├── src/
│   │   ├── index.ts           # Server setup
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

## How It Works

This project demonstrates Colyseus real-time multiplayer architecture:

- **Server**: Manages game rooms, validates moves, syncs state
- **Client**: Connects via WebSocket, receives real-time updates
- **State Management**: Schema-based automatic synchronization

## Games Available
- **Tic-Tac-Toe**: Classic 3x3 grid game for 2 players

## Tech Stack
- **Backend**: Colyseus, Express, TypeScript, Bun
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real-time**: WebSocket communication