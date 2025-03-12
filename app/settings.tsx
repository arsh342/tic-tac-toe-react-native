import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

export default function Settings() {
  const router = useRouter();
  const { difficulty, setDifficulty, resetScores } = useGameStore();

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ] as const;

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
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Difficulty</Text>
        <View style={styles.difficultyButtons}>
          {difficulties.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.difficultyButton,
                difficulty === value && styles.selectedDifficulty
              ]}
              onPress={() => setDifficulty(value)}
            >
              <Text style={[
                styles.difficultyButtonText,
                difficulty === value && styles.selectedDifficultyText
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.resetButton}
        onPress={resetScores}
      >
        <Trash2 size={24} color="#000" />
        <Text style={styles.resetButtonText}>Reset Scores</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    marginLeft: 10,
    color: '#000000',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    marginBottom: 15,
    color: '#000000',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000000',
    alignItems: 'center',
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
  selectedDifficulty: {
    backgroundColor: '#FFE156',
    transform: [{ rotate: '-1deg' }],
  },
  difficultyButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: '#000000',
  },
  selectedDifficultyText: {
    color: '#000000',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF90E8',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000000',
    gap: 10,
    transform: [{ rotate: '1deg' }],
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