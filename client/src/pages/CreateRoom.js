import { useNavigate } from "react-router-dom";

function CreateRoom(){

    const navigate = useNavigate();

    function createRoom(){

        const roomCode=Math.random()
            .toString(36)
            .substring(2,8)
            .toUpperCase();

        localStorage.setItem("roomCode",roomCode);

        navigate("/lobby");
    }

    return(

        <div style={{textAlign:"center",marginTop:"120px"}}>

            <h1>Create Room</h1>

            <button onClick={createRoom}>
                Create New Room
            </button>

        </div>

    );

}

export default CreateRoom;