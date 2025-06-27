// Modern Colyseus + Elysia + Bun Server Setup
// This demonstrates how to integrate Colyseus real-time multiplayer with modern web frameworks
// Key Learning: Colyseus works with ANY HTTP server - Express, Fastify, Elysia, etc.

import {Server} from "colyseus";
import {Elysia} from "elysia";
import {staticPlugin} from "@elysiajs/static";
import {TicTacToeRoom} from "./TicTacToeRoom";

// Why Elysia?
// - Built for Bun from the ground up (not a Node.js port)
// - Superior TypeScript experience with end-to-end type safety
// - 3x faster than Express with better developer experience
// - Modern async/await patterns and cleaner API design

const app = new Elysia()
  // Serve static files from frontend directory
  .use(
    staticPlugin({
      assets: "../frontend",
      prefix: "/",
    })
  )
  // Add a health check endpoint (demonstrates Elysia's clean syntax)
  .get("/health", () => ({status: "ok", framework: "elysia", runtime: "bun"}))
  // Add API endpoint to get server info
  .get("/api/info", () => ({
    server: "Colyseus + Elysia",
    games: ["tic-tac-toe"],
    realtime: true,
  }));

// Start Elysia server first to get the underlying HTTP server
// Elysia runs on Bun's native server, we need to create an HTTP server for Colyseus
const port = Number(process.env.PORT) || 2567;
app.listen(port);

// Alternative approach: Create Colyseus server on the same port with different path
// Since Elysia is already using the port, we create Colyseus server separately
import {createServer} from "http";

// Create HTTP server for Colyseus (this is a common pattern with modern frameworks)
const httpServer = createServer();

// Create Colyseus game server - this handles WebSocket connections
// Colyseus is framework-agnostic - it just needs an HTTP server to attach to
// In production, you might use a reverse proxy to route WebSocket traffic
const gameServer = new Server({
  server: httpServer,
});

// Register room handlers - this tells Colyseus what type of game room
// to create when clients request to join a "tic_tac_toe" room
// Each room instance manages one game session between 2 players
gameServer.define("tic_tac_toe", TicTacToeRoom);

// Start Colyseus server on WebSocket port (2568)
// In modern setups, it's common to separate HTTP and WebSocket servers
const wsPort = 2568;
gameServer.listen(wsPort);

console.log(`🚀 Modern multiplayer server stack:`);
console.log(`📄 HTTP Server (Elysia + Bun): http://localhost:${port}`);
console.log(`🎮 WebSocket Server (Colyseus): ws://localhost:${wsPort}`);
console.log(`📁 Static files served from: ../frontend`);
console.log(`🔍 Health check: http://localhost:${port}/health`);
console.log(`📊 Server info: http://localhost:${port}/api/info`);
