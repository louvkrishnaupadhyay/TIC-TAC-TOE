const rooms = {};

function socketHandler(io) {

  io.on("connection", (socket) => {

    console.log("Player connected:", socket.id);


    // ==========================================
    // CREATE ROOM
    // ==========================================

    socket.on("createRoom", ({ roomCode, username }) => {

      if (rooms[roomCode]) {

        socket.emit("roomError", {
          message: "Room already exists"
        });

        return;
      }


      rooms[roomCode] = {

        players: [
          {
            socketId: socket.id,
            username,
            symbol: "X"
          }
        ],

        board: Array(9).fill(null),

        turn: "X"

      };


      socket.join(roomCode);


      socket.emit("roomCreated", {

        roomCode,

        symbol: "X"

      });


      console.log(
        `${username} created room ${roomCode}`
      );

    });


    // ==========================================
    // JOIN ROOM
    // ==========================================

    socket.on("joinRoom", ({ roomCode, username }) => {

      const room = rooms[roomCode];


      if (!room) {

        socket.emit("roomError", {
          message: "Room not found"
        });

        return;
      }


      if (room.players.length >= 2) {

        socket.emit("roomError", {
          message: "Room is full"
        });

        return;
      }


      room.players.push({

        socketId: socket.id,

        username,

        symbol: "O"

      });


      socket.join(roomCode);


      socket.emit("roomJoined", {

        roomCode,

        symbol: "O"

      });


      // Tell both players that game can start

      io.to(roomCode).emit("gameStart", {

        players: room.players,

        board: room.board,

        turn: room.turn

      });


      console.log(
        `${username} joined room ${roomCode}`
      );

    });


    // ==========================================
    // MAKE MOVE
    // ==========================================

    socket.on("makeMove", ({ roomCode, index }) => {

      console.log("\n===== MOVE RECEIVED =====");

      console.log("Socket:", socket.id);
      console.log("Room:", roomCode);
      console.log("Index:", index);


      const room = rooms[roomCode];


      if (!room) {

        socket.emit("moveError", {
          message: "Room not found"
        });

        return;
      }


      // Find which player made this move

      const player = room.players.find(
        (p) => p.socketId === socket.id
      );


      console.log("Player:", player);
      console.log("Current turn:", room.turn);


      if (!player) {

        socket.emit("moveError", {
          message: "Player not found in room"
        });

        return;
      }


      // Check turn

      if (player.symbol !== room.turn) {

        socket.emit("moveError", {
          message: "It's not your turn"
        });

        return;
      }


      // Validate index

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index > 8
      ) {

        socket.emit("moveError", {
          message: "Invalid move"
        });

        return;
      }


      // Square already occupied

      if (room.board[index] !== null) {

        socket.emit("moveError", {
          message: "Square already occupied"
        });

        return;
      }


      // ==========================================
      // UPDATE BOARD
      // ==========================================

      room.board[index] = player.symbol;


      const winner =
        calculateWinner(room.board);


      const draw =
        !winner &&
        room.board.every(
          (square) => square !== null
        );


      // Change turn only if game continues

      if (!winner && !draw) {

        room.turn =
          room.turn === "X"
            ? "O"
            : "X";

      }


      console.log(
        "Updated board:",
        room.board
      );

      console.log(
        "Next turn:",
        room.turn
      );


      // ==========================================
      // SEND UPDATE TO BOTH PLAYERS
      // ==========================================

      io.to(roomCode).emit("gameUpdate", {

        board: room.board,

        turn: room.turn,

        winner,

        draw

      });

    });


    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", () => {

      console.log(
        "Player disconnected:",
        socket.id
      );

    });

  });

}


// ==========================================
// WINNER CALCULATION
// ==========================================

function calculateWinner(board) {

  const lines = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

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