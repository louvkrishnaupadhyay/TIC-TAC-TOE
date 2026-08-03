// ==========================================
// CHECK WINNER
// ==========================================

export function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
}


// ==========================================
// CHECK DRAW
// ==========================================

export function isDraw(board) {
  return (
    !calculateWinner(board) &&
    board.every((square) => square !== null)
  );
}


// ==========================================
// GET EMPTY SQUARES
// ==========================================

function getAvailableMoves(board) {
  const moves = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }

  return moves;
}


// ==========================================
// EASY AI
// ==========================================

function getRandomMove(board) {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(
    Math.random() * availableMoves.length
  );

  return availableMoves[randomIndex];
}


// ==========================================
// MINIMAX
// ==========================================

function minimax(board, isMaximizing, depth = 0) {
  const winner = calculateWinner(board);

  // AI wins
  if (winner === "O") {
    return 10 - depth;
  }

  // Human wins
  if (winner === "X") {
    return depth - 10;
  }

  // Draw
  if (board.every((square) => square !== null)) {
    return 0;
  }

  // ========================================
  // AI TURN
  // ========================================

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";

        const score = minimax(
          board,
          false,
          depth + 1
        );

        board[i] = null;

        bestScore = Math.max(
          score,
          bestScore
        );
      }
    }

    return bestScore;
  }

  // ========================================
  // HUMAN TURN
  // ========================================

  let bestScore = Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "X";

      const score = minimax(
        board,
        true,
        depth + 1
      );

      board[i] = null;

      bestScore = Math.min(
        score,
        bestScore
      );
    }
  }

  return bestScore;
}


// ==========================================
// HARD AI
// ==========================================

function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";

      const score = minimax(
        board,
        false,
        0
      );

      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}


// ==========================================
// MAIN AI FUNCTION
// ==========================================

export function getAIMove(board, difficulty) {
  // EASY
  if (difficulty === "easy") {
    return getRandomMove([...board]);
  }

  // MEDIUM
  if (difficulty === "medium") {
    /*
     * 60% smart move
     * 40% random move
     */
    const useSmartMove = Math.random() < 0.6;

    if (useSmartMove) {
      return getBestMove([...board]);
    }

    return getRandomMove([...board]);
  }

  // HARD
  return getBestMove([...board]);
}