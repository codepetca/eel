// Client-side Colyseus integration for real-time tic-tac-toe
// This connects to the server via WebSocket and handles real-time game state updates

class TicTacToeClient {
    constructor() {
        // Create Colyseus client - connects to the WebSocket server
        // Note: Using separate port (2568) for WebSocket in modern server setup
        // this.client = new Colyseus.Client('ws://localhost:2568');
        this.client = new Colyseus.Client('wss://eel-ttt.fly.dev');
        this.room = null;           // Will hold the joined room instance
        this.playerId = null;       // Our unique player ID
        this.playerSymbol = null;   // 'X' or 'O' 
        this.gameState = null;      // Current game state (auto-synced from server)

        this.initializeUI();
        this.connectToRoom();
    }

    // Set up the game board UI
    initializeUI() {
        // Create 9 clickable cells for the tic-tac-toe board
        const gameBoard = document.getElementById('gameBoard');
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.position = i;
            // When clicked, send move to server via WebSocket
            cell.addEventListener('click', () => this.makeMove(i));
            gameBoard.appendChild(cell);
        }
    }

    // Connect to the Colyseus server and join a tic-tac-toe room
    async connectToRoom() {
        try {
            this.updateConnectionStatus('Connecting...', 'disconnected');

            const playerName = prompt('Enter your name:') || `Player${Math.floor(Math.random() * 1000)}`;

            // Join or create a 'tic_tac_toe' room - Colyseus will match us with another player
            // or create a new room if none available
            this.room = await this.client.joinOrCreate('tic_tac_toe', { name: playerName });

            this.updateConnectionStatus('Connected', 'connected');
            this.setupRoomListeners();

        } catch (error) {
            console.error('Failed to connect:', error);
            this.updateConnectionStatus('Connection Failed', 'disconnected');
            // Retry connection after 3 seconds
            setTimeout(() => this.connectToRoom(), 3000);
        }
    }

    // Set up listeners for real-time communication with the server
    setupRoomListeners() {
        // Handle welcome message (sent only to this client when joining)
        this.room.onMessage('welcome', (data) => {
            this.playerId = data.playerId;
            this.playerSymbol = data.symbol;  // 'X' or 'O'
            this.updatePlayerInfo();
        });

        // THIS IS THE CORE OF REAL-TIME SYNC!
        // onStateChange fires whenever the server's game state changes
        // This includes: moves, player joins/leaves, game start/end, turn changes
        this.room.onStateChange((state) => {
            this.gameState = state;  // Store the latest game state
            this.updateUI();         // Update the visual game board
        });

        // Handle disconnection from room
        this.room.onLeave((code) => {
            console.log('Left room with code:', code);
            this.updateConnectionStatus('Disconnected', 'disconnected');
        });

        // Handle connection errors
        this.room.onError((code, message) => {
            console.error('Room error:', code, message);
            this.updateConnectionStatus('Error', 'disconnected');
        });
    }

    updateConnectionStatus(text, className) {
        const status = document.getElementById('connectionStatus');
        status.textContent = text;
        status.className = `connection-status ${className}`;
    }

    updatePlayerInfo() {
        const playerInfo = document.getElementById('playerInfo');
        playerInfo.innerHTML = `You are playing as: <strong>${this.playerSymbol}</strong>`;
    }

    // Update all UI elements based on the current game state
    // This is called automatically whenever the server sends state changes
    updateUI() {
        if (!this.gameState) return;

        this.updateBoard();         // Refresh the game board with latest moves
        this.updateGameStatus();    // Update whose turn it is / game over status
        this.updatePlayersList();   // Show connected players
        this.updateRestartButton(); // Enable/disable restart button
    }

    // Update the visual game board with the latest state from server
    updateBoard() {
        const cells = document.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
            // Display 'X' or 'O' from the server's board state
            const symbol = this.gameState.board[index];
            cell.textContent = symbol;

            // Enable/disable cells based on game rules and whose turn it is
            const isOccupied = symbol !== '';  // Cell already has X or O
            const isMyTurn = this.gameState.currentPlayer === this.playerId;  // Server says it's our turn
            const gameActive = this.gameState.status === 'playing' && !this.gameState.gameOver;

            if (isOccupied || !isMyTurn || !gameActive) {
                cell.classList.add('disabled');
                cell.style.cursor = 'not-allowed';
            } else {
                cell.classList.remove('disabled');
                cell.style.cursor = 'pointer';
            }
        });
    }

    updateGameStatus() {
        const statusDiv = document.getElementById('gameStatus');
        let statusText = '';
        let statusClass = '';

        switch (this.gameState.status) {
            case 'waiting':
                statusText = `Waiting for players... (${this.gameState.players.length}/2)`;
                statusClass = 'waiting';
                break;

            case 'playing':
                if (this.gameState.gameOver) {
                    if (this.gameState.winner === 'tie') {
                        statusText = "It's a tie!";
                    } else if (this.gameState.winner === this.playerId) {
                        statusText = "You won! 🎉";
                    } else {
                        statusText = "You lost! 😢";
                    }
                    statusClass = 'finished';
                } else {
                    const currentPlayer = this.gameState.players.find(p => p.id === this.gameState.currentPlayer);
                    if (this.gameState.currentPlayer === this.playerId) {
                        statusText = "Your turn!";
                    } else {
                        statusText = `Waiting for ${currentPlayer ? currentPlayer.name : 'opponent'}...`;
                    }
                    statusClass = 'playing';
                }
                break;

            case 'finished':
                if (this.gameState.winner === 'tie') {
                    statusText = "Game ended in a tie!";
                } else if (this.gameState.winner === this.playerId) {
                    statusText = "You won the game! 🎉";
                } else {
                    statusText = "Game over - You lost! 😢";
                }
                statusClass = 'finished';
                break;
        }

        statusDiv.textContent = statusText;
        statusDiv.className = `status ${statusClass}`;
    }

    updatePlayersList() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.gameState.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.name} (${player.symbol})`;
            if (player.id === this.playerId) {
                playerDiv.style.fontWeight = 'bold';
                playerDiv.style.color = '#007bff';
            }
            playersList.appendChild(playerDiv);
        });
    }

    updateRestartButton() {
        const restartBtn = document.getElementById('restartBtn');
        restartBtn.disabled = this.gameState.status !== 'finished' && !this.gameState.gameOver;
    }

    // Send a move to the server via WebSocket
    // The server will validate the move and broadcast the result to all players
    makeMove(position) {
        if (!this.room || !this.gameState) return;

        // Client-side validation (server will also validate)
        if (this.gameState.status !== 'playing') return;              // Game not active
        if (this.gameState.gameOver) return;                          // Game already ended
        if (this.gameState.currentPlayer !== this.playerId) return;   // Not our turn
        if (this.gameState.board[position] !== '') return;            // Cell occupied

        // Send move message to server - this triggers handleMove() on the server
        // Server will update game state and broadcast changes to all connected clients
        this.room.send('make_move', { position });
    }

    // Request game restart from server
    restartGame() {
        if (this.room) {
            // Send restart message to server - triggers restartGame() on server
            // Server will reset game state and broadcast to all clients
            this.room.send('restart_game');
        }
    }
}

// Global function for the restart button in HTML
function restartGame() {
    if (window.gameClient) {
        window.gameClient.restartGame();
    }
}

// Initialize the game client when page loads
// This starts the WebSocket connection and joins a game room
document.addEventListener('DOMContentLoaded', () => {
    window.gameClient = new TicTacToeClient();
});