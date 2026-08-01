import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreateRoom from "./pages/CreateRoom.js";
import JoinRoom from "./pages/JoinRoom.js";
import Lobby from "./pages/Lobby.js";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home.js";
import Game from "./pages/Game.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;