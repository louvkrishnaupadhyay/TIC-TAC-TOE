import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  calculateWinner,
  getAIMove,
  isDraw,
} from "../utils/ticTacToeAI";

import "../styles/AIGame.css";

function AIGame() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const difficulty =
    searchParams.get("difficulty") ||
    "medium";

  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [isPlayerTurn, setIsPlayerTurn] =
    useState(true);

  const winner = calculateWinner(board);

  const draw = isDraw(board);

  // ==========================================
  // PLAYER MOVE
  // ==========================================

  function handleSquareClick(index) {
    if (!isPlayerTurn) {
      return;
    }

    if (board[index]) {
      return;
    }

    if (winner || draw) {
      return;
    }

    const newBoard = [...board];

    newBoard[index] = "X";

    setBoard(newBoard);

    setIsPlayerTurn(false);
  }


  // ==========================================
  // AI MOVE
  // ==========================================

  useEffect(() => {
    if (isPlayerTurn) {
      return;
    }

    const currentWinner =
      calculateWinner(board);

    const currentDraw =
      isDraw(board);

    if (currentWinner || currentDraw) {
      return;
    }

    // Small delay makes AI feel natural
    const timer = setTimeout(() => {
      const aiMove = getAIMove(
        board,
        difficulty
      );

      if (aiMove === null) {
        return;
      }

      setBoard((currentBoard) => {
        const newBoard = [
          ...currentBoard,
        ];

        newBoard[aiMove] = "O";

        return newBoard;
      });

      setIsPlayerTurn(true);

    }, 500);

    return () => {
      clearTimeout(timer);
    };

  }, [
    board,
    difficulty,
    isPlayerTurn,
  ]);


  // ==========================================
  // RESTART
  // ==========================================

  function restartGame() {
    setBoard(Array(9).fill(null));

    setIsPlayerTurn(true);
  }


  // ==========================================
  // STATUS
  // ==========================================

  let status;

  if (winner === "X") {
    status = "🎉 You Won!";
  }

  else if (winner === "O") {
    status = "🤖 AI Won!";
  }

  else if (draw) {
    status = "🤝 Draw!";
  }

  else if (isPlayerTurn) {
    status = "Your Turn (X)";
  }

  else {
    status = "AI is thinking...";
  }


  // ==========================================
  // UI
  // ==========================================

  return (
  <div className="ai-game-page">

    <div className="ai-game-container">

      <h1 className="ai-game-title">
        🤖 AI Opponent
      </h1>

      <div className="ai-difficulty-badge">
        {difficulty} difficulty
      </div>


      <div className="ai-game-status">
        {status}
      </div>


      <div className="ai-board">

        {board.map((square, index) => (

          <button
            key={index}

            className={`ai-square ${
              square
                ? square.toLowerCase()
                : ""
            }`}

            onClick={() =>
              handleSquareClick(index)
            }

            disabled={
              !isPlayerTurn ||
              Boolean(square) ||
              Boolean(winner) ||
              draw
            }
          >
            {square}
          </button>

        ))}

      </div>


      <div className="ai-game-buttons">

        {(winner || draw) && (

          <button
            className="ai-primary-button"
            onClick={restartGame}
          >
            ↻ Play Again
          </button>

        )}


        <button
          className="ai-secondary-button"
          onClick={() =>
            navigate("/ai-difficulty")
          }
        >
          ⚙ Change Difficulty
        </button>


        <button
          className="ai-secondary-button"
          onClick={() =>
            navigate("/home")
          }
        >
          ← Home
        </button>

      </div>

    </div>

  </div>
);
}

export default AIGame;