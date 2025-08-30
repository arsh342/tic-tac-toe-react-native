import { create } from 'zustand';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Sound from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type GameMode = 'single' | 'multi';
type Difficulty = 'easy' | 'hard';
type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];
type Coordinate = 'A1' | 'A2' | 'A3' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3';

interface Move {
  player: Player;
  position: number;
  timestamp: number;
}

interface GameHistory {
  mode: GameMode;
  playerXName: string;
  playerOName: string;
  playerChoice: Player;
  winner: Player | 'draw';
  moves: Move[];
  timestamp: number;
}

interface Scores {
  single: { X: number; O: number };
  multi: { X: number; O: number };
}

interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  scores: Scores;
  moveHistory: Move[];
  isAIThinking: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  playerChoice: Player;
  playerXName: string;
  playerOName: string;
  gameHistory: GameHistory[];
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  makeMove: (index: number) => void;
  undoMove: () => void;
  resetGame: () => void;
  resetScores: () => void;
  toggleSound: () => void;
  setPlayerChoice: (choice: Player) => void;
  setPlayerXName: (name: string) => void;
  setPlayerOName: (name: string) => void;
  deleteHistoryItem: (index: number) => void;
  initialize: () => Promise<void>;
  updateScores: (winner: Player | 'draw') => void;
}

// Constants
const STORAGE_KEYS = {
  SCORES: 'tic_tac_toe_scores',
  HISTORY: 'tic_tac_toe_history',
  NAMES: 'tic_tac_toe_names',
  SOUND: 'tic_tac_toe_sound',
} as const;

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
] as const;

const SOUNDS = {
  move: require('../assets/sounds/move.mp3'),
  victory: require('../assets/sounds/victory.mp3'),
  defeat: require('../assets/sounds/defeat.mp3'),
  draw: require('../assets/sounds/draw.mp3'),
} as const;

const INITIAL_BOARD = Array(9).fill(null) as Board;

// Storage helpers
const storageHelpers = {
  async saveScores(scores: Scores): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
    } catch (e) {
      console.error('Failed to save scores:', e);
    }
  },
  async loadScores(): Promise<Scores | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SCORES);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to load scores:', e);
      return null;
    }
  },
  async saveHistory(history: GameHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  },
  async loadHistory(): Promise<GameHistory[] | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to load history:', e);
      return null;
    }
  },
  async saveNames(playerXName: string, playerOName: string): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.NAMES,
        JSON.stringify({ playerXName, playerOName })
      );
    } catch (e) {
      console.error('Failed to save names:', e);
    }
  },
  async loadNames(): Promise<{
    playerXName: string;
    playerOName: string;
  } | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NAMES);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to load names:', e);
      return null;
    }
  },
  async saveSoundEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(enabled));
    } catch (e) {
      console.error('Failed to save sound enabled state:', e);
    }
  },
  async loadSoundEnabled(): Promise<boolean | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SOUND);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to load sound enabled state:', e);
      return null;
    }
  },
};

