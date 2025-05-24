import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';

export default React.memo(function GameHistory() {
  const { moveHistory } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Move History</Text>
      <ScrollView style={styles.scrollView}>
        {moveHistory.map((move, index) => (
          <Text key={index} style={styles.moveText}>
            {move.player}: {move.position}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: 200,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
  },
  scrollView: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 3,
    borderColor: '#000000',
  },
  moveText: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
  },
});