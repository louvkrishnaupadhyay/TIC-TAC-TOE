import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinRoom(){

    const [room,setRoom]=useState("");

    const navigate=useNavigate();

    function joinRoom(){

        if(room.trim()===""){

            alert("Enter Room Code");

            return;

        }

        localStorage.setItem("roomCode",room);

        navigate("/lobby");

    }

    return(

        <div style={{textAlign:"center",marginTop:"120px"}}>

            <h1>Join Room</h1>

            <input

                type="text"

                placeholder="Enter Room Code"

                value={room}

                onChange={(e)=>setRoom(e.target.value.toUpperCase())}

            />

            <br/><br/>

            <button onClick={joinRoom}>

                Join

            </button>

        </div>

    );

}

export default JoinRoom;