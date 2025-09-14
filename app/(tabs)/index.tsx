import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import { useThemeStore, getThemeColors } from '../../store/themeStore';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInLeft,
} from 'react-native-reanimated';
import { User as Users1, UserPlus as Users2 } from 'lucide-react-native';
import BannerAdComponent from '../../components/BannerAdComponent';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function Home() {
  const { setMode } = useGameStore();
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = useMemo(
    () => getThemeColors(theme, { primaryColor, secondaryColor, accentColor }),
    [theme, primaryColor, secondaryColor, accentColor]
  );
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleModeSelect = useCallback(
    (mode: 'single' | 'multi') => {
      setMode(mode);
    },
    [setMode]
  );

  return (
    <>
      <Animated.View
        entering={FadeIn}
        style={[
          styles.container,
          { backgroundColor: colors.background },
          isLandscape && styles.containerLandscape,
        ]}
      >
        <View style={{ paddingBottom: 50 }}>
          <BannerAdComponent />
        </View>
        <Animated.Text
          entering={FadeInUp.delay(200)}
          style={[
            styles.title,
            { color: colors.text },
            isLandscape && styles.titleLandscape,
          ]}
        >
          Tic Tac Toe
        </Animated.Text>
        <View style={{ width: '100%', maxWidth: 400, gap: 24, marginTop: 24 }}>
          <Link href="/game" asChild>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.card,
                borderRadius: 30,
                borderWidth: 2.5,
                borderColor: colors.border,
                paddingVertical: 22,
                paddingHorizontal: 18,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 6,
              }}
              onPress={() => handleModeSelect('single')}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Users1
                  size={40}
                  color={colors.text}
                  style={{ marginRight: 18 }}
                />
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text
                    style={{
                      fontFamily: 'SpaceGrotesk-Bold',
                      fontSize: 22,
                      color: colors.text,
                      marginBottom: 2,
                      textAlign: 'center',
                    }}
                  >
                    Single Player
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SpaceGrotesk-Regular',
                      fontSize: 15,
                      color: colors.text,
                      opacity: 0.7,
                      textAlign: 'center',
                    }}
                  >
                    Play against AI
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/game" asChild>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.card,
                borderRadius: 30,
                borderWidth: 2.5,
                borderColor: colors.border,
                paddingVertical: 22,
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 6,
              }}
              onPress={() => handleModeSelect('multi')}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Users2
                  size={40}
                  color={colors.text}
                  style={{ marginRight: 18 }}
                />
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text
                    style={{
                      fontFamily: 'SpaceGrotesk-Bold',
                      fontSize: 22,
                      color: colors.text,
                      marginBottom: 2,
                      textAlign: 'center',
                    }}
                  >
                    Two Players
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SpaceGrotesk-Regular',
                      fontSize: 15,
                      color: colors.text,
                      opacity: 0.7,
                      textAlign: 'center',
                    }}
                  >
                    Play with a friend
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        {/* Place BannerAdComponent below the main content with bottom padding */}
        <View style={{ paddingTop: 100 }}>
          <BannerAdComponent />
        </View>
      </Animated.View>
    </>
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
