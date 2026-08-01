import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);
  function logout() {
    localStorage.removeItem("token");

    setUser(null);

    navigate("/");
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>TIC TAC TOE</h1>

        <h2>Welcome, {user?.username} 👋</h2>

        <button onClick={() => navigate("/game")}>Play Local Game</button>

        <button onClick={() => navigate("/create-room")}>Create Room</button>

        <button onClick={() => navigate("/join-room")}>Join Room</button>

        <button disabled>Play With AI (Coming Soon)</button>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
