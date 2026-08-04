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


// ==============================
// ALLOWED FRONTEND ORIGINS
// ==============================

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);


// ==============================
// MIDDLEWARE
// ==============================

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());


// ==============================
// API ROUTES
// ==============================

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/leaderboard",
  require("./routes/leaderboardRoutes")
);


// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("Tic Tac Toe Backend Running 🚀");
});


// ==============================
// HTTP SERVER
// ==============================

const server = http.createServer(app);


// ==============================
// SOCKET.IO SERVER
// ==============================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Multiplayer socket logic

socketHandler(io);


// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});