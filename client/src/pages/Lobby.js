import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../socket/socket";


function Lobby() {

    const navigate = useNavigate();

    const roomCode =
        localStorage.getItem("roomCode");

    const symbol =
        localStorage.getItem("symbol");


    useEffect(() => {

        const handleGameStart = (data) => {

            console.log(
                "Game starting:",
                data
            );

            navigate("/online-game");

        };


        socket.on(
            "gameStart",
            handleGameStart
        );


        return () => {

            socket.off(
                "gameStart",
                handleGameStart
            );

        };

    }, [navigate]);


    function copyRoomCode() {

        navigator.clipboard.writeText(
            roomCode
        );

    }


    return (

        <div
            style={{
                textAlign: "center",
                marginTop: "120px"
            }}
        >

            <h1>Waiting Lobby</h1>

            <p>Your symbol</p>

            <h2>{symbol}</h2>


            <p>Room Code</p>

            <h1>{roomCode}</h1>


            <button onClick={copyRoomCode}>
                Copy Room Code
            </button>


            <p>
                Waiting for another player...
            </p>

        </div>

    );
}


export default Lobby;