import { Tabs } from 'expo-router';
import { Swords, Trophy, Settings as SettingsIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet } from 'react-native';
import { useThemeStore, getThemeColors } from '../../store/themeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { theme, primaryColor, secondaryColor, accentColor } = useThemeStore();
  const colors = getThemeColors(theme, {
    primaryColor,
    secondaryColor,
    accentColor,
  });
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.card, // solid at the bottom, theme-aware
            borderTopColor: colors.border,
            borderTopWidth: 0,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 24,
            paddingBottom: insets.bottom,
          },
        ],
        tabBarBackground: () => (
          <LinearGradient
            colors={[
              theme === 'dark'
                ? 'rgba(38,50,56,0.25)'
                : 'rgba(255,255,255,0.25)',
              colors.card,
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ size, color }) => <Swords size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ size, color }) => <Trophy size={size} color={color} />,
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
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 0,
    borderTopColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#fff', // fallback, overridden by theme
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
    padding: 4,
  },
});
