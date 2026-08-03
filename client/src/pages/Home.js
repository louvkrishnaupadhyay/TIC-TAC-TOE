import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  function logout() {
    // Remove authentication
    localStorage.removeItem("token");

    // Remove old game data
    localStorage.removeItem("roomCode");
    localStorage.removeItem("symbol");

    setUser(null);

    navigate("/");
  }

  return (
    <div className="home-container">
      <div className="home-card">

        {/* TITLE */}

        <h1>TIC TAC TOE</h1>

        <h2>
          Welcome, {user?.username} 
        </h2>


        {/* LOCAL GAME */}

        <button
          className="home-btn"
          onClick={() => navigate("/game")}
        >
          🎮 Play Local Game
        </button>


        {/* CREATE ONLINE ROOM */}

        <button
          className="home-btn"
          onClick={() =>
            navigate("/create-room")
          }
        >
          🌐 Create Room
        </button>


        {/* JOIN ONLINE ROOM */}

        <button
          className="home-btn"
          onClick={() =>
            navigate("/join-room")
          }
        >
          🔗 Join Room
        </button>


        {/* AI GAME */}

        <button
          className="home-btn ai-home-btn"
          onClick={() =>
            navigate("/ai-difficulty")
          }
        >
          🤖 Play With AI
        </button>


        {/* LEADERBOARD */}

        <button
          className="home-btn leaderboard-home-btn"
          onClick={() =>
            navigate("/leaderboard")
          }
        >
          🏆 Leaderboard
        </button>


        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Home;