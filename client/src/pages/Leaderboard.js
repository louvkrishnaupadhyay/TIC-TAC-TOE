import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Leaderboard.css";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/leaderboard"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load leaderboard"
          );
        }

        setPlayers(data);

      } catch (error) {
        console.error(error);
        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  function calculateGames(player) {
    return (
      (player.wins || 0) +
      (player.losses || 0) +
      (player.draws || 0)
    );
  }

  function calculateWinRate(player) {
    const games = calculateGames(player);

    if (games === 0) {
      return "0%";
    }

    return `${((player.wins / games) * 100).toFixed(1)}%`;
  }

  return (
    <div className="leaderboard-page">

      <div className="leaderboard-container">

        <div className="leaderboard-header">
          <div>
            <p className="leaderboard-label">
              GLOBAL RANKING
            </p>

            <h1>🏆 Leaderboard</h1>

            <p>
              See how you rank against other players.
            </p>
          </div>

          <button
            className="leaderboard-back"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>
        </div>


        {loading && (
          <div className="leaderboard-message">
            Loading leaderboard...
          </div>
        )}


        {error && (
          <div className="leaderboard-error">
            {error}
          </div>
        )}


        {!loading && !error && (
          <div className="leaderboard-table-wrapper">

            <table className="leaderboard-table">

              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Games</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Draws</th>
                  <th>Win Rate</th>
                </tr>
              </thead>

              <tbody>

                {players.map((player, index) => {

                  let rank;

                  if (index === 0) {
                    rank = "🥇";
                  } else if (index === 1) {
                    rank = "🥈";
                  } else if (index === 2) {
                    rank = "🥉";
                  } else {
                    rank = `#${index + 1}`;
                  }

                  return (
                    <tr key={player._id}>

                      <td className="rank">
                        {rank}
                      </td>

                      <td className="player-name">
                        <div className="player-avatar">
                          {player.username
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        {player.username}
                      </td>

                      <td>
                        {calculateGames(player)}
                      </td>

                      <td className="wins">
                        {player.wins || 0}
                      </td>

                      <td className="losses">
                        {player.losses || 0}
                      </td>

                      <td>
                        {player.draws || 0}
                      </td>

                      <td className="win-rate">
                        {calculateWinRate(player)}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Leaderboard;