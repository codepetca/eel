// Colyseus Schema - Defines the game state that automatically synchronizes between server and all clients
// The @type decorators tell Colyseus which properties to track and broadcast when they change

import { Schema, type, ArraySchema } from "@colyseus/schema";

// Player represents each connected client in the game
export class Player extends Schema {
  // @type decorators make these properties automatically sync to all clients when changed
  @type("string") id: string = "";        // Unique session ID from Colyseus
  @type("string") name: string = "";      // Display name for the player
  @type("string") symbol: string = "";    // 'X' or 'O' - assigned when joining
}

// TicTacToeState is the main game state - any changes here instantly broadcast to all connected clients
export class TicTacToeState extends Schema {
  // Array of players (max 2 for tic-tac-toe)
  @type([Player]) players = new ArraySchema<Player>();
  
  // Game board as array of 9 strings (empty string = empty cell, "X" or "O" = occupied)
  // Index mapping: [0,1,2] = top row, [3,4,5] = middle row, [6,7,8] = bottom row
  @type(["string"]) board = new ArraySchema<string>();
  
  // ID of the player whose turn it is
  @type("string") currentPlayer: string = "";
  
  // ID of winning player ("tie" for tie game, empty string = no winner yet)
  @type("string") winner: string = "";
  
  // Whether the current game has ended
  @type("boolean") gameOver: boolean = false;
  
  // Current game phase: "waiting" (for players), "playing" (active game), "finished" (game over)
  @type("string") status: string = "waiting";

  constructor() {
    super();
    // Initialize empty 3x3 tic-tac-toe board
    // Each cell starts as empty string and will contain "X" or "O" when played
    for (let i = 0; i < 9; i++) {
      this.board.push("");
    }
  }
}