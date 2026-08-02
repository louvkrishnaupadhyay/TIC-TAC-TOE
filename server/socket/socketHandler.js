const User = require("../models/User");

const rooms = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    // ==================================================
    // CREATE ROOM
    // ==================================================

    socket.on("createRoom", ({ roomCode, username, userId }) => {
      if (rooms[roomCode]) {
        socket.emit("roomError", {
          message: "Room already exists",
        });
        return;
      }

      rooms[roomCode] = {
        players: [
          {
            socketId: socket.id,
            userId,
            username,
            symbol: "X",
          },
        ],

        board: Array(9).fill(null),

        turn: "X",

        // Used to alternate first player on rematch
        startingSymbol: "X",

        winner: null,
        draw: false,

        // Prevent duplicate MongoDB updates
        resultSaved: false,

        rematchRequests: [],
      };

      socket.join(roomCode);

      socket.emit("roomCreated", {
        roomCode,
        symbol: "X",
      });

      console.log(`${username} created room ${roomCode}`);
    });

    // ==================================================
    // JOIN ROOM
    // ==================================================

    socket.on("joinRoom", ({ roomCode, username, userId }) => {
      const room = rooms[roomCode];

      if (!room) {
        socket.emit("roomError", {
          message: "Room not found",
        });

        return;
      }

      if (room.players.length >= 2) {
        socket.emit("roomError", {
          message: "Room is full",
        });

        return;
      }

      room.players.push({
        socketId: socket.id,
        userId,
        username,
        symbol: "O",
      });

      socket.join(roomCode);

      socket.emit("roomJoined", {
        roomCode,
        symbol: "O",
      });

      // Tell both players that the game can start
      io.to(roomCode).emit("gameStart", {
        players: room.players,
        board: room.board,
        turn: room.turn,
      });

      console.log(`${username} joined room ${roomCode}`);
    });

    // ==================================================
    // MAKE MOVE
    // ==================================================

    socket.on("makeMove", async ({ roomCode, index }) => {
      const room = rooms[roomCode];

      // Check room
      if (!room) {
        socket.emit("moveError", {
          message: "Room no longer exists",
        });

        return;
      }

      // Find player
      const player = room.players.find(
        (p) => p.socketId === socket.id
      );

      if (!player) {
        socket.emit("moveError", {
          message: "Player not found in room",
        });

        return;
      }

      // Game already finished
      if (room.winner || room.draw) {
        return;
      }

      // Check turn
      if (player.symbol !== room.turn) {
        socket.emit("moveError", {
          message: "It's not your turn",
        });

        return;
      }

      // Validate board position
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index > 8
      ) {
        socket.emit("moveError", {
          message: "Invalid move",
        });

        return;
      }

      // Check occupied square
      if (room.board[index] !== null) {
        socket.emit("moveError", {
          message: "Square already occupied",
        });

        return;
      }

      // ==================================================
      // MAKE THE MOVE
      // ==================================================

      room.board[index] = player.symbol;

      // Check winner
      room.winner = calculateWinner(room.board);

      // Check draw
      room.draw =
        !room.winner &&
        room.board.every(
          (square) => square !== null
        );

      // ==================================================
      // SAVE RESULT TO MONGODB
      // ==================================================

      if (room.winner || room.draw) {
        await saveMatchResult(room);
      }

      // ==================================================
      // CHANGE TURN
      // ==================================================

      if (!room.winner && !room.draw) {
        room.turn =
          room.turn === "X" ? "O" : "X";
      }

      // ==================================================
      // SEND UPDATE TO BOTH PLAYERS
      // ==================================================

      io.to(roomCode).emit("gameUpdate", {
        board: room.board,
        turn: room.turn,
        winner: room.winner,
        draw: room.draw,
      });
    });

    // ==================================================
    // REMATCH REQUEST
    // ==================================================

    socket.on("requestRematch", ({ roomCode }) => {
      const room = rooms[roomCode];

      if (!room) {
        socket.emit("roomError", {
          message: "Room no longer exists",
        });

        return;
      }

      const player = room.players.find(
        (p) => p.socketId === socket.id
      );

      if (!player) {
        return;
      }

      // Rematch should only happen after game finishes
      if (!room.winner && !room.draw) {
        return;
      }

      // Prevent duplicate request from same player
      if (!room.rematchRequests.includes(socket.id)) {
        room.rematchRequests.push(socket.id);

        console.log(
          `${player.username} requested rematch in room ${roomCode}`
        );
      }

      // Tell opponent
      socket.to(roomCode).emit("rematchRequested", {
        username: player.username,
      });

      console.log(
        `Rematch requests: ${room.rematchRequests.length}/2`
      );

      // ==================================================
      // BOTH PLAYERS ACCEPTED REMATCH
      // ==================================================

      if (room.rematchRequests.length === 2) {
        // Reset board
        room.board = Array(9).fill(null);

        // Reset winner
        room.winner = null;

        // Reset draw
        room.draw = false;

        // IMPORTANT:
        // Allow next match result to save
        room.resultSaved = false;

        // Alternate starting player
        room.startingSymbol =
          room.startingSymbol === "X"
            ? "O"
            : "X";

        room.turn = room.startingSymbol;

        // Clear rematch requests
        room.rematchRequests = [];

        // Tell both clients
        io.to(roomCode).emit("rematchStart", {
          board: room.board,
          turn: room.turn,
          winner: null,
          draw: false,
        });

        console.log(
          `Rematch started in room ${roomCode}. ${room.turn} starts.`
        );
      }
    });

    // ==================================================
    // LEAVE ROOM
    // ==================================================

    socket.on("leaveRoom", ({ roomCode }) => {
      leaveRoom(io, socket, roomCode);
    });

    // ==================================================
    // DISCONNECT
    // ==================================================

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);

      for (const roomCode of Object.keys(rooms)) {
        const room = rooms[roomCode];

        const playerExists = room.players.some(
          (player) =>
            player.socketId === socket.id
        );

        if (playerExists) {
          leaveRoom(
            io,
            socket,
            roomCode
          );
        }
      }
    });
  });
}


