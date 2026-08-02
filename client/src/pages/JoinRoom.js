import {
    useContext,
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";


function JoinRoom() {

    const [roomCode, setRoomCode] = useState("");

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);


    useEffect(() => {

        if (!socket.connected) {
            socket.connect();
        }


        function handleRoomJoined(data) {

    console.log("Room joined:", data);

    localStorage.setItem(
        "roomCode",
        data.roomCode
    );

    localStorage.setItem(
        "symbol",
        data.symbol
    );

    navigate("/online-game");
}


        const handleError = (data) => {

            alert(data.message);

        };


        socket.on(
            "roomJoined",
            handleRoomJoined
        );

        socket.on(
            "roomError",
            handleError
        );


        return () => {

            socket.off(
                "roomJoined",
                handleRoomJoined
            );

            socket.off(
                "roomError",
                handleError
            );

        };

    }, [navigate]);


    function joinRoom() {

        if (!roomCode.trim()) {

            alert("Enter room code");

            return;

        }


        socket.emit("joinRoom", {

            roomCode:
                roomCode.trim().toUpperCase(),

            username: user.username

        });

    }


    return (

        <div
            style={{
                textAlign: "center",
                marginTop: "120px"
            }}
        >

            <h1>Join Room</h1>


            <input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                maxLength={6}
                onChange={(e) =>
                    setRoomCode(
                        e.target.value.toUpperCase()
                    )
                }
            />


            <br />
            <br />


            <button onClick={joinRoom}>
                Join Room
            </button>

        </div>

    );
}


export default JoinRoom;