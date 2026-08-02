import {
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

import "../App.css";


function Square({ value, onSquareClick }) {
  return (
    <button
      type="button"
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}


function OnlineGame() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const roomCode =
    localStorage.getItem("roomCode");

  const mySymbol =
    localStorage.getItem("symbol");


  const [board, setBoard] =
    useState(Array(9).fill(null));

  const [turn, setTurn] =
    useState("X");

  const [winner, setWinner] =
    useState(null);

  const [draw, setDraw] =
    useState(false);

  const [error, setError] =
    useState("");

  const [rematchRequested, setRematchRequested] =
    useState(false);

  const [opponentRequested, setOpponentRequested] =
    useState(false);

  const [opponentLeft, setOpponentLeft] =
    useState(false);


  useEffect(() => {
    if (!roomCode || !mySymbol) {
      navigate("/home");
      return;
    }


    function handleGameUpdate(data) {
      setBoard([...data.board]);
      setTurn(data.turn);
      setWinner(data.winner);
      setDraw(data.draw);
      setError("");
    }


    function handleMoveError(data) {
      setError(data.message);
    }


    function handleRematchRequested(data) {
      console.log(
        `${data.username} requested a rematch`
      );

      setOpponentRequested(true);
    }


    function handleRematchStart(data) {
      setBoard([...data.board]);
      setTurn(data.turn);
      setWinner(null);
      setDraw(false);

      setError("");

      setRematchRequested(false);
      setOpponentRequested(false);
    }


    function handleOpponentLeft(data) {
      setOpponentLeft(true);

      setError(
        `${data.username} left the match`
      );
    }


    socket.on(
      "gameUpdate",
      handleGameUpdate
    );

    socket.on(
      "moveError",
      handleMoveError
    );

    socket.on(
      "rematchRequested",
      handleRematchRequested
    );

    socket.on(
      "rematchStart",
      handleRematchStart
    );

    socket.on(
      "opponentLeft",
      handleOpponentLeft
    );


    return () => {
      socket.off(
        "gameUpdate",
        handleGameUpdate
      );

      socket.off(
        "moveError",
        handleMoveError
      );

      socket.off(
        "rematchRequested",
        handleRematchRequested
      );

      socket.off(
        "rematchStart",
        handleRematchStart
      );

      socket.off(
        "opponentLeft",
        handleOpponentLeft
      );
    };

  }, [navigate, roomCode, mySymbol]);


  function handleSquareClick(index) {
    if (winner || draw || opponentLeft) {
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


  function requestRematch() {
    if (rematchRequested) {
      return;
    }

    setRematchRequested(true);

    socket.emit("requestRematch", {
      roomCode,
    });
  }


  function leaveGame() {
    socket.emit("leaveRoom", {
      roomCode,
    });

    localStorage.removeItem("roomCode");
    localStorage.removeItem("symbol");

    navigate("/home");
  }


  let status;


  if (opponentLeft) {
    status = "Opponent Left";
  }

  else if (winner) {
    if (winner === mySymbol) {
      status = "You Won! 🎉";
    } else {
      status = "Opponent Won!";
    }
  }

  else if (draw) {
    status = "Match Draw!";
  }

  else if (turn === mySymbol) {
    status = "Your Turn";
  }

  else {
    status = "Opponent's Turn";
  }


  return (
    <div className="game">

      <div className="game-board">

        <h2>
          Online Multiplayer
        </h2>

        <p>
          Player: {user?.username}
        </p>

        <p>
          Room: {roomCode}
        </p>

        <p>
          You are: {mySymbol}
        </p>


        <div className="status">
          {status}
        </div>


        {error && (
          <p className="game-error">
            {error}
          </p>
        )}


        <div className="board-row">

          <Square
            value={board[0]}
            onSquareClick={() =>
              handleSquareClick(0)
            }
          />

          <Square
            value={board[1]}
            onSquareClick={() =>
              handleSquareClick(1)
            }
          />

          <Square
            value={board[2]}
            onSquareClick={() =>
              handleSquareClick(2)
            }
          />

        </div>


        <div className="board-row">

          <Square
            value={board[3]}
            onSquareClick={() =>
              handleSquareClick(3)
            }
          />

          <Square
            value={board[4]}
            onSquareClick={() =>
              handleSquareClick(4)
            }
          />

          <Square
            value={board[5]}
            onSquareClick={() =>
              handleSquareClick(5)
            }
          />

        </div>


        <div className="board-row">

          <Square
            value={board[6]}
            onSquareClick={() =>
              handleSquareClick(6)
            }
          />

          <Square
            value={board[7]}
            onSquareClick={() =>
              handleSquareClick(7)
            }
          />

          <Square
            value={board[8]}
            onSquareClick={() =>
              handleSquareClick(8)
            }
          />

        </div>


        {(winner || draw) && !opponentLeft && (

          <div className="game-actions">

            {opponentRequested && (
              <p>
                Opponent wants a rematch!
              </p>
            )}


            <button
              type="button"
              onClick={requestRematch}
              disabled={rematchRequested}
            >

              {rematchRequested
                ? "Waiting for Opponent..."
                : opponentRequested
                  ? "Accept Rematch"
                  : "Rematch"}

            </button>

          </div>

        )}


        <button
          type="button"
          onClick={leaveGame}
        >
          Leave Game
        </button>

      </div>

    </div>
  );
}


export default OnlineGame;