// ==================================================
// LEAVE ROOM
// ==================================================

function leaveRoom(io, socket, roomCode) {
  const room = rooms[roomCode];

  if (!room) {
    return;
  }

  const leavingPlayer = room.players.find(
    (player) =>
      player.socketId === socket.id
  );

  if (!leavingPlayer) {
    return;
  }

  room.players = room.players.filter(
    (player) =>
      player.socketId !== socket.id
  );

  socket.leave(roomCode);

  // Tell remaining player
  socket.to(roomCode).emit("opponentLeft", {
    username: leavingPlayer.username,
  });

  // Delete room
  delete rooms[roomCode];

  console.log(`Room ${roomCode} deleted`);
}


// ==================================================
// SAVE MATCH RESULT TO MONGODB
// ==================================================

async function saveMatchResult(room) {
  // Prevent duplicate save
  if (room.resultSaved) {
    console.log(
      "Result already saved - skipping duplicate"
    );

    return;
  }

  // Match must have two players
  if (room.players.length !== 2) {
    console.log(
      "Cannot save result: room does not have two players"
    );

    return;
  }

  /*
   * Lock the result BEFORE database operations.
   *
   * This prevents two events from updating the same
   * result at approximately the same time.
   */
  room.resultSaved = true;

  try {
    // ==================================================
    // DRAW
    // ==================================================

    if (room.draw) {
      const player1 = room.players[0];
      const player2 = room.players[1];

      if (!player1.userId || !player2.userId) {
        console.log(
          "Cannot save draw: userId missing"
        );

        console.log(
          "Player 1:",
          player1.username,
          player1.userId
        );

        console.log(
          "Player 2:",
          player2.username,
          player2.userId
        );

        room.resultSaved = false;

        return;
      }

      await Promise.all([
        User.findByIdAndUpdate(
          player1.userId,
          {
            $inc: {
              draws: 1,
            },
          }
        ),

        User.findByIdAndUpdate(
          player2.userId,
          {
            $inc: {
              draws: 1,
            },
          }
        ),
      ]);

      console.log(
        "Draw - statistics saved"
      );

      return;
    }

    // ==================================================
    // WIN / LOSS
    // ==================================================

    if (room.winner) {
      const winningPlayer = room.players.find(
        (player) =>
          player.symbol === room.winner
      );

      const losingPlayer = room.players.find(
        (player) =>
          player.symbol !== room.winner
      );

      if (!winningPlayer || !losingPlayer) {
        console.log(
          "Winner or loser could not be determined"
        );

        room.resultSaved = false;

        return;
      }

      // Make sure MongoDB IDs exist
      if (
        !winningPlayer.userId ||
        !losingPlayer.userId
      ) {
        console.log(
          "Cannot save result: userId missing"
        );

        console.log(
          "Winner:",
          winningPlayer.username,
          winningPlayer.userId
        );

        console.log(
          "Loser:",
          losingPlayer.username,
          losingPlayer.userId
        );

        room.resultSaved = false;

        return;
      }

      // ==================================================
      // UPDATE MONGODB
      // ==================================================

      const [updatedWinner, updatedLoser] =
        await Promise.all([
          User.findByIdAndUpdate(
            winningPlayer.userId,
            {
              $inc: {
                wins: 1,
              },
            },
            {
              new: true,
            }
          ),

          User.findByIdAndUpdate(
            losingPlayer.userId,
            {
              $inc: {
                losses: 1,
              },
            },
            {
              new: true,
            }
          ),
        ]);

      // Make sure users actually existed
      if (!updatedWinner || !updatedLoser) {
        throw new Error(
          "Winner or loser was not found in MongoDB"
        );
      }

      console.log(
        `${winningPlayer.username} won - statistics saved`
      );

      console.log(
        `${winningPlayer.username} wins:`,
        updatedWinner.wins
      );

      console.log(
        `${losingPlayer.username} losses:`,
        updatedLoser.losses
      );
    }
  } catch (error) {
    /*
     * If MongoDB fails, unlock result so that
     * another attempt can be made.
     */
    room.resultSaved = false;

    console.error(
      "Failed to save match result:",
      error.message
    );
  }
}


// ==================================================
// CALCULATE WINNER
// ==================================================

function calculateWinner(board) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}


module.exports = socketHandler;