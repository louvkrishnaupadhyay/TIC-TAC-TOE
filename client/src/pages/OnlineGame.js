import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import socket from "../socket/socket";

import "../App.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function OnlineGame() {
  const navigate = useNavigate();

  const roomCode = localStorage.getItem("roomCode");

  const mySymbol = localStorage.getItem("symbol");

  const [board, setBoard] = useState(Array(9).fill(null));

  const [turn, setTurn] = useState("X");

  const [winner, setWinner] = useState(null);

  const [draw, setDraw] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomCode || !mySymbol) {
      navigate("/home");

      return;
    }

    function handleGameUpdate(data) {
      console.log("Game update:", data);

      setBoard([...data.board]);

      setTurn(data.turn);

      setWinner(data.winner);

      setDraw(data.draw);

      setError("");
    }

    function handleMoveError(data) {
      setError(data.message);
    }

    socket.on("gameUpdate", handleGameUpdate);

    socket.on("moveError", handleMoveError);

    return () => {
      socket.off("gameUpdate", handleGameUpdate);

      socket.off("moveError", handleMoveError);
    };
  }, [navigate, roomCode, mySymbol]);

  function handleSquareClick(index) {
    console.log("Square clicked:", index);
    console.log("My symbol:", mySymbol);
    console.log("Current turn:", turn);
    console.log("Socket connected:", socket.connected);
    console.log("Socket ID:", socket.id);

    if (winner || draw) {
      return;
    }

    if (board[index]) {
      return;
    }

    if (turn !== mySymbol) {
      setError("Wait for your turn");
      return;
    }

    socket.emit("makeMove", {
      roomCode,
      index,
    });
  }

  let status;

  if (winner) {
    if (winner === mySymbol) {
      status = "You Won! 🎉";
    } else {
      status = "Opponent Won!";
    }
  } else if (draw) {
    status = "Match Draw!";
  } else if (turn === mySymbol) {
    status = "Your Turn";
  } else {
    status = "Opponent's Turn";
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          <h2>Online Multiplayer</h2>

          <p>Room: {roomCode}</p>

          <p>You are: {mySymbol}</p>

          <div className="status">{status}</div>

          {error && <p>{error}</p>}

          <div className="board-row">
            <Square
              value={board[0]}
              onSquareClick={() => handleSquareClick(0)}
            />

            <Square
              value={board[1]}
              onSquareClick={() => handleSquareClick(1)}
            />

            <Square
              value={board[2]}
              onSquareClick={() => handleSquareClick(2)}
            />
          </div>

          <div className="board-row">
            <Square
              value={board[3]}
              onSquareClick={() => handleSquareClick(3)}
            />

            <Square
              value={board[4]}
              onSquareClick={() => handleSquareClick(4)}
            />

            <Square
              value={board[5]}
              onSquareClick={() => handleSquareClick(5)}
            />
          </div>

          <div className="board-row">
            <Square
              value={board[6]}
              onSquareClick={() => handleSquareClick(6)}
            />

            <Square
              value={board[7]}
              onSquareClick={() => handleSquareClick(7)}
            />

            <Square
              value={board[8]}
              onSquareClick={() => handleSquareClick(8)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default OnlineGame;
