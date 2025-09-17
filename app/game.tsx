import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/gameStore';
import { useThemeStore, getThemeColors } from '../store/themeStore';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';
import { RotateCcw, ArrowLeft, Undo2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BannerAdComponent from '../components/BannerAdComponent';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type CellProps = {
  index: number;
  value: string | null;
  onPress: (index: number) => void;
  isWinning: boolean;
};

const Cell = React.memo(({ index, value, onPress, isWinning }: CellProps) => {
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = useMemo(
    () => getThemeColors(theme, { primaryColor, secondaryColor, accentColor }),
    [theme, primaryColor, secondaryColor, accentColor]
  );

  // Choose color for X and O
  const cellValueColor =
    value === 'X' ? colors.text : value === 'O' ? colors.accent : colors.text;

  // Animate rotation for winning cells
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isWinning) {
      rotation.value = withTiming(360, { duration: 1000 }, (finished) => {
        if (finished) rotation.value = 0;
      });
    } else {
      rotation.value = 0;
    }
  }, [isWinning, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isWinning ? 1.1 : 1) },
      { rotate: `${isWinning ? rotation.value : 0}deg` },
    ] as any,
    backgroundColor: withTiming(isWinning ? colors.secondary : colors.card),
  }));

  const valueAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(value ? 1 : 0) },
      { rotate: value ? '360deg' : '0deg' },
    ] as any,
    opacity: withSpring(value ? 1 : 0),
  }));

  const handleCellPress = useCallback(() => {
    onPress(index);
  }, [onPress, index]);

  return (
    <TouchableOpacity onPress={handleCellPress} style={styles.cellTouchable}>
      <Animated.View
        style={[
          styles.cell,
          animatedStyle,
          {
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Animated.View style={valueAnimatedStyle}>
          <Animated.View>
            <Text style={[styles.cellText, { color: cellValueColor }]}>
              {value}
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
});

Cell.displayName = 'Cell';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
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
    playerChoice,
  } = useGameStore();
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = useMemo(
    () => getThemeColors(theme, { primaryColor, secondaryColor, accentColor }),
    [theme, primaryColor, secondaryColor, accentColor]
  );
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLandscape = width > height;

  const winningCombination = useMemo(() => {
    if (!winner || winner === 'draw') return [];
    return (
      WINNING_COMBINATIONS.find(
        (line) =>
          board[line[0]] === winner &&
          board[line[1]] === winner &&
          board[line[2]] === winner
      ) || []
    );
  }, [winner, board]);

  const statusText = useMemo(() => {
    if (winner === 'draw') return "It's a draw!";
    if (winner) {
      if (mode === 'single') {
        return `${winner === playerChoice ? 'You' : 'AI'} win${
          winner === playerChoice ? '' : 's'
        }!`;
      }
      return `${winner === 'X' ? playerXName : playerOName} wins!`;
    }
    if (isAIThinking) return "AI's turn";
    if (mode === 'single') {
      // Show 'Your turn' if it's the player's turn, otherwise 'AI's turn'
      if (currentPlayer === playerChoice) {
        return 'Your turn';
      } else {
        return "AI's turn";
      }
    }
    return `${currentPlayer === 'X' ? playerXName : playerOName}'s turn`;
  }, [
    winner,
    currentPlayer,
    isAIThinking,
    playerXName,
    playerOName,
    mode,
    playerChoice,
  ]);

  const handleCellPress = useCallback(
    (index: number) => {
      if (!winner && !isAIThinking) {
        makeMove(index);
      }
    },
    [winner, isAIThinking, makeMove]
  );

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(1.1) },
      { translateY: withSpring(isAIThinking ? 5 : 0) },
    ] as const,
    opacity: withSpring(isAIThinking ? 0.7 : 1),
  }));

  return (
    <>
      <Animated.View
        entering={FadeIn}
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 20,
            gap: 40,
          },
          isLandscape && styles.containerLandscape,
        ]}
      >
        <View style={styles.header}>
          <AnimatedTouchableOpacity
            entering={FadeInLeft.delay(200)}
            onPress={() => router.back()}
            style={[
              styles.button,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <ArrowLeft size={24} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Back
            </Text>
          </AnimatedTouchableOpacity>

          <Animated.View
            entering={FadeInRight.delay(200)}
            style={[
              styles.scoreContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.scoreText, { color: colors.text }]}>
              {mode === 'single'
                ? `${playerXName}: ${scores[mode].X} - AI: ${scores[mode].O}`
                : `${playerXName}: ${scores[mode].X} - ${playerOName}: ${scores[mode].O}`}
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInUp.delay(400)}
          style={statusAnimatedStyle}
        >
          <Text style={[styles.status, { color: colors.text }]}>
            {statusText}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(600)}
          style={styles.boardWrapper}
        >
          <Animated.View
            entering={FadeInUp.delay(700)}
            style={[
              styles.board,
              {
                borderColor: colors.border,
                shadowColor: colors.shadow,
                width: '100%',
                aspectRatio: 1,
              },
            ]}
          >
            {board.map((value, index) => (
              <Cell
                key={index}
                index={index}
                value={value}
                onPress={handleCellPress}
                isWinning={winningCombination.includes(index)}
              />
            ))}
          </Animated.View>
        </Animated.View>

        {winner && (
          <Animated.View
            entering={FadeInUp.delay(800)} // Ensure this has a distinct animation
            style={styles.winnerContainer}
          >
            <AnimatedTouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={resetGame}
            >
              <RotateCcw size={24} color={colors.text} />
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Play Again
              </Text>
            </AnimatedTouchableOpacity>
          </Animated.View>
        )}
        <View style={{ paddingBottom: 10, marginLeft: -20 }}>
          <BannerAdComponent />
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 30,
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
  container: {
    flex: 1,
  },
  containerLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  buttonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
  },
  scoreContainer: {
    padding: 10,
    borderRadius: 30,
    borderWidth: 3,
    ...Platform.select({
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
  scoreText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
  },
  status: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 20,
  },
  boardWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  board: {
    aspectRatio: 1, // Maintain aspect ratio
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cellTouchable: {
    width: '33.333%',
    height: '33.333%',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderRadius: 20,
    margin: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {
        elevation: 2,
      },
    }),
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  cellText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 64,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
});
