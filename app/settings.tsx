import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Switch, ScrollView, TextInput } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { useThemeStore, getThemeColors } from '../store/themeStore';
import Animated, { 
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { 
  Trash2,
  Sun,
  Moon,
} from 'lucide-react-native';

export default function Settings() {
  const { difficulty, setDifficulty, resetScores, soundEnabled, toggleSound, playerChoice, setPlayerChoice, playerXName, setPlayerXName, playerOName, setPlayerOName } = useGameStore();
  const { 
    theme,
    themeMode,
    primaryColor,
    secondaryColor,
    accentColor,
    setThemeMode,
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor
  } = useThemeStore();

  const colors = useMemo(() => getThemeColors(theme, { primaryColor, secondaryColor, accentColor }), [theme, primaryColor, secondaryColor, accentColor]);

  const difficulties = useMemo(() => [
    { value: 'easy', label: 'Easy' },
    { value: 'hard', label: 'Hard' },
  ] as const, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
  }, [theme, setThemeMode]);

  const handleSetThemeModeLight = useCallback(() => setThemeMode('light'), [setThemeMode]);
  const handleSetThemeModeDark = useCallback(() => setThemeMode('dark'), [setThemeMode]);
  const handleSetPlayerChoiceX = useCallback(() => setPlayerChoice('X'), [setPlayerChoice]);
  const handleSetPlayerChoiceO = useCallback(() => setPlayerChoice('O'), [setPlayerChoice]);
  const handleResetScores = useCallback(() => resetScores(), [resetScores]);

  // Assuming sound volume is stored as a number between 0 and 1
  // Need to add sound volume state and update logic in gameStore if not present
  const [soundVolume, setSoundVolume] = React.useState(0.5); // Placeholder state

  const playerXPlaceholderColor = useMemo(() => colors.text + '80', [colors.text]);
  const playerOPlaceholderColor = useMemo(() => colors.text + '80', [colors.text]);

  return (
    <ScrollView style={styles.scrollViewContent}>
    <Animated.View 
      entering={FadeIn}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animated.Text 
        entering={FadeInUp.delay(200)}
        style={[styles.title, { color: colors.text }]}>Settings</Animated.Text>


        {/* Theme Section */}
        <Animated.View 
          entering={FadeInUp.delay(300)}
          style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
          <View style={styles.rowContainer}>
            <Text style={[styles.sectionDescription, { color: colors.text }]}>Switch between light and dark mode</Text>
          </View>
          {/* Theme Mode Buttons */}
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { 
                  backgroundColor: themeMode === 'light' ? colors.secondary : colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow
                }
              ]}
              onPress={handleSetThemeModeLight}
            >
              <Sun size={24} color={colors.text} />
              <Text style={[styles.themeButtonText, { color: colors.text }]}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                { 
                  backgroundColor: themeMode === 'dark' ? colors.secondary : colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow
                }
              ]}
              onPress={handleSetThemeModeDark}
            >
              <Moon size={24} color={colors.text} />
              <Text style={[styles.themeButtonText, { color: colors.text }]}>Dark</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Sound Section */}
        <Animated.View 
          entering={FadeInUp.delay(400)}
          style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sound</Text>
          <Text style={[styles.sectionDescription, { color: colors.text }]}>Toggle game sound effects</Text>
          <View style={styles.rowContainerSpaceBetween}>
             <Text style={[styles.soundButtonText, { color: colors.text }]}>
               {soundEnabled ? 'Sound On' : 'Sound Off'}
             </Text>
             <Switch
               value={soundEnabled}
               onValueChange={toggleSound}
               trackColor={{ false: colors.background, true: colors.secondary }}
               thumbColor={Platform.OS === 'ios' ? colors.accent : (soundEnabled ? colors.secondary : colors.accent)} // Simplified thumbColor
               ios_backgroundColor={colors.card}
               style={Platform.OS === 'android' ? styles.androidSwitch : undefined}
             />
          </View>
        </Animated.View>

        {/* Player Choice Section */}
        <Animated.View 
          entering={FadeInUp.delay(500)}
          style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Play as</Text>
           <Text style={[styles.sectionDescription, { color: colors.text }]}>Choose whether to play as X or O in single-player mode.</Text>
          <View style={styles.playerChoiceButtons}>
            <TouchableOpacity
              style={[
                styles.playerChoiceButton,
                { 
                  backgroundColor: playerChoice === 'X' ? colors.secondary : colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow
                }
              ]}
              onPress={handleSetPlayerChoiceX}
            >
              <Text style={[styles.playerChoiceButtonText, { color: colors.text }]}>X</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.playerChoiceButton,
                { 
                  backgroundColor: playerChoice === 'O' ? colors.secondary : colors.card,
                  borderColor: colors.border,
                  shadowColor: colors.shadow
                }
              ]}
              onPress={handleSetPlayerChoiceO}
            >
              <Text style={[styles.playerChoiceButtonText, { color: colors.text }]}>O</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* AI Difficulty Section */}
        <Animated.View 
          entering={FadeInUp.delay(600)}
          style={[styles.section, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Difficulty</Text>
           <Text style={[styles.sectionDescription, { color: colors.text }]}>Select the AI opponent difficulty level</Text>
          <View style={styles.difficultyButtons}>
            {difficulties.map(({ value, label }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.difficultyButton,
                  { 
                    backgroundColor: difficulty === value ? colors.secondary : colors.card,
                    borderColor: colors.border,
                    shadowColor: colors.shadow
                  }
                ]}
                onPress={useCallback(() => setDifficulty(value), [setDifficulty, value])} // Wrap inline function
              >
                <Text style={[styles.difficultyButtonText, { color: colors.text }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Player Names Section */}
        <Animated.View 
          entering={FadeInUp.delay(700)}
          style={[styles.section, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Player Names</Text>
          <Text style={[styles.sectionDescription, { color: colors.text }]}>Customize the names for Player X and Player O.</Text>
          
          <View style={styles.nameInputContainer}>
            <Text style={[styles.nameInputLabel, { color: colors.text }]}>Player X Name:</Text>
            <TextInput
              style={[styles.nameInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              value={playerXName}
              onChangeText={setPlayerXName}
              placeholder="Enter name for Player X"
              placeholderTextColor={playerXPlaceholderColor} // Use memoized color
            />
          </View>
          
          <View style={styles.nameInputContainer}>
            <Text style={[styles.nameInputLabel, { color: colors.text }]}>Player O Name:</Text>
            <TextInput
              style={[styles.nameInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]}
              value={playerOName}
              onChangeText={setPlayerOName}
              placeholder="Enter name for Player O"
              placeholderTextColor={playerOPlaceholderColor} // Use memoized color
            />
          </View>
        </Animated.View>

        {/* Reset Scores Button */}
        <Animated.TouchableOpacity 
          entering={FadeInUp.delay(800)}
          style={[styles.resetButton, { 
            backgroundColor: colors.accent,
            borderColor: colors.border,
            shadowColor: colors.shadow
          }]}
          onPress={handleResetScores}
        >
          <Trash2 size={24} color={colors.text} />
          <Text style={[styles.resetButtonText, { color: colors.text }]}>Reset Scores</Text>
        </Animated.TouchableOpacity>


    </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
    alignItems: 'center',
  },
   scrollViewContent:{
     width: '100%',
   },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 3,
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
   sectionTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
   sectionDescription: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    marginBottom: 15,
  },
  rowContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContainerSpaceBetween:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap:10
  },
  switchContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  androidSwitch: {
    transform: [{ scale: 1.2 }],
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop:15,
  },
  themeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    gap: 10,
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
  themeButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  soundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
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
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  soundButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
   slider: {
    flex:1,
    height: 40,
    width: '100%',
   },
   soundPercentage:{
     fontFamily: 'SpaceGrotesk-Bold',
     fontSize: 16,
   },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  difficultyButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
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
  difficultyButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 3,
    gap: 10,
    width: '100%',
    marginTop:20,
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
  resetButtonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
  },
   playerChoiceButtons: {
     flexDirection: 'row',
     gap: 10,
     marginTop: 15,
   },
   playerChoiceButton: {
     flex: 1,
     padding: 15,
     borderRadius: 12,
     borderWidth: 3,
     alignItems: 'center',
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
   playerChoiceButtonText: {
     fontFamily: 'SpaceGrotesk-Bold',
     fontSize: 16,
   },
   appVersion:{
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
    marginTop: 'auto', // Push app version to the bottom
   },
   nameInputContainer: {
     width: '100%',
     marginBottom: 15,
   },
   nameInputLabel: {
     fontFamily: 'SpaceGrotesk-Medium',
     fontSize: 16,
     marginBottom: 5,
   },
   nameInput: {
     borderWidth: 2,
     borderRadius: 8,
     paddingVertical: 10,
     paddingHorizontal: 15,
     fontSize: 16,
     fontFamily: 'SpaceGrotesk-Regular',
   },
});