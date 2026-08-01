import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">

      <div className="home-card">

        <h1>TIC TAC TOE</h1>

        <h2>Welcome, {player} 👋</h2>

        <button onClick={() => navigate("/game")}>
          Play Local Game
        </button>

        <button onClick={() => navigate("/create-room")}>
            Create Room
        </button>

        <button onClick={() => navigate("/join-room")}>
            Join Room
        </button>

        <button disabled>
          Play With AI (Coming Soon)
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("playerName");
            navigate("/");
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Home;