// Game logic helpers
const gameHelpers = {
  checkWinner(board: Board): Player | 'draw' | null {
    for (const [a, b, c] of WINNING_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player;
      }
    }
    return board.every((cell) => cell !== null) ? 'draw' : null;
  },

  findThreats(board: Board, player: Player): number[] {
    const threats: number[] = [];
    for (const [a, b, c] of WINNING_LINES) {
      const line = [board[a], board[b], board[c]];
      const playerCount = line.filter((cell) => cell === player).length;
      const nullCount = line.filter((cell) => cell === null).length;
      if (playerCount === 2 && nullCount === 1) {
        const emptyIndex = [a, b, c][line.findIndex((cell) => cell === null)];
        threats.push(emptyIndex);
      }
    }
    return threats;
  },

  evaluatePosition(board: Board): number {
    const winner = this.checkWinner(board);
    if (winner === 'O') return 10;
    if (winner === 'X') return -10;
    if (winner === 'draw') return 0;

    const aiThreats = this.findThreats(board, 'O').length;
    const playerThreats = this.findThreats(board, 'X').length;
    return aiThreats - playerThreats;
  },

  minimax(
    board: Board,
    depth: number,
    isMax: boolean,
    alpha: number = -Infinity,
    beta: number = Infinity
  ): number {
    const score = this.evaluatePosition(board);
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (board.every((cell) => cell !== null)) return 0;

    if (isMax) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          bestScore = Math.max(
            bestScore,
            this.minimax(board, depth + 1, false, alpha, beta)
          );
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
          bestScore = Math.min(
            bestScore,
            this.minimax(board, depth + 1, true, alpha, beta)
          );
          board[i] = null;
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    }
  },

  getStrategicMove(board: Board): number {
    const aiThreats = this.findThreats(board, 'O');
    if (aiThreats.length > 0) return aiThreats[0];

    const playerThreats = this.findThreats(board, 'X');
    if (playerThreats.length > 0) return playerThreats[0];

    if (board[4] === null) return 4;

    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((i) => board[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter((i) => board[i] === null);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return board.findIndex((cell) => cell === null);
  },

  getAIMove(board: Board, difficulty: Difficulty): number {
    const availableMoves = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((i) => i !== -1);

    if (difficulty === 'easy') {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Hard mode: add randomness to best moves
    let bestScore = -Infinity;
    let bestMoves: number[] = [];

    for (const move of availableMoves) {
      board[move] = 'O';
      const score = this.minimax(board, 0, false);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    // Pick randomly among best moves
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  },
};

// Audio helpers
import { AudioPlayer, createAudioPlayer } from 'expo-audio';

const audioPlayers: Partial<Record<keyof typeof SOUNDS, AudioPlayer>> = {};

const audioHelpers = {
  async playSound(
    soundType: keyof typeof SOUNDS,
    enabled: boolean
  ): Promise<void> {
    if (!enabled || Platform.OS === 'web') return;
    try {
      // Create AudioPlayer if not already created
      if (!audioPlayers[soundType]) {
        audioPlayers[soundType] = createAudioPlayer(SOUNDS[soundType]);
      }
      const player = audioPlayers[soundType]!;
      // If already at end, seek to start
      if (player.currentTime >= player.duration) {
        await player.seekTo(0);
      }
      player.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  },

  triggerHaptic(type: 'move' | 'win' | 'draw' | 'error' = 'move'): void {
    if (Platform.OS === 'web') return;

    const hapticMap = {
      move: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      win: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
      draw: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
      error: () =>
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    };

    hapticMap[type]();
  },
};

// Store creation
export const useGameStore = create<GameState>((set, get) => {
  // ...existing code...
  // Async initialization for persisted state
  (async () => {
    const [savedScores, savedHistory] = await Promise.all([
      storageHelpers.loadScores(),
      storageHelpers.loadHistory(),
    ]);
    if (savedScores) set({ scores: savedScores });
    if (savedHistory) set({ gameHistory: savedHistory });
  })();
  return {
    mode: 'single',
    difficulty: 'hard',
    board: [...INITIAL_BOARD],
    currentPlayer: 'X',
    winner: null,
    scores: { single: { X: 0, O: 0 }, multi: { X: 0, O: 0 } },
    moveHistory: [],
    isAIThinking: false,
    soundEnabled: true,
    soundVolume: 1,
    playerChoice: 'X',
    playerXName: 'X',
    playerOName: 'O',
    gameHistory: [], // will be replaced by loaded history if present
    deleteHistoryItem: (index: number) => {
      const currentHistory = get().gameHistory;
      const match = currentHistory[index];
      const newHistory = currentHistory.filter((_, i) => i !== index);
      // Update scores by removing the winner of the deleted match
      let newScores = { ...get().scores };
      if (match && match.winner !== 'draw') {
        newScores[match.mode][match.winner] = Math.max(
          0,
          newScores[match.mode][match.winner] - 1
        );
      }
      // If all history is deleted, reset scores
      if (newHistory.length === 0) {
        newScores = { single: { X: 0, O: 0 }, multi: { X: 0, O: 0 } };
      }
      set({ gameHistory: newHistory, scores: newScores });
      storageHelpers.saveHistory(newHistory);
      storageHelpers.saveScores(newScores);
    },
    updateScores: (winner: Player | 'draw') => {
      const state = get();
      const newScores = { ...state.scores };
      if (winner !== 'draw') {
        newScores[state.mode][winner] += 1;
      }
      // Force new object reference for zustand reactivity
      set({
        scores: {
          single: { ...newScores.single },
          multi: { ...newScores.multi },
        },
      });
      storageHelpers.saveScores(newScores);
    },
    setMode: (mode: GameMode) => {
      set((state) => {
        const newBoard = [...INITIAL_BOARD];
        const newMoveHistory: Move[] = [];
        const newState = {
          mode,
          board: newBoard,
          currentPlayer: 'X' as Player,
          winner: null,
          moveHistory: newMoveHistory,
          isAIThinking: false,
          playerChoice: state.playerChoice,
        };
        if (mode === 'single' && state.playerChoice === 'O') {
          const aiMoveIndex = gameHelpers.getAIMove(newBoard, state.difficulty);
          if (aiMoveIndex !== -1) {
            newBoard[aiMoveIndex] = 'X';
            newMoveHistory.push({
              player: 'X',
              position: aiMoveIndex,
              timestamp: Date.now(),
            });
            newState.board = newBoard;
            newState.moveHistory = newMoveHistory;
            newState.currentPlayer = 'O';
          }
        }
        return newState;
      });
    },
    setDifficulty: (difficulty) => set({ difficulty }),
    toggleSound: () =>
      set((state) => {
        const newState = { soundEnabled: !state.soundEnabled };
        storageHelpers.saveSoundEnabled(newState.soundEnabled);
        return newState;
      }),
    setPlayerChoice: (choice) => set({ playerChoice: choice }),
    setPlayerXName: (name) => {
      set({ playerXName: name });
      storageHelpers.saveNames(name, get().playerOName);
    },
    setPlayerOName: (name) => {
      set({ playerOName: name });
      storageHelpers.saveNames(get().playerXName, name);
    },
    makeMove: (index: number) => {
      const state = get();
      if (state.board[index] || state.winner || state.isAIThinking) {
        audioHelpers.triggerHaptic('error');
        return;
      }
      const newBoard = [...state.board];
      newBoard[index] = state.currentPlayer;
      const newMoveHistory = [
        ...state.moveHistory,
        {
          player: state.currentPlayer,
          position: index,
          timestamp: Date.now(),
        },
      ];
      const winner = gameHelpers.checkWinner(newBoard);
      const isDraw = !winner && newBoard.every((cell) => cell !== null);
      if (winner || isDraw) {
        if (winner) {
          audioHelpers.triggerHaptic('win');
          audioHelpers.playSound(
            winner === state.playerChoice ? 'victory' : 'defeat',
            state.soundEnabled
          );
        } else if (isDraw) {
          audioHelpers.triggerHaptic('draw');
          audioHelpers.playSound('draw', state.soundEnabled);
        }
        get().updateScores(winner || 'draw');
        const gameHistory = [
          ...state.gameHistory,
          {
            mode: state.mode,
            playerXName: state.playerXName,
            playerOName: state.playerOName,
            playerChoice: state.playerChoice,
            winner: winner || 'draw',
            moves: newMoveHistory,
            timestamp: Date.now(),
          },
        ];
        set({
          board: newBoard,
          winner: winner || 'draw',
          moveHistory: newMoveHistory,
          gameHistory,
        });
        storageHelpers.saveHistory(gameHistory);
        return;
      }
      audioHelpers.triggerHaptic('move');
      audioHelpers.playSound('move', state.soundEnabled);
      set({
        board: newBoard,
        currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
        moveHistory: newMoveHistory,
      });
      const isAITurn =
        state.mode === 'single' &&
        ((state.playerChoice === 'X' && get().currentPlayer === 'O') ||
          (state.playerChoice === 'O' && get().currentPlayer === 'X'));
      if (isAITurn) {
        set({ isAIThinking: true });
        setTimeout(() => {
          const aiMove = gameHelpers.getAIMove(get().board, get().difficulty);
          if (
            aiMove !== null &&
            aiMove !== -1 &&
            get().board[aiMove] === null &&
            !get().winner
          ) {
            const currentAIState = get();
            const aiNewBoard = [...currentAIState.board];
            const aiPlayer: Player = currentAIState.currentPlayer;
            aiNewBoard[aiMove] = aiPlayer;
            const aiNewMoveHistory = [
              ...currentAIState.moveHistory,
              {
                player: aiPlayer,
                position: aiMove,
                timestamp: Date.now(),
              },
            ];
            const aiWinner = gameHelpers.checkWinner(aiNewBoard);
            const aiIsDraw =
              !aiWinner && aiNewBoard.every((cell) => cell !== null);
            if (aiWinner || aiIsDraw) {
              if (aiWinner) {
                audioHelpers.triggerHaptic('win');
                audioHelpers.playSound(
                  aiWinner === currentAIState.playerChoice
                    ? 'victory'
                    : 'defeat',
                  currentAIState.soundEnabled
                );
              } else if (aiIsDraw) {
                audioHelpers.triggerHaptic('draw');
                audioHelpers.playSound('draw', currentAIState.soundEnabled);
              }
              get().updateScores(aiWinner || 'draw');
              const gameHistory = [
                ...currentAIState.gameHistory,
                {
                  mode: currentAIState.mode,
                  playerXName: currentAIState.playerXName,
                  playerOName: currentAIState.playerOName,
                  playerChoice: currentAIState.playerChoice,
                  winner: aiWinner || 'draw',
                  moves: aiNewMoveHistory,
                  timestamp: Date.now(),
                },
              ];
              set({
                board: aiNewBoard,
                winner: aiWinner || 'draw',
                moveHistory: aiNewMoveHistory,
                gameHistory,
                isAIThinking: false,
              });
              storageHelpers.saveHistory(gameHistory);
            } else {
              set({
                board: aiNewBoard,
                currentPlayer: currentAIState.playerChoice,
                moveHistory: aiNewMoveHistory,
                isAIThinking: false,
              });
            }
          } else {
            set({ isAIThinking: false });
          }
        }, 500);
      }
    },
    undoMove: () => {
      const state = get();
      if (state.mode !== 'single' || state.moveHistory.length === 0) return;
      const newHistory = [...state.moveHistory];
      newHistory.pop();
      newHistory.pop();
      const newBoard = [...INITIAL_BOARD];
      newHistory.forEach((move) => {
        newBoard[move.position] = move.player;
      });
      set({
        board: newBoard,
        currentPlayer: state.playerChoice,
        winner: null,
        moveHistory: newHistory,
      });
    },
    resetGame: () => {
      set({
        board: [...INITIAL_BOARD],
        currentPlayer: get().playerChoice,
        winner: null,
        moveHistory: [],
      });
    },
    resetScores: () => {
      const newScores = { single: { X: 0, O: 0 }, multi: { X: 0, O: 0 } };
      set({ scores: newScores });
      storageHelpers.saveScores(newScores);
      set({ gameHistory: [] });
      storageHelpers.saveHistory([]);
    },
    initialize: async () => {
      const [savedScores, savedHistory, savedNames, savedSoundEnabled] =
        await Promise.all([
          storageHelpers.loadScores(),
          storageHelpers.loadHistory(),
          storageHelpers.loadNames(),
          storageHelpers.loadSoundEnabled(),
        ]);
      const updates: Partial<GameState> = {};
      if (savedScores) updates.scores = savedScores;
      if (savedHistory) updates.gameHistory = savedHistory;
      if (savedNames) {
        updates.playerXName = savedNames.playerXName;
        updates.playerOName = savedNames.playerOName;
      }
      if (savedSoundEnabled !== null) updates.soundEnabled = savedSoundEnabled;
      set(updates);
    },
  };
});
