import { BrowserRouter, Routes, Route } from "react-router-dom";

import CreateRoom from "./pages/CreatRoom.js";
import JoinRoom from "./pages/JoinRoom.js";
import Lobby from "./pages/Lobby.js";

import Login from "./pages/Login.js";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;