import { useState } from "react";
import "../App.css";

function Square({value, onSquareClick}){
  
  return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

function Board({ xIsNext, squares, onPlay }) {

  function clickHandeler(i){
    if(squares[i] || calcualteWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = 'X';
    }
    else{
      nextSquares[i] = 'O';
    }
    
    onPlay(nextSquares);
  }

  const winner = calcualteWinner(squares);
  let status;
  if(winner){
    status = "Winner " + winner;
  }
  else{
    status = "Turn of player " + (xIsNext ? 'X':'O');
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row" >
        <Square value = {squares[0]} onSquareClick={() => clickHandeler(0)}/>
        <Square value = {squares[1]} onSquareClick={() => clickHandeler(1)}/>
        <Square value = {squares[2]} onSquareClick={() => clickHandeler(2)}/>
      </div>
      <div className="board-row" >
        <Square value = {squares[3]} onSquareClick={() => clickHandeler(3)}/>
        <Square value = {squares[4]} onSquareClick={() => clickHandeler(4)}/>
        <Square value = {squares[5]} onSquareClick={() => clickHandeler(5)}/>
      </div>
      <div className="board-row" >
        <Square value = {squares[6]} onSquareClick={() => clickHandeler(6)}/>
        <Square value = {squares[7]} onSquareClick={() => clickHandeler(7)}/>
        <Square value = {squares[8]} onSquareClick={() => clickHandeler(8)}/>
      </div>
      
      
    </div>
  )
  
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showMoves, setShowMoves] = useState(false);
  const [matchFinish, setMatchFinish] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMatchFinish(calcualteWinner(nextSquares) !== null);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setMatchFinish(calcualteWinner(history[nextMove]) !== null);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setShowMoves(false);
    setMatchFinish(false);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Start Game';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
    <div className="bg-animation">
      <span>X</span>
      <span>O</span>
      <span>X</span>
      <span>O</span>
      <span>X</span>
      <span>O</span>
      <span>X</span>
      <span>O</span>
    </div>

    <div className="game">
      <div className="game-board">
        
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        {currentMove > 0 && (
          <button className="analyse-button" onClick={() => setShowMoves(true)}>
            Analyse
          </button>
        )} 
        {matchFinish && (
          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        )}
      </div>

      {showMoves && (
        <div className="game-info">
          <h3>Move History</h3>
          <ol>{moves}</ol>
        </div>
      )}
    </div>
    </>
  );
}

function calcualteWinner(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for(let i = 0 ; i < lines.length ; i++)
    {
      const [a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    return null;
  }

  export default Game;