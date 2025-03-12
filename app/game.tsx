import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import Animated, { 
  FadeIn,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { RotateCcw, ArrowLeft, Undo2 } from 'lucide-react-native';

const Cell = ({ index, value, onPress, isWinning }: { 
  index: number;
  value: string | null;
  onPress: () => void;
  isWinning: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isWinning ? 1.1 : 1) },
      { rotate: withSpring(isWinning ? '5deg' : '0deg') }
    ],
    backgroundColor: withTiming(isWinning ? '#90FF9D' : '#ffffff'),
  }));

  return (
    <TouchableOpacity onPress={onPress} style={styles.cellTouchable}>
      <Animated.View style={[styles.cell, animatedStyle]}>
        <Text style={[
          styles.cellText,
          { color: value === 'X' ? '#FF90E8' : '#90FF9D' }
        ]}>
          {value}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function Game() {
  const router = useRouter();
  const { 
    board,
    currentPlayer,
    winner,
    scores,
    mode,
    makeMove,
    resetGame,
    undoMove,
    isAIThinking
  } = useGameStore();

  const winningCombination = React.useMemo(() => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    if (!winner || winner === 'draw') return [];

    return lines.find(line => 
      board[line[0]] === winner && 
      board[line[1]] === winner && 
      board[line[2]] === winner
    ) || [];
  }, [winner, board]);

  const statusText = React.useMemo(() => {
    if (winner === 'draw') return "It's a draw!";
    if (winner) return `${winner} wins!`;
    if (isAIThinking) return "AI is thinking...";
    return `${currentPlayer}'s turn`;
  }, [winner, currentPlayer, isAIThinking]);

  const handleCellPress = (index: number) => {
    if (!winner && !isAIThinking) {
      makeMove(index);
    }
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            X: {scores.X} - O: {scores.O}
          </Text>
        </View>

        {mode === 'single' && (
          <TouchableOpacity 
            onPress={undoMove}
            style={styles.undoButton}
            disabled={isAIThinking}
          >
            <Undo2 size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.status}>{statusText}</Text>

      <View style={styles.boardWrapper}>
        <View style={styles.board}>
          {board.map((value, index) => (
            <Cell
              key={index}
              index={index}
              value={value}
              onPress={() => handleCellPress(index)}
              isWinning={winningCombination.includes(index)}
            />
          ))}
        </View>
      </View>

      {winner && (
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetGame}
        >
          <RotateCcw size={24} color="#000" />
          <Text style={styles.resetButtonText}>Play Again</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 70, // Added padding to move content down
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  undoButton: {
    padding: 10,
  },
  scoreContainer: {
    backgroundColor: '#FFE156',
    padding: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#000000',
    transform: [{ rotate: '-1deg' }],
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  scoreText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: '#000000',
  },
  status: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    aspectRatio: 1,
    maxWidth: 400,
    width: '100%',
  },
  cellTouchable: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 5,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {
        elevation: 4,
      },
    }),
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cellText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 48,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#90FF9D',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000000',
    marginTop: 20,
    alignSelf: 'center',
    gap: 10,
    transform: [{ rotate: '2deg' }],
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  resetButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: '#000000',
  },
});