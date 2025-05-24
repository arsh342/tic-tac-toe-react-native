import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { X, Circle } from 'lucide-react-native';

export default React.memo(function PlayerChoice() {
  const { playerChoice, setPlayerChoice } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Side</Text>
      <View style={styles.choices}>
        <TouchableOpacity
          style={[styles.choice, playerChoice === 'X' && styles.selected]}
          onPress={() => setPlayerChoice('X')}
        >
          <X size={48} color={playerChoice === 'X' ? '#000' : '#666'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.choice, playerChoice === 'O' && styles.selected]}
          onPress={() => setPlayerChoice('O')}
        >
          <Circle size={48} color={playerChoice === 'O' ? '#000' : '#666'} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#000000',
  },
  choices: {
    flexDirection: 'row',
    gap: 20,
  },
  choice: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000000',
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
  selected: {
    backgroundColor: '#FFE156',
  },
});