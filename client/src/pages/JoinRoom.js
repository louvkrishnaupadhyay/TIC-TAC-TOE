import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  // ==================================================
  // SOCKET EVENTS
  // ==================================================

  useEffect(() => {
    // Connect socket if it is not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Room joined successfully
    function handleRoomJoined(data) {
      console.log("Room joined:", data);

      // Store room information
      localStorage.setItem(
        "roomCode",
        data.roomCode
      );

      localStorage.setItem(
        "symbol",
        data.symbol
      );

      // Move player to online game
      navigate("/online-game");
    }

    // Room error
    function handleError(data) {
      console.error(
        "Room error:",
        data
      );

      alert(data.message);
    }

    // Register socket listeners
    socket.on(
      "roomJoined",
      handleRoomJoined
    );

    socket.on(
      "roomError",
      handleError
    );

    // Cleanup listeners
    return () => {
      socket.off(
        "roomJoined",
        handleRoomJoined
      );

      socket.off(
        "roomError",
        handleError
      );
    };
  }, [navigate]);

  // ==================================================
  // JOIN ROOM
  // ==================================================

  function joinRoom() {
    const code =
      roomCode.trim().toUpperCase();

    // Check room code
    if (!code) {
      alert("Enter room code");
      return;
    }

    // Check logged-in user
    if (!user) {
      alert(
        "User information not loaded. Please login again."
      );

      navigate("/login");

      return;
    }

    // Get MongoDB user ID
    const userId =
      user._id || user.id;

    // Debugging
    console.log(
      "JOIN USER:",
      user
    );

    console.log(
      "JOIN USERNAME:",
      user.username
    );

    console.log(
      "JOIN USER ID:",
      userId
    );

    // MongoDB ID is required for statistics
    if (!userId) {
      console.error(
        "MongoDB user ID is missing:",
        user
      );

      alert(
        "Your account information is incomplete. Please logout and login again."
      );

      return;
    }

    // Send join request to server
    socket.emit(
      "joinRoom",
      {
        roomCode: code,
        username: user.username,
        userId: userId,
      }
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "120px",
      }}
    >
      <h1>Join Room</h1>

      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        maxLength={6}
        onChange={(e) =>
          setRoomCode(
            e.target.value.toUpperCase()
          )
        }
      />

      <br />
      <br />

      <button
        onClick={joinRoom}
      >
        Join Room
      </button>
    </div>
  );
}

export default JoinRoom;