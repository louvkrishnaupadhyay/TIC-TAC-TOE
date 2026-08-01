import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../api/axios";
import "../styles/Login.css";

function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();


    async function handleRegister(e) {

        e.preventDefault();

        setError("");

        try {

            await API.post("/auth/register", {
                username,
                email,
                password
            });

            alert("Registration successful!");

            navigate("/");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
    }


    return (

        <div className="login-container">

            <div className="login-box">

                <h1>Tic Tac Toe</h1>

                <h2>Create Account</h2>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

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
                        Register
                    </button>

                </form>

                <p>
                    Already have an account?{" "}

                    <Link to="/">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Register;