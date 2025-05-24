import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/gameStore';
import { useThemeStore, getThemeColors } from '../store/themeStore';
import Animated, { 
  FadeIn,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  SharedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { RotateCcw, ArrowLeft, Undo2 } from 'lucide-react-native';

type CellProps = {
  index: number;
  value: string | null;
  onPress: () => void;
  isWinning: boolean;
};

const Cell = React.memo(({ index, value, onPress, isWinning }: CellProps) => {
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = getThemeColors(theme, { primaryColor, secondaryColor, accentColor });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isWinning ? 1.1 : 1) },
      { rotate: withSpring(isWinning ? '5deg' : '0deg') }
    ] as const,
    backgroundColor: withTiming(isWinning ? colors.secondary : colors.card),
  }));

  const valueAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(value ? 1 : 0) },
      { rotate: withSpring(value ? '360deg' : '0deg') }
    ] as const,
    opacity: withSpring(value ? 1 : 0),
  }));

  return (
    <TouchableOpacity onPress={onPress} style={styles.cellTouchable}>
      <Animated.View style={[styles.cell, animatedStyle, { 
        borderColor: colors.border,
        shadowColor: colors.shadow
      }]}>
        <Animated.Text style={[
          styles.cellText,
          valueAnimatedStyle,
          { color: colors.text }
        ]}>
          {value}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

Cell.displayName = 'Cell';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
] as const;

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
    isAIThinking,
    moveHistory,
    playerXName,
    playerOName,
    playerChoice
  } = useGameStore();
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = getThemeColors(theme, { primaryColor, secondaryColor, accentColor });

  const winningCombination = useMemo(() => {
    if (!winner || winner === 'draw') return [];
    return WINNING_COMBINATIONS.find(line => 
      board[line[0]] === winner && 
      board[line[1]] === winner && 
      board[line[2]] === winner
    ) || [];
  }, [winner, board]);

  const statusText = useMemo(() => {
    if (winner === 'draw') return "It's a draw!";
    if (winner) {
      if (mode === 'single') {
        return `${winner === playerChoice ? playerXName : 'AI'} wins!`;
      }
      return `${winner === 'X' ? playerXName : playerOName} wins!`;
    }
    if (isAIThinking) return "AI is thinking...";
    if (mode === 'single') {
      return `${currentPlayer === playerChoice ? playerXName : 'AI'}'s turn`;
    }
    return `${currentPlayer === 'X' ? playerXName : playerOName}'s turn`;
  }, [winner, currentPlayer, isAIThinking, playerXName, playerOName, mode, playerChoice]);

  const handleCellPress = useCallback((index: number) => {
    if (!winner && !isAIThinking) {
      makeMove(index);
    }
  }, [winner, isAIThinking, makeMove]);

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(1.1) },
      { translateY: withSpring(isAIThinking ? 5 : 0) }
    ] as const,
    opacity: withSpring(isAIThinking ? 0.7 : 1),
  }));

  const renderMoveLog = useCallback(({ item, index }: { item: typeof moveHistory[0], index: number }) => (
    <Text key={index} style={[styles.logEntry, { color: colors.text }]}>
      {mode === 'single'
        ? `${item.player === playerChoice ? playerXName : 'AI'} at ${item.position}`
        : `${item.player === 'X' ? playerXName : playerOName} at ${item.position}`
      }
    </Text>
  ), [mode, playerChoice, playerXName, playerOName, colors.text]);

  return (
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.button, { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow
          }]}>
          <ArrowLeft size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        
        <View style={[styles.scoreContainer, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow
        }]}>
          <Text style={[styles.scoreText, { color: colors.text }]}>
            {mode === 'single' 
              ? `${playerXName}: ${scores[mode].X} - AI: ${scores[mode].O}`
              : `${playerXName}: ${scores[mode].X} - ${playerOName}: ${scores[mode].O}`
            }
          </Text>
        </View>
      </View>

      <Animated.Text style={[styles.status, statusAnimatedStyle, { color: colors.text }]}>
        {statusText}
      </Animated.Text>

      <View style={styles.boardWrapper}>
        <View style={[styles.board, { 
          borderColor: colors.border,
          shadowColor: colors.shadow
        }]}>
          {board.map((value, index) => (
            <Cell
              key={index}
              index={index}
              value={value}
              onPress={() => handleCellPress(index)}
              isWinning={winningCombination.includes(index)} />
          ))}
        </View>
      </View>

      <FlatList
        style={[styles.logContainer, { borderColor: colors.border }]}
        data={moveHistory}
        renderItem={renderMoveLog}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={() => (
          <Text style={[styles.logTitle, { color: colors.text }]}>Move Log</Text>
        )}
      />

      {winner && (
        <Animated.View 
          entering={FadeIn}
          style={styles.winnerContainer}>
          <TouchableOpacity 
            style={[styles.button, { 
              backgroundColor: colors.primary,
              borderColor: colors.border,
              shadowColor: colors.shadow
            }]}
            onPress={resetGame}>
            <RotateCcw size={24} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Play Again</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 3,
    gap: 5,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {
        elevation: 4,
      },
    }),
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  buttonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  scoreContainer: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 3,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  scoreText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
  },
  status: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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
    borderRadius: 12,
    borderWidth: 3,
    padding: 10,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
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
    borderRadius: 12,
    margin: 5,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {
        elevation: 4,
      },
    }),
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
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  winnerContainer: {
    marginTop: 20,
  },
  logContainer: {
    flex: 1,
    marginTop: 20,
    padding: 10,
    borderWidth: 3,
    borderRadius: 12,
  },
  logTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    marginBottom: 10,
  },
  logEntry: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    marginBottom: 5,
  },
});

