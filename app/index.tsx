import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { TowerControl as GameController, Users as Users2, Settings as SettingsIcon } from 'lucide-react-native';

export default function Home() {
  const { setMode } = useGameStore();

  const handleModeSelect = (mode: 'single' | 'multi') => {
    setMode(mode);
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Text style={styles.title}>Tic Tac Toe</Text>
      
      <View style={styles.buttonsContainer}>
        <Link href="/game" asChild>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleModeSelect('single')}
          >
            <GameController size={32} color="#000" />
            <Text style={styles.buttonText}>Single Player</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/game" asChild>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleModeSelect('multi')}
          >
            <Users2 size={32} color="#000" />
            <Text style={styles.buttonText}>Two Players</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/settings" asChild>
          <TouchableOpacity
            style={styles.button}
          >
            <SettingsIcon size={32} color="#000" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 48,
    marginBottom: 40,
    color: '#000000',
    transform: [{ rotate: '1deg' }],
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 20,
  },
  button: {
    backgroundColor: '#FFE156',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
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
  buttonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#000000',
  },
});