import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { useThemeStore, getThemeColors } from '../../store/themeStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Bot as Users1, Users as Users2, Settings as SettingsIcon } from 'lucide-react-native';

export default function Home() {
  const { setMode } = useGameStore();
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = getThemeColors(theme, { primaryColor, secondaryColor, accentColor });

  const handleModeSelect = (mode: 'single' | 'multi') => {
    setMode(mode);
  };

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Tic Tac Toe</Text>

      <View style={styles.buttonsContainer}>
        <Link href="/game" asChild>
          <TouchableOpacity
            style={[styles.button, {
              backgroundColor: colors.primary,
              borderColor: colors.accent,
              borderWidth: 4,
              borderStyle: 'solid',
              shadowColor: colors.shadow
            }]}
            onPress={() => handleModeSelect('single')}
          >
            <View style={styles.buttonContent}>
              <Users1 size={48} color={colors.text} />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Single Player</Text>
                <Text style={[styles.buttonSubtext, { color: colors.text }]}>Play against AI</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.buttonsContainer}>
        <Link href="/game" asChild>
          <TouchableOpacity
            style={[styles.button, {
              backgroundColor: colors.primary,
              borderColor: colors.secondary,
              borderWidth: 4,
              borderStyle: 'solid',
              shadowColor: colors.shadow
            }]}
            onPress={() => handleModeSelect('multi')}
          >
            <View style={[styles.buttonContent, {borderColor: colors.accent}]}>
              <Users2 size={48} color={colors.text} />
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Two Players</Text>
                <Text style={[styles.buttonSubtext, { color: colors.text }]}>Play with a friend</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 48,
    marginBottom: 40,
    transform: [{ rotate: '1deg' }],
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 32,
    padding: 24,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  button: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    opacity: 0.8,
  },
});