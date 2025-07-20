const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.querySelector('.reset-btn');
const aiBtn = document.querySelector('.ai-btn');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isAIActive = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] || !isGameActive) return;
    makeMove(index, currentPlayer);
    if (isAIActive && isGameActive && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
    cells[index].disabled = true;
    if (checkWin()) {
        statusDisplay.textContent = `Player ${player} Wins!`;
        isGameActive = false;
        highlightWin();
    } else if (board.every(cell => cell)) {
        statusDisplay.textContent = "It's a Draw!";
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === currentPlayer);
    });
}

function highlightWin() {
    const winningPattern = winPatterns.find(pattern => {
        return pattern.every(index => board[index] === currentPlayer);
    });
    if (winningPattern) {
        winningPattern.forEach(index => {
            cells[index].style.background = '#ff007a';
            cells[index].style.boxShadow = '0 0 20px #ff007a';
        });
    }
}

function minimax(newBoard, player, depth = 0) {
    const opponent = player === 'X' ? 'O' : 'X';
    if (winPatterns.some(pattern => pattern.every(i => newBoard[i] === 'X'))) {
        return { score: -10 + depth };
    }
    if (winPatterns.some(pattern => pattern.every(i => newBoard[i] === 'O'))) {
        return { score: 10 - depth };
    }
    if (newBoard.every(cell => cell)) {
        return { score: 0 };
    }
    const moves = [];
    newBoard.forEach((cell, i) => {
        if (!cell) {
            const move = { index: i };
            newBoard[i] = player;
            const result = minimax(newBoard, opponent, depth + 1);
            move.score = result.score;
            newBoard[i] = '';
            moves.push(move);
        }
    });
    return player === 'O'
        ? moves.reduce((best, move) => move.score > best.score ? move : best, { score: -Infinity })
        : moves.reduce((best, move) => move.score < best.score ? move : best, { score: Infinity });
}

function makeAIMove() {
    const bestMove = minimax([...board], 'O');
    if (bestMove.index !== undefined) {
        makeMove(bestMove.index, 'O');
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.disabled = false;
        cell.style.background = '#1a1a2e';
        cell.style.boxShadow = 'none';
    });
}

function toggleAI() {
    isAIActive = !isAIActive;
    aiBtn.textContent = isAIActive ? 'Play vs Human' : 'Play vs AI';
    resetGame();
    if (isAIActive && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
aiBtn.addEventListener('click', toggleAI);

document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (board[index] || !isGameActive) return;
        makeMove(index, currentPlayer);
        if (isAIActive && isGameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
    if (e.key === 'r') resetGame();
    if (e.key === 'a') toggleAI();
});