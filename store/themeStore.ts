import { create } from 'zustand';
import { Platform, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type ThemeMode = 'light' | 'dark' | 'system';
type Theme = 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  theme: Theme;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setPrimaryColor: (color: string) => Promise<void>;
  setSecondaryColor: (color: string) => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
}

interface CustomColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Constants
const STORAGE_KEYS = {
  THEME_MODE: '@theme_mode',
  PRIMARY_COLOR: '@primary_color',
  SECONDARY_COLOR: '@secondary_color',
  ACCENT_COLOR: '@accent_color',
} as const;

const DEFAULT_COLORS = {
  light: {
    primary: '#E1F5FE',    // Soft cyan background
    secondary: '#42A5F5',  // Bright sky blue
    accent: '#FF6F61',     // Bright coral red
  },
  dark: {
    primary: '#263238',    // Muted blue-gray
    secondary: '#4FC3F7',  // Bright cyan
    accent: '#FF8A65',     // Bright orange/salmon
  },
} as const;

const BASE_COLORS = {
  light: {
    background: '#FFFFFF', // Crisp white
    text: '#212121',      // Deep gray (almost black)
    border: '#DDDDDD',    // Subtle light gray
    card: '#E1F5FE',      // Soft cyan background
    shadow: 'rgba(0, 0, 0, 0.2)',
  },
  dark: {
    background: '#121212', // Almost black
    text: '#F5F5F5',      // Off-white
    border: '#333333',    // Deep gray
    card: '#263238',      // Even darker blue-gray for card background
    shadow: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

// Helpers
const getSystemTheme = (): Theme => {
  const systemTheme = Appearance.getColorScheme();
  return systemTheme === 'dark' ? 'dark' : 'light';
};

const getInitialThemeState = (): Omit<ThemeState, 'setThemeMode' | 'setPrimaryColor' | 'setSecondaryColor' | 'setAccentColor'> => {
  return {
    themeMode: 'light',
    theme: 'light',
    primaryColor: DEFAULT_COLORS.light.primary,
    secondaryColor: DEFAULT_COLORS.light.secondary,
    accentColor: DEFAULT_COLORS.light.accent,
  };
};

// Storage helpers
const storageHelpers = {
  async saveThemeMode(mode: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  },

  async savePrimaryColor(color: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, color);
    } catch (error) {
      console.error('Error saving primary color:', error);
    }
  },

  async saveSecondaryColor(color: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SECONDARY_COLOR, color);
    } catch (error) {
      console.error('Error saving secondary color:', error);
    }
  },

  async saveAccentColor(color: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, color);
    } catch (error) {
      console.error('Error saving accent color:', error);
    }
  },
};

// Store creation
export const useThemeStore = create<ThemeState>((set, get) => {
  // Initialize with default values
  const initialState = getInitialThemeState();
  set(initialState);
  
  // Load saved preferences
  const loadSavedPreferences = async () => {
    try {
      const [themeMode, primaryColor, secondaryColor, accentColor] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR),
        AsyncStorage.getItem(STORAGE_KEYS.SECONDARY_COLOR),
        AsyncStorage.getItem(STORAGE_KEYS.ACCENT_COLOR),
      ]);

      const effectiveTheme = themeMode === 'system' ? getSystemTheme() : (themeMode as Theme || 'light');
      const themeColors = DEFAULT_COLORS[effectiveTheme];
      
      set({
        themeMode: (themeMode as ThemeMode) || 'system',
        theme: effectiveTheme,
        primaryColor: primaryColor || themeColors.primary,
        secondaryColor: secondaryColor || themeColors.secondary,
        accentColor: accentColor || themeColors.accent,
      });
    } catch (error) {
      console.error('Error loading theme preferences:', error);
      set(initialState);
    }
  };

  // Load preferences on store creation
  loadSavedPreferences();

  // Listen for system theme changes
  Appearance.addChangeListener(({ colorScheme }) => {
    const { themeMode } = get();
    if (themeMode === 'system') {
      const newTheme = colorScheme === 'dark' ? 'dark' : 'light';
      set({ theme: newTheme });
    }
  });

  return {
    ...initialState,

    setThemeMode: async (mode: ThemeMode) => {
      try {
        await storageHelpers.saveThemeMode(mode);
        const effectiveTheme = mode === 'system' ? getSystemTheme() : mode;
        set({ themeMode: mode, theme: effectiveTheme });
      } catch (error) {
        console.error('Error saving theme mode:', error);
      }
    },

    setPrimaryColor: async (color: string) => {
      try {
        await storageHelpers.savePrimaryColor(color);
        set({ primaryColor: color });
      } catch (error) {
        console.error('Error saving primary color:', error);
      }
    },

    setSecondaryColor: async (color: string) => {
      try {
        await storageHelpers.saveSecondaryColor(color);
        set({ secondaryColor: color });
      } catch (error) {
        console.error('Error saving secondary color:', error);
      }
    },

    setAccentColor: async (color: string) => {
      try {
        await storageHelpers.saveAccentColor(color);
        set({ accentColor: color });
      } catch (error) {
        console.error('Error saving accent color:', error);
      }
    },
  };
});

export const getThemeColors = (theme: Theme, customColors: CustomColors) => {
  const colors = {
    primaryColor: customColors?.primaryColor || DEFAULT_COLORS[theme].primary,
    secondaryColor: customColors?.secondaryColor || DEFAULT_COLORS[theme].secondary,
    accentColor: customColors?.accentColor || DEFAULT_COLORS[theme].accent,
  };

  return {
    ...BASE_COLORS[theme],
    primary: colors.primaryColor,
    secondary: colors.secondaryColor,
    accent: colors.accentColor,
  };
}; 