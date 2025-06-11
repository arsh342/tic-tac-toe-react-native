import { Tabs } from 'expo-router';
import { Swords, Trophy, Settings as SettingsIcon } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { useThemeStore, getThemeColors } from '../../store/themeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = getThemeColors(theme, { primaryColor, secondaryColor, accentColor });
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { 
            backgroundColor: Platform.select({
              ios: 'transparent',
              android: colors.background,
              default: colors.background,
            }),
            borderTopColor: colors.border,
            paddingBottom: insets.bottom,
          },
        ],
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} style={StyleSheet.absoluteFill} />
          ) : undefined,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ size, color }) => (
            <Swords size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ size, color }) => (
            <Trophy size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <SettingsIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    padding:4,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.8)',
      android: 'rgba(255, 255, 255, 0.8)',
      default: 'rgba(255, 255, 255, 0.8)',
    }),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0)',
    height: 60,
  },
});