import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { useThemeStore, getThemeColors } from '../../store/themeStore';
import Animated, { FadeIn, FadeInUp, FadeInLeft } from 'react-native-reanimated';
import { Bot as Users1, Users as Users2, Settings as SettingsIcon } from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Home() {
  const { setMode } = useGameStore();
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = useMemo(() => getThemeColors(theme, { primaryColor, secondaryColor, accentColor }), [theme, primaryColor, secondaryColor, accentColor]);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleModeSelect = useCallback((mode: 'single' | 'multi') => {
    setMode(mode);
  }, [setMode]);

  return (
    <Animated.View
      entering={FadeIn}
      style={[
        styles.container,
        { backgroundColor: colors.background },
        isLandscape && styles.containerLandscape
      ]}
    >
      <Animated.Text 
        entering={FadeInUp.delay(200)}
        style={[
          styles.title,
          { color: colors.text },
          isLandscape && styles.titleLandscape
        ]}>Tic Tac Toe</Animated.Text>

      <View style={[
        styles.buttonsContainer,
        isLandscape && styles.buttonsContainerLandscape
      ]}>
        <Link href="/game" asChild>
          <AnimatedTouchableOpacity
            entering={FadeInLeft.delay(400)}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                borderColor: colors.accent,
                borderWidth: 4,
                borderStyle: 'solid',
                shadowColor: colors.shadow
              },
              isLandscape && styles.buttonLandscape
            ]}
            onPress={() => handleModeSelect('single')}
          >
            <View style={styles.buttonContent}>
              <Users1 size={isLandscape ? 36 : 48} color={colors.text} />
              <View style={styles.buttonTextContainer}>
                <Text style={[
                  styles.buttonText,
                  { color: colors.text },
                  isLandscape && styles.buttonTextLandscape
                ]}>Single Player</Text>
                <Text style={[
                  styles.buttonSubtext,
                  { color: colors.text },
                  isLandscape && styles.buttonSubtextLandscape
                ]}>Play against AI</Text>
              </View>
            </View>
          </AnimatedTouchableOpacity>
        </Link>

        <Link href="/game" asChild>
          <AnimatedTouchableOpacity
            entering={FadeInLeft.delay(600)}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                borderColor: colors.secondary,
                borderWidth: 4,
                borderStyle: 'solid',
                shadowColor: colors.shadow
              },
              isLandscape && styles.buttonLandscape
            ]}
            onPress={() => handleModeSelect('multi')}
          >
            <View style={[styles.buttonContent, {borderColor: colors.accent}]}>
              <Users2 size={isLandscape ? 36 : 48} color={colors.text} />
              <View style={styles.buttonTextContainer}>
                <Text style={[
                  styles.buttonText,
                  { color: colors.text },
                  isLandscape && styles.buttonTextLandscape
                ]}>Two Players</Text>
                <Text style={[
                  styles.buttonSubtext,
                  { color: colors.text },
                  isLandscape && styles.buttonSubtextLandscape
                ]}>Play with a friend</Text>
              </View>
            </View>
          </AnimatedTouchableOpacity>
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
  containerLandscape: {
    // Add landscape-specific styles here
  },
  titleLandscape: {
    // Add landscape-specific styles here
  },
  buttonsContainerLandscape: {
    // Add landscape-specific styles here
  },
  buttonLandscape: {
    // Add landscape-specific styles here
  },
  buttonTextLandscape: {
    // Add landscape-specific styles here
  },
  buttonSubtextLandscape: {
    // Add landscape-specific styles here
  },
});