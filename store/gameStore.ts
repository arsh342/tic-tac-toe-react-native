import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type GameMode = 'single' | 'multi';
type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];

interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  scores: { X: number; O: number };
  moveHistory: number[];
  isAIThinking: boolean;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  makeMove: (index: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  resetScores: () => void;
}

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

const initialBoard = Array(9).fill(null);

const checkWinner = (board: Board): Player | 'draw' | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }

  if (board.every(cell => cell !== null)) {
    return 'draw';
  }

  return null;
};

const findThreats = (board: Board, player: Player): number[] => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const threats: number[] = [];

  for (const [a, b, c] of lines) {
    const line = [board[a], board[b], board[c]];
    const playerCount = line.filter(cell => cell === player).length;
    const nullCount = line.filter(cell => cell === null).length;

    if (playerCount === 2 && nullCount === 1) {
      const emptyIndex = [a, b, c][line.findIndex(cell => cell === null)];
      threats.push(emptyIndex);
    }
  }

  return threats;
};

const evaluatePosition = (board: Board): number => {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (winner === 'draw') return 0;

  const aiThreats = findThreats(board, 'O').length;
  const playerThreats = findThreats(board, 'X').length;

  return aiThreats - playerThreats;
};

const minimax = (board: Board, depth: number, isMax: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
  const score = evaluatePosition(board);
  
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (board.every(cell => cell !== null)) return 0;

  if (isMax) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
};

const getStrategicMove = (board: Board): number => {
  // Check for immediate win
  const aiThreats = findThreats(board, 'O');
  if (aiThreats.length > 0) return aiThreats[0];

  // Block player's winning move
  const playerThreats = findThreats(board, 'X');
  if (playerThreats.length > 0) return playerThreats[0];

  // Take center if available
  if (board[4] === null) return 4;

  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available side
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(i => board[i] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }

  // Fallback to first available move
  return board.findIndex(cell => cell === null);
};

const getAIMove = (board: Board, difficulty: Difficulty): number => {
  const availableMoves = board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
  
  if (difficulty === 'easy') {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  if (difficulty === 'medium') {
    return Math.random() > 0.5 ? 
      getStrategicMove(board) : 
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = 'O';
    const score = minimax(board, 0, false);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'single',
  difficulty: 'medium',
  board: [...initialBoard],
  currentPlayer: 'X',
  winner: null,
  scores: { X: 0, O: 0 },
  moveHistory: [],
  isAIThinking: false,

  setMode: (mode) => set({ mode }),
  setDifficulty: (difficulty) => set({ difficulty }),

  makeMove: async (index) => {
    const state = get();
    const { board, currentPlayer, mode, difficulty } = state;

    if (board[index] || state.winner || state.isAIThinking) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    triggerHaptic();

    const winner = checkWinner(newBoard);
    if (winner) {
      const newScores = { ...state.scores };
      if (winner !== 'draw') {
        newScores[winner]++;
      }
      set({ board: newBoard, winner, scores: newScores, moveHistory: [...state.moveHistory, index] });
      return;
    }

    if (mode === 'single' && currentPlayer === 'X') {
      set({ 
        board: newBoard,
        currentPlayer: 'O',
        moveHistory: [...state.moveHistory, index],
        isAIThinking: true
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const aiMove = getAIMove(newBoard, difficulty);
      newBoard[aiMove] = 'O';
      
      triggerHaptic();

      const aiWinner = checkWinner(newBoard);
      if (aiWinner) {
        const newScores = { ...state.scores };
        if (aiWinner !== 'draw') {
          newScores[aiWinner]++;
        }
        set({ 
          board: newBoard,
          winner: aiWinner,
          scores: newScores,
          moveHistory: [...state.moveHistory, index, aiMove],
          isAIThinking: false
        });
        return;
      }

      set({ 
        board: newBoard,
        currentPlayer: 'X',
        moveHistory: [...state.moveHistory, index, aiMove],
        isAIThinking: false
      });
    } else {
      set({
        board: newBoard,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
        moveHistory: [...state.moveHistory, index]
      });
    }
  },

  undoMove: () => {
    const state = get();
    if (state.mode !== 'single' || state.moveHistory.length === 0) return;

    const newHistory = [...state.moveHistory];
    const lastMove = newHistory.pop();
    const lastAIMove = newHistory.pop();

    if (lastMove === undefined) return;

    const newBoard = [...state.board];
    newBoard[lastMove] = null;
    if (lastAIMove !== undefined) {
      newBoard[lastAIMove] = null;
    }

    set({
      board: newBoard,
      currentPlayer: 'X',
      winner: null,
      moveHistory: newHistory
    });
  },

  resetGame: () => set(state => ({
    board: [...initialBoard],
    currentPlayer: 'X',
    winner: null,
    moveHistory: []
  })),

  resetScores: () => set({ scores: { X: 0, O: 0 } })
}));