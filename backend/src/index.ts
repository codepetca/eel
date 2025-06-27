// Colyseus Real-time Multiplayer Server Setup
// This file creates the WebSocket server that enables real-time communication between players

import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import { TicTacToeRoom } from "./TicTacToeRoom";

// Create Express app for serving static files (HTML/CSS/JS)
const app = express();
const server = createServer(app);

// Create Colyseus game server - this handles WebSocket connections
// and manages real-time state synchronization between clients
const gameServer = new Server({
  server: server,
});

// Register room handlers - this tells Colyseus what type of game room
// to create when clients request to join a "tic_tac_toe" room
// Each room instance manages one game session between 2 players
gameServer.define('tic_tac_toe', TicTacToeRoom);

// Serve static files from frontend directory
// This allows players to access the game interface
app.use(express.static('../frontend'));

// Start the server on port 2567 (Colyseus default)
// This port handles both HTTP requests (for static files) and WebSocket connections (for real-time game data)
const port = Number(process.env.PORT) || 2567;
gameServer.listen(port);
console.log(`Tic-tac-toe server listening on port ${port}`);