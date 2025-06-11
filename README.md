 # Tic Tac Toe - React Native

A modern and optimized Tic Tac Toe game built with React Native and Expo, designed to provide a smooth and engaging user experience across various devices, including foldable phones and tablets.

## ✨ Features

*   **Single Player Mode:** Play against a challenging AI opponent.
*   **Two Players Mode:** Play locally with a friend on the same device.
*   **AI Difficulty Levels:** Choose between easy and hard AI difficulties.
*   **Customizable Player Names:** Personalize player names for both X and O.
*   **Theming Options:** Switch between light and dark themes.
*   **Sound Effects:** Toggle in-game sound effects.
*   **Score Tracking:** Keep track of wins for each player.
*   **Move History:** View a log of all moves made during a game.
*   **Game Reset & Undo:** Reset the game or undo the last move.

## 🚀 Optimizations & Enhancements

This project has been significantly optimized for performance, user experience, and adaptability across different device types.

*   **Foldable Phone Optimization:**
    *   Dynamic screen dimension tracking in the root layout.
    *   Implementation of safe area insets to prevent content overlap with system UI.
    *   Responsive layouts that adapt to both portrait and landscape orientations.
    *   Optimized game board sizing to fit within screen bounds on foldable devices.
*   **Tablet Orientation Support:**
    *   Enabled automatic orientation changes for tablets by setting `orientation` to `"default"` in `app.json`.
*   **Performance Optimization:**
    *   Extensive use of `React.memo`, `useMemo`, and `useCallback` hooks across `app/game.tsx`, `app/settings.tsx`, and `app/(tabs)/index.tsx` to:
        *   Reduce unnecessary component re-renders.
        *   Memoize expensive calculations and object creations (e.g., theme `colors`, `boardSize`).
        *   Provide stable function references for event handlers, improving the efficiency of child components.
    *   Optimized image assets and font loading to minimize app footprint.
*   **Animation Enhancements:**
    *   Implemented `react-native-reanimated` for smooth and engaging animations.
    *   **Home Screen:** Staggered `FadeInUp` and `FadeInLeft` animations for the title and game mode selection buttons.
    *   **Game Screen:** Entry animations (`FadeInUp`, `FadeInLeft`, `FadeInRight`) for the game board, status text, header elements (Back button, Score container), and the "Play Again" button.
    *   **Settings Screen:** Staggered `FadeInUp` animations for the title and each settings section, creating a dynamic entry effect.
*   **Dark Mode Flash Fix:**
    *   Ensured the root view's background color in `app/_layout.tsx` matches the theme from the very beginning, eliminating a brief white flash when opening the app in dark mode.
*   **Navigation Bar Adjustment:**
    *   The tab bar now correctly adjusts its bottom padding using `useSafeAreaInsets` to account for on-screen navigation buttons, ensuring it's always visible.

## 🛠️ Technologies Used

*   **React Native:** A framework for building native apps using React.
*   **Expo:** A framework and platform for universal React applications.
*   **Zustand:** A small, fast, and scalable bear-bones state-management solution.
*   **React Native Reanimated:** A powerful animation library for React Native.
*   **Expo Router:** File-system based routing for Expo and React Native.
*   **Lucide Icons:** A set of beautiful and consistent open-source icons.
*   **@expo-google-fonts/space-grotesk:** Google Fonts integration for Expo projects.
*   **@react-native-async-storage/async-storage:** Persistent key-value storage.
*   **react-native-safe-area-context:** API for consuming insets from safe area.

## 📦 Setup Instructions

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo CLI (`npm install -g expo-cli`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tic-tac-toe-react-native.git
    cd tic-tac-toe-react-native
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```

## 🏃‍♀️ Running the App

### For Development

```bash
npm run dev
# OR
yarn dev
```
This will start the Expo development server. You can then:
*   Scan the QR code with the Expo Go app on your phone.
*   Press `a` to run on Android emulator.
*   Press `i` to run on iOS simulator.
*   Press `w` to run in a web browser.

### For Production Builds

```bash
# Build for Android
eas build -p android --profile production

# Build for iOS
eas build -p ios --profile production

# Build for Web
npm run build:web
# OR
yarn build:web
```

## 📂 Project Structure

```
.
├── app/                  # Main application screens and navigation
│   ├── (tabs)/           # Tab-based navigation screens (Home, Leaderboard, Settings)
│   │   ├── _layout.tsx   # Tab navigator configuration
│   │   └── index.tsx     # Home screen (game mode selection)
│   ├── _layout.tsx       # Root layout for the app (global configuration)
│   ├── game.tsx          # Main Tic Tac Toe game logic and UI
│   └── settings.tsx      # App settings screen
├── assets/               # Static assets like images and fonts
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── store/                # Zustand stores for state management (game logic, theme)
├── .gitignore            # Git ignore file
├── app.json              # Expo application configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation (this file)
```

## 🤝 Credits

This project was built as a demonstration of a highly optimized and animated React Native application using modern best practices.
