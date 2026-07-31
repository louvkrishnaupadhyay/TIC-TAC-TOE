import { useNavigate } from "react-router-dom";

function Lobby(){

    const navigate=useNavigate();

    const room=localStorage.getItem("roomCode");

    return(

        <div style={{textAlign:"center",marginTop:"120px"}}>

            <h1>Waiting Lobby</h1>

            <h2>Room Code</h2>

            <h1>{room}</h1>

            <button
                onClick={()=>{
                    navigator.clipboard.writeText(room);
                    alert("Room Code Copied");
                }}
            >
                Copy Room Code
            </button>

            <br/><br/>

            <button onClick={()=>navigate("/game")}>

                Start Local Demo

            </button>

        </div>

    );

}

export default Lobby;