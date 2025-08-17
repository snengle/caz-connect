document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const boardElement = document.getElementById('game-board');
    const statusText = document.getElementById('status-text');
    const resetButton = document.getElementById('reset-button');
    const gameModeSelect = document.getElementById('game-mode');
    const difficultySelector = document.getElementById('difficulty-selector');
    const difficultyLevelSelect = document.getElementById('difficulty-level');
    const winningLineElement = document.getElementById('winning-line');
    const playerXScoreEl = document.getElementById('player-x-score');
    const playerOScoreEl = document.getElementById('player-o-score');
    
    // --- Constants ---
    const BOARD_SIZE = 8;
    const PLAYER_X = 'X';
    const PLAYER_O = 'O';
    const AI_PLAYER = PLAYER_O;
    const HUMAN_PLAYER = PLAYER_X;
    
    // AI Positional Strategy Map
    const POSITIONAL_VALUE_MAP = [
        [3, 4, 5, 7, 7, 5, 4, 3], [4, 6, 8, 10, 10, 8, 6, 4], [5, 8, 11, 13, 13, 11, 8, 5],
        [7, 10, 13, 16, 16, 13, 10, 7], [7, 10, 13, 16, 16, 13, 10, 7], [5, 8, 11, 13, 13, 11, 8, 5],
        [4, 6, 8, 10, 10, 8, 6, 4], [3, 4, 5, 7, 7, 5, 4, 3]
    ];

    // --- Game State ---
    let board, currentPlayer, movesMade, gameOver, gameMode, difficulty;
    let firstPlayer = PLAYER_O; 
    let lastMove = { r: null, c: null };
    let playerXScore = 0;
    let playerOScore = 0;

    // --- Game Initialization ---
    const initializeGame = () => {
        board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        firstPlayer = (firstPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;
        currentPlayer = firstPlayer;
        movesMade = 0;
        gameOver = false;
        lastMove = { r: null, c: null };
        gameMode = gameModeSelect.value;
        difficulty = difficultyLevelSelect.value;
        
        difficultySelector.classList.toggle('hidden', gameMode !== 'pvc');
        winningLineElement.style.display = 'none';
        boardElement.classList.remove('ai-thinking');
        
        updateScoreDisplay();
        updateStatus();
        renderBoard();

        if (!gameOver && gameMode === 'pvc' && currentPlayer === AI_PLAYER) {
            boardElement.classList.add('ai-thinking');
            updateStatus();
            setTimeout(computerMove, 500);
        }
    };

    // --- UI & Rendering ---
    const renderBoard = () => {
        boardElement.innerHTML = '';
        const validMoves = getValidMoves(board, movesMade);
        for (let r = 0; r < BOARD_SIZE; r++) { for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r; cell.dataset.col = c;
            if (board[r][c]) {
                cell.classList.add(board[r][c]); cell.textContent = board[r][c];
            }
             if(r === lastMove.r && c === lastMove.c) {
                cell.classList.add('last-move');
            }
            const isPotentiallyValid = validMoves.some(move => move.r === r && move.c === c);
            if (!gameOver && isPotentiallyValid) {
                cell.classList.add('valid');
                cell.addEventListener('click', handleCellClick);
                if (gameMode === 'pvc' && difficulty === 'easy' && currentPlayer === HUMAN_PLAYER) {
                    cell.classList.add('valid-move-hint');
                }
            }
            boardElement.appendChild(cell);
        }}
    };
    
    // --- CORE GAME LOGIC (Single Source of Truth) ---
    const isOnWall = (r, c) => r === 0 || r === BOARD_SIZE - 1 || c === 0 || c === BOARD_SIZE - 1;

    const isValidMove = (r, c, currentBoard, currentMovesMade) => {
        if (currentBoard[r][c]) return false;
        if (currentMovesMade === 0) return isOnWall(r, c);
        if (isOnWall(r, c)) return true;

        if (r > 0 && currentBoard[r - 1][c]) {
            let pathIsGood = true;
            for (let i = r - 1; i >= 0; i--) { if (!currentBoard[i][c]) { pathIsGood = false; break; } }
            if (pathIsGood) return true;
        }
        if (r < BOARD_SIZE - 1 && currentBoard[r + 1][c]) {
            let pathIsGood = true;
            for (let i = r + 1; i < BOARD_SIZE; i++) { if (!currentBoard[i][c]) { pathIsGood = false; break; } }
            if (pathIsGood) return true;
        }
        if (c > 0 && currentBoard[r][c - 1]) {
            let pathIsGood = true;
            for (let i = c - 1; i >= 0; i--) { if (!currentBoard[r][i]) { pathIsGood = false; break; } }
            if (pathIsGood) return true;
        }
        if (c < BOARD_SIZE - 1 && currentBoard[r][c + 1]) {
            let pathIsGood = true;
            for (let i = c + 1; i < BOARD_SIZE; i++) { if (!currentBoard[r][i]) { pathIsGood = false; break; } }
            if (pathIsGood) return true;
        }
        return false;
    };
    
    const getValidMoves = (currentBoard, currentMovesMade) => {
        const moves = [];
        if (gameOver) return moves;
        for (let r=0;r<BOARD_SIZE;r++) for (let c=0;c<BOARD_SIZE;c++) if(isValidMove(r,c,currentBoard,currentMovesMade)) moves.push({r,c});
        return moves;
    };

    // --- Game Flow & Player Actions ---
    const handleCellClick = (event) => {
        if (gameOver || (gameMode==='pvc' && currentPlayer===AI_PLAYER)) return;
        const r=parseInt(event.target.dataset.row), c=parseInt(event.target.dataset.col);
        if (isValidMove(r, c, board, movesMade)) makeMove(r, c);
    };
    
    const makeMove = (r, c) => {
        if (gameOver) return;
        board[r][c] = currentPlayer;
        movesMade++;
        lastMove = { r, c };

        const winInfo = checkWin(currentPlayer, board);
        if (winInfo) {
            gameOver = true;
            if (currentPlayer === PLAYER_X) playerXScore++; else playerOScore++;
            updateScoreDisplay();
        } else if (getValidMoves(board, movesMade).length === 0) {
            gameOver = true;
        } else {
            currentPlayer = (currentPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;
        }
        
        updateStatus();
        renderBoard(); 
        
        if (winInfo) {
            drawWinningLine(winInfo);
        }

        if (!gameOver && gameMode === 'pvc' && currentPlayer === AI_PLAYER) {
            boardElement.classList.add('ai-thinking');
            updateStatus();
            setTimeout(computerMove, 50);
        }
    };

    // --- AI Brain & Difficulty Dispatcher ---
    const computerMove = () => {
        boardElement.classList.add('ai-thinking');
        setTimeout(() => {
            let bestMove;
            const validMoves = getValidMoves(board, movesMade);
            if(validMoves.length === 0) {
                boardElement.classList.remove('ai-thinking');
                return;
            }

            const difficultySettings = {
                easy:   { depth: 1, strategic: false },
                medium: { depth: 2, strategic: false },
                hard:   { depth: 3, strategic: true },
                expert: { depth: movesMade > 20 ? 4 : 3, strategic: true }
            };
            const setting = difficultySettings[difficulty];

            if (difficulty === 'easy') {
                bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            } else {
                const scoringFunction = setting.strategic ? scorePositionStrategic : scorePositionTactical;
                bestMove = minimax(board, movesMade, setting.depth, -Infinity, Infinity, true, scoringFunction).move;
            }
            
            boardElement.classList.remove('ai-thinking');
            if (bestMove) makeMove(bestMove.r, bestMove.c);
            else if (validMoves.length > 0) makeMove(validMoves[0].r, validMoves[0].c);
        }, 50);
    };

    // --- AI Scoring Functions ---
    const scorePositionTactical = (currentBoard, player) => {
        let score = 0;
        const opponent = player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER;
        for (let r=0; r<8; r++) { for (let c=0; c<8; c++) {
            [[0,1],[1,0],[1,1],[1,-1]].forEach(([dr,dc]) => {
                if(r+3*dr<8 && r+3*dr>=0 && c+3*dc<8 && c+3*dc>=0) {
                    const w = [currentBoard[r][c], currentBoard[r+dr][c+dc], currentBoard[r+2*dr][c+2*dc], currentBoard[r+3*dr][c+3*dc]];
                    const pC=w.filter(p=>p===player).length, oC=w.filter(p=>p===opponent).length, eC=w.filter(p=>p===null).length;
                    if(pC===4) score+=100000; else if(pC===3&&eC===1) score+=100; else if(pC===2&&eC===2) score+=10;
                    if(oC===3&&eC===1) score-=800;
                }
            });
        }}
        return score;
    };
    const scorePositionStrategic = (currentBoard, player) => {
        let score = scorePositionTactical(currentBoard, player);
        const opponent = player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER;
        for(let r=0;r<8;r++) for(let c=0;c<8;c++) {
            if(currentBoard[r][c]===player) score += POSITIONAL_VALUE_MAP[r][c];
            else if(currentBoard[r][c]===opponent) score -= POSITIONAL_VALUE_MAP[r][c];
        }
        return score;
    };

    const minimax = (currentBoard, currentMovesMade, depth, alpha, beta, maximizingPlayer, scoringFunction) => {
        const validMoves = getValidMoves(currentBoard, currentMovesMade);
        const isTerminal = checkWin(AI_PLAYER, currentBoard) || checkWin(HUMAN_PLAYER, currentBoard) || depth === 0 || validMoves.length === 0;

        if (isTerminal) {
            if (checkWin(AI_PLAYER, currentBoard)) return { score: 100000 + depth * 100 };
            if (checkWin(HUMAN_PLAYER, currentBoard)) return { score: -100000 - depth * 100 };
            return { score: scoringFunction(currentBoard, AI_PLAYER) };
        }

        let bestMove = validMoves[0];
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of validMoves) {
                const newBoard = currentBoard.map(r=>[...r]); newBoard[move.r][move.c] = AI_PLAYER;
                const { score } = minimax(newBoard, currentMovesMade + 1, depth - 1, alpha, beta, false, scoringFunction);
                if (score > maxEval) { maxEval = score; bestMove = move; }
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
            return { score: maxEval, move: bestMove };
        } else { // Minimizing player
            let minEval = Infinity;
            for (const move of validMoves) {
                const newBoard = currentBoard.map(r=>[...r]); newBoard[move.r][move.c] = HUMAN_PLAYER;
                const { score } = minimax(newBoard, currentMovesMade + 1, depth - 1, alpha, beta, true, scoringFunction);
                if (score < minEval) { minEval = score; bestMove = move; }
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
            return { score: minEval, move: bestMove };
        }
    };

    // --- Win Checking and UI Updates ---
    const checkWin = (player, currentBoard) => {
        for (let r=0;r<8;r++) { for (let c=0;c<8;c++) {
            if (c + 3 < 8 && [0,1,2,3].every(i=>currentBoard[r][c+i]===player)) return Array(4).fill(null).map((_,i)=>({r,c:c+i}));
            if (r + 3 < 8 && [0,1,2,3].every(i=>currentBoard[r+i][c]===player)) return Array(4).fill(null).map((_,i)=>({r:r+i,c}));
            if (r + 3 < 8&&c + 3 < 8 && [0,1,2,3].every(i=>currentBoard[r+i][c+i]===player)) return Array(4).fill(null).map((_,i)=>({r:r+i,c:c+i}));
            if (r - 3 >= 0&&c + 3 < 8 && [0,1,2,3].every(i=>currentBoard[r-i][c+i]===player)) return Array(4).fill(null).map((_,i)=>({r:r-i,c:c+i}));
        }}
        return null;
    };
    
    const drawWinningLine = (line) => {
        const firstCellElement = boardElement.querySelector(`[data-row='${line[0].r}'][data-col='${line[0].c}']`);
        const lastCellElement = boardElement.querySelector(`[data-row='${line[3].r}'][data-col='${line[3].c}']`);
        if (!firstCellElement || !lastCellElement) return;
        const boardRect = boardElement.getBoundingClientRect();
        const startRect = firstCellElement.getBoundingClientRect();
        const endRect = lastCellElement.getBoundingClientRect();
        const startX = startRect.left + startRect.width / 2 - boardRect.left;
        const startY = startRect.top + startRect.height / 2 - boardRect.top;
        const endX = endRect.left + endRect.width / 2 - boardRect.left;
        const endY = endRect.top + endRect.height / 2 - boardRect.top;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const ang = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        winningLineElement.style.cssText = `width:${len}px; left:${startX}px; top:${startY}px; transform:rotate(${ang}deg); display:block;`;
    };

    const updateScoreDisplay = () => {
        playerXScoreEl.textContent = playerXScore;
        playerOScoreEl.textContent = playerOScore;
    };

    const updateStatus = () => {
        if (gameOver) {
            const winnerInfo = checkWin(PLAYER_X, board) || checkWin(PLAYER_O, board);
            statusText.textContent = winnerInfo ? `Player ${board[winnerInfo[0].r][winnerInfo[0].c]} Wins!` : "It's a Draw!";
        } else {
            if (gameMode === 'pvc' && currentPlayer === AI_PLAYER) {
                statusText.textContent = "Professor Caz is thinking...";
            } else {
                statusText.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }
    };
    
    // --- Event Listeners ---
    resetButton.addEventListener('click', initializeGame);
    gameModeSelect.addEventListener('change', initializeGame);
    difficultyLevelSelect.addEventListener('change', initializeGame);
    
    // --- Start Game ---
    initializeGame();
});
