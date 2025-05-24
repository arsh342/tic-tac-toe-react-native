import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useGameStore } from '../store/gameStore';

export default React.memo(function SoundToggle() {
  const { soundEnabled, toggleSound } = useGameStore();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={toggleSound}
    >
      {soundEnabled ? (
        <Volume2 size={24} color="#000" />
      ) : (
        <VolumeX size={24} color="#000" />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFE156',
    padding: 10,
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
});