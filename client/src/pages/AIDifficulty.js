import { useNavigate } from "react-router-dom";

import "../styles/AIDifficulty.css";

function AIDifficulty() {
  const navigate = useNavigate();

  function startGame(difficulty) {
    navigate(
      `/ai-game?difficulty=${difficulty}`
    );
  }

  return (
    <div className="ai-difficulty-page">

      <div className="ai-difficulty-card">

        <div className="ai-icon">
          🤖
        </div>

        <h1>AI Opponent</h1>

        <p className="ai-subtitle">
          Choose your opponent's difficulty
        </p>


        <div className="difficulty-options">

          {/* EASY */}

          <button
            className="difficulty-button easy-button"
            onClick={() =>
              startGame("easy")
            }
          >

            <div className="difficulty-info">

              <span className="difficulty-title">
                🟢 Easy
              </span>

              <span className="difficulty-description">
                Relaxed AI with random moves
              </span>

            </div>

            <span className="difficulty-arrow">
              →
            </span>

          </button>


          {/* MEDIUM */}

          <button
            className="difficulty-button medium-button"
            onClick={() =>
              startGame("medium")
            }
          >

            <div className="difficulty-info">

              <span className="difficulty-title">
                🟡 Medium
              </span>

              <span className="difficulty-description">
                A mix of strategy and mistakes
              </span>

            </div>

            <span className="difficulty-arrow">
              →
            </span>

          </button>


          {/* HARD */}

          <button
            className="difficulty-button hard-button"
            onClick={() =>
              startGame("hard")
            }
          >

            <div className="difficulty-info">

              <span className="difficulty-title">
                🔴 Hard
              </span>

              <span className="difficulty-description">
                Minimax AI — can you survive?
              </span>

            </div>

            <span className="difficulty-arrow">
              →
            </span>

          </button>

        </div>


        <button
          className="ai-back-button"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default AIDifficulty;