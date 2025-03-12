# Tic Tac Toe Mobile App and Download Website

Welcome to the Tic Tac Toe project! This repository contains a React Native mobile application for Android, featuring a fun and interactive Tic Tac Toe game with single-player and two-player modes, along with a React-based website for users to download the APK file.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
  - [Mobile App](#mobile-app)
  - [Download Website](#download-website)
- [Development](#development)
- [Deployment](#deployment)
- [Animations](#animations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- **Mobile App**:
  - Single-player mode with AI opponent (adjustable difficulty: Easy, Medium, Hard).
  - Two-player mode for local multiplayer.
  - Score tracking and reset functionality.
  - Undo move option in single-player mode.
  - Animated winning cells and page transitions.
  - Settings screen to adjust AI difficulty.
- **Download Website**:
  - Simple, responsive webpage to download the APK.
  - Fade-in animation on page load.
  - Instructions for installing the APK on Android devices.

## Project Structure
```
tic-tac-toe-react-native/
├── .bolt
├── .expo
├── android
├── app
│   ├── app
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── game.tsx
│   ├── index.tsx
│   └── settings.tsx
├── assets
│   └── images
│       ├── favicon.png
│       └── icon.png
├── hooks
│   └── useFrameworkReady.ts
├── node_modules
├── store
│   ├── gameStore.ts
├── .gitignore
├── .prettierrc
├── app.json
├── eas.json
├── expo-env.d.ts
├── index.js
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Android Studio (for mobile app testing/emulation)
- Expo CLI (for React Native development): `npm install -g expo-cli`

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/tic-tac-toe-react-native.git
   cd tic-tac-toe-react-native
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Install Additional Libraries**
   ```bash
   npm install react-native-reanimated zustand expo-router lucide-react-native
   ```
4. **Add the APK File**
   - Place your compiled APK (e.g., `tictactoe.apk`) in the `public` folder (create one if it doesn’t exist) or the root directory for download purposes.

## Usage

### Mobile App
#### Start the Development Server
Run the app:
```bash
npx expo start
```
Use the Expo Go app on your Android device or an emulator to test.

#### Gameplay
- **Home Screen**: Choose between Single Player or Two Players.
- **Game Screen**: Play the game, undo moves (single-player), or reset scores.
- **Settings Screen**: Adjust AI difficulty and reset scores.

### Download Website
*(If integrated into this project, create a separate `apk-download-page` directory or adapt the app for web.)*

#### Start the Development Server
Run the app:
```bash
npm start
```
Open `http://localhost:3000` in your browser (if web support is added).

## Development
- **Mobile App**: Use Expo to develop and test. Modify `app/` for new features or screens.
- **Animations**: Leverage `react-native-reanimated` for custom animations (e.g., fade-in, slide-in).
- **State Management**: Use `zustand` for managing game state (e.g., `gameStore.ts`).

## Deployment

### Mobile App
Build the APK using Expo:
```bash
npx expo build:android -t apk
```
Download the generated APK from the Expo dashboard.
https://expo.dev/accounts/king010/projects/bolt-expo-nativewind/builds/61972a16-561e-439e-98da-b916953f1219

## Animations
- **Home Screen**: Slides up from the bottom and fades in (500ms).
- **Settings Screen**: Slides in from the right and fades in (500ms).
- **Game Screen**: Slides down from the top and fades in (500ms).

## Contributing
1. **Fork the repository.**
2. **Create a new branch:** `git checkout -b feature-name`
3. **Make changes and commit:** `git commit -m "Add feature"`
4. **Push to the branch:** `git push origin feature-name`
5. **Submit a pull request.**

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
- **Author**: [Arsh Singh]
- **Email**: arshth134@gmail.com
- **GitHub**: https://github.com/arsh342
