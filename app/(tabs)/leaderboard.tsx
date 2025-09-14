import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useGameStore } from '../../store/gameStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useThemeStore, getThemeColors } from '../../store/themeStore';
import BannerAdComponent from '../../components/BannerAdComponent';

const indexToCoordinate = (index: number): string => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return `${String.fromCharCode(65 + row)}${col + 1}`;
};

export default function Leaderboard() {
  const { scores, gameHistory, deleteHistoryItem } = useGameStore();
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = getThemeColors(theme, {
    primaryColor,
    secondaryColor,
    accentColor,
  });

  // Track expanded state for each history card by index
  const [expandedIndices, setExpandedIndices] = useState<
    Record<number, boolean>
  >({});
  const toggleExpanded = (index: number) => {
    setExpandedIndices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const renderScores = () => {
    return (
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Scores
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View
            style={[styles.cardHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Single Player
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreText, { color: colors.text }]}>
              X: {scores.single.X}
            </Text>
            <Text style={[styles.scoreText, { color: colors.text }]}>
              O: {scores.single.O}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View
            style={[styles.cardHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Multi Player
            </Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreText, { color: colors.text }]}>
              X: {scores.multi.X}
            </Text>
            <Text style={[styles.scoreText, { color: colors.text }]}>
              O: {scores.multi.O}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHistoryItem = ({ item, index }) => {
    const expanded = !!expandedIndices[index];
    return (
      <View
        style={[
          styles.historyItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <View style={styles.deleteButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              {
                borderColor: colors.accent,
                backgroundColor: colors.background,
              },
            ]}
            onPress={() => deleteHistoryItem(index)}
          >
            <Text
              style={{
                color: colors.accent,
                fontFamily: 'SpaceGrotesk-Bold',
                fontSize: 16,
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => toggleExpanded(index)}
          style={styles.historyHeader}
        >
          <Text style={[styles.historyText, { color: colors.text }]}>
            {item.mode === 'single'
              ? `${item.playerXName} vs AI`
              : `${item.playerXName} vs ${item.playerOName}`}
          </Text>
          <Text style={[styles.historyText, { color: colors.text }]}>
            {item.winner === 'draw'
              ? "It's a draw!"
              : item.mode === 'single'
              ? `${
                  item.winner === item.playerChoice ? item.playerXName : 'AI'
                } wins!`
              : `${
                  item.winner === 'X' ? item.playerXName : item.playerOName
                } wins!`}
          </Text>
          <Text style={[styles.expandIcon, { opacity: 0 }]}>
            {expanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        {/* Date and Time below header, not inside header row */}
        {item.timestamp && (
          <Text
            style={[styles.historyDate, { color: colors.text, opacity: 0.7 }]}
          >
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        )}
        {expanded && (
          <>
            <Text
              style={[
                styles.historyText,
                styles.movesTitle,
                { color: colors.text },
              ]}
            >
              Moves:
            </Text>
            <View style={[styles.movesTable, { borderColor: colors.border }]}>
              <View
                style={[
                  styles.movesHeaderRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.movesHeaderText, { color: colors.text }]}>
                  Player
                </Text>
                <Text style={[styles.movesHeaderText, { color: colors.text }]}>
                  Position
                </Text>
              </View>
              {item.moves.map((move, moveIdx) => {
                const isLast = moveIdx === item.moves.length - 1;
                return (
                  <View
                    key={moveIdx}
                    style={[
                      styles.movesRow,
                      {
                        borderBottomColor: colors.border,
                        borderBottomWidth: isLast ? 0 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.movesCell, { color: colors.text }]}>
                      {move.player === 'X'
                        ? item.playerXName
                        : item.mode === 'single'
                        ? 'AI'
                        : item.playerOName}
                    </Text>
                    <Text style={[styles.movesCell, { color: colors.text }]}>
                      {indexToCoordinate(move.position)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <Text style={[styles.title, { color: colors.text }]}>Leaderboard</Text>
      <View style={{ paddingBottom: 20 }}>
          <BannerAdComponent />
        </View>
      {renderScores()}
      {/* Banner Ad below scores */}
      <BannerAdComponent />

    </>
  );

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={gameHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        extraData={expandedIndices}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deleteButtonWrapper: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  flatList: {
    flex: 1,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    marginTop: 60,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    borderRadius: 30,
    padding: 15,
    borderWidth: 3,
    borderColor: '#263238',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    marginBottom: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#263238',
    overflow: 'hidden',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cardHeader: {
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#263238',
  },
  cardTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  scoreText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 20,
  },
  historyItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 30,
    borderWidth: 3,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  historyText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    marginBottom: 5,
  },
  movesTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  movesTable: {
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 1,
  },
  movesHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  movesHeaderText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  movesRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  movesCell: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  historyDate: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 5,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 0,
    backgroundColor: 'transparent',
  },
  historyHeader: {
    paddingVertical: 8,
    paddingRight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandIcon: {
    fontSize: 18,
    marginLeft: 8,
    color: '#888',
  },
});
