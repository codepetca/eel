// Colyseus Room - Manages one game session between players
// Handles player connections, game logic, and real-time state synchronization

import {Room, Client} from "colyseus";
import {TicTacToeState, Player} from "./TicTacToeState";

// TicTacToeRoom manages one game instance between 2 players
// Each room has its own isolated game state that syncs to connected clients
export class TicTacToeRoom extends Room<TicTacToeState> {
  maxClients = 2; // Limit to 2 players per tic-tac-toe game

  // Called when room is created - set up initial state and message handlers
  onCreate(options: any) {
    // Initialize game state - this will automatically sync to all clients
    this.state = new TicTacToeState();

    // Set up message handlers - clients can send these messages to trigger server actions
    // When handleMove runs and changes this.state, all clients automatically receive the update
    this.onMessage("make_move", (client, data) => {
      this.handleMove(client, data.position);
    });

    this.onMessage("restart_game", (client) => {
      this.restartGame();
    });
  }

  // Called when a client connects to this room
  // Any changes to this.state here will automatically broadcast to ALL connected clients
  onJoin(client: Client, options: any) {
    console.log(`${client.sessionId} joined!`);

    // Create new player object and add to game state
    const player = new Player();
    player.id = client.sessionId;  // Unique ID for this connection
    player.name = options.name || `Player ${this.state.players.length + 1}`;
    player.symbol = this.state.players.length === 0 ? "X" : "O";  // First player gets X

    // Adding to state.players automatically notifies all clients of the new player
    this.state.players.push(player);

    // Start game when 2 players have joined
    if (this.state.players.length === 2) {
      this.state.status = "playing";  // This change syncs to all clients immediately
      this.state.currentPlayer = this.state.players[0].id; // X goes first
    }

    // Send direct message to just this client (not broadcasted to others)
    client.send("welcome", {
      symbol: player.symbol,
      playerId: player.id,
    });
  }

  // Called when a client disconnects from this room
  // All state changes here automatically sync to remaining clients
  onLeave(client: Client, consented: boolean) {
    console.log(`${client.sessionId} left!`);

    // Remove the disconnected player from game state
    const playerIndex = this.state.players.findIndex(
      (p) => p.id === client.sessionId
    );
    if (playerIndex !== -1) {
      this.state.players.splice(playerIndex, 1);  // This removal syncs to remaining clients
    }

    // Reset game state if we don't have enough players to continue
    if (this.state.players.length < 2) {
      this.state.status = "waiting";    // All these changes automatically
      this.state.gameOver = false;      // broadcast to remaining client
      this.state.winner = "";
      this.state.currentPlayer = "";
      // Clear board
      for (let i = 0; i < 9; i++) {
        this.state.board[i] = "";
      }
    }
  }

  // Handle move messages from clients - this is where the real-time magic happens!
  // Every state change here automatically broadcasts to ALL connected clients
  handleMove(client: Client, position: number) {
    // Validate move before making any state changes
    if (this.state.status !== "playing") return;              // Game not active
    if (this.state.gameOver) return;                          // Game already ended
    if (this.state.currentPlayer !== client.sessionId) return; // Not this player's turn
    if (position < 0 || position >= 9) return;               // Invalid board position
    if (this.state.board[position] !== "") return;            // Cell already occupied

    // Find the player making the move
    const currentPlayer = this.state.players.find(
      (p) => p.id === client.sessionId
    );
    if (!currentPlayer) return;

    // Make the move - this change instantly broadcasts to all clients!
    this.state.board[position] = currentPlayer.symbol;

    // Check game ending conditions and update state (all changes auto-sync)
    if (this.checkWinner()) {
      this.state.winner = client.sessionId;  // Set winner
      this.state.gameOver = true;
      this.state.status = "finished";
    } else if (this.isBoardFull()) {
      this.state.gameOver = true;            // Tie game
      this.state.status = "finished";
      this.state.winner = "tie";
    } else {
      // Switch to next player - this updates whose turn it is for all clients
      const nextPlayerIndex =
        this.state.players.findIndex((p) => p.id === client.sessionId) === 0
          ? 1
          : 0;
      this.state.currentPlayer = this.state.players[nextPlayerIndex].id;
    }
  }

  // Check if current board state has a winner
  // This is pure game logic - doesn't change state, just reads it
  checkWinner(): boolean {
    const board = this.state.board;
    // All possible winning combinations in tic-tac-toe
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    // Check each winning pattern
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  }

  // Check if board is completely filled (for tie detection)
  isBoardFull(): boolean {
    return this.state.board.every((cell) => cell !== "");
  }

  // Reset game state for a new round - all changes auto-sync to clients
  restartGame() {
    if (this.state.players.length === 2) {
      // Clear the board - each change to state.board[i] syncs to all clients
      for (let i = 0; i < 9; i++) {
        this.state.board[i] = "";
      }
      this.state.gameOver = false;
      this.state.winner = "";
      this.state.status = "playing";
      this.state.currentPlayer = this.state.players[0].id; // X goes first
    }
  }

  // Called when room is destroyed (no more clients)
  onDispose() {
    console.log("Room disposed");
  }
}
