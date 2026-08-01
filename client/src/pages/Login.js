import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import "../styles/Login.css";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const { setUser } = useContext(AuthContext);


    async function handleLogin(e) {

        e.preventDefault();

        setError("");

        try {

            const response = await API.post("/auth/login", {
                email,
                password
            });


            // Store JWT
            localStorage.setItem(
                "token",
                response.data.token
            );


            // Store user in context
            setUser(response.data.user);


            navigate("/home");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    }


    return (

        <div className="login-container">

            <div className="login-box">

                <h1>Tic Tac Toe</h1>

                <h2>Login</h2>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>


                <p>
                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;