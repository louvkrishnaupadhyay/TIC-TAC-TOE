const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");

dotenv.config();

connectDB();

const app = express();

// Middleware

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

// API Routes

app.use("/api/auth", require("./routes/authRoutes"));

app.use(
  "/api/leaderboard",
  require("./routes/leaderboardRoutes")
);

app.get("/", (req, res) => {
    res.send("Tic Tac Toe Backend Running 🚀");
});

// HTTP Server

const server = http.createServer(app);

// Socket.IO Server

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


// All multiplayer socket logic
socketHandler(io);

// Start Server

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});