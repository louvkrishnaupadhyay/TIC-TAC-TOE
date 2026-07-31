import "../styles/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [name, setName] = useState("");

    const navigate = useNavigate();

    function handleLogin(e){
        e.preventDefault();

        if(name.trim()===""){
            alert("Enter your name");
            return;
        }

        localStorage.setItem("playerName",name);

        navigate("/home");
    }

    return(
        <div className="login-container">

            <div className="login-box">

                <h1>Tic Tac Toe</h1>

                <form onSubmit={handleLogin}>

                    <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />

                    <button type="submit">
                        Continue
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;