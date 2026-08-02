import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";


function CreateRoom() {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);


    useEffect(() => {

        if (!socket.connected) {
            socket.connect();
        }


        const handleRoomCreated = (data) => {

            localStorage.setItem(
                "roomCode",
                data.roomCode
            );

            localStorage.setItem(
                "symbol",
                data.symbol
            );

            navigate("/lobby");
        };


        const handleError = (data) => {
            alert(data.message);
        };


        socket.on(
            "roomCreated",
            handleRoomCreated
        );

        socket.on(
            "roomError",
            handleError
        );


        return () => {

            socket.off(
                "roomCreated",
                handleRoomCreated
            );

            socket.off(
                "roomError",
                handleError
            );

        };

    }, [navigate]);


    function createRoom() {

        const roomCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


        socket.emit("createRoom", {

            roomCode,

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

            <h1>Create Room</h1>

            <button onClick={createRoom}>
                Create New Room
            </button>

        </div>

    );
}


export default CreateRoom;