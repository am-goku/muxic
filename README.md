# Muxic - Modern Music Player App 🎵

A beautiful, feature-rich music player app built with React Native and Expo, featuring streaming music from Audius, local music playback, and advanced streaming options.

## ✨ Features

### 🎵 Music Playback
- **Streaming Music** - Access thousands of songs from Audius API
- **Local Music** - Play music from your device (Android)
- **Expandable Player** - Full-screen player with swipe-down gesture
- **Mini Player** - Persistent now-playing bar with controls
- **Queue Management** - View and manage playback queue
- **Auto-play** - Automatically plays next song in queue

### 🎨 User Interface
- **4 Navigation Tabs** - Home, Search, Library, Profile
- **Dark/Light Theme** - Beautiful purple/pink gradient theme with auto-switching
- **See All Screens** - Browse complete track lists
- **Smooth Animations** - Polished transitions and interactions
- **Modern Design** - Clean, intuitive interface

### ⚙️ Advanced Features
- **Streaming Modes**:
  - **Progressive Streaming** - Fast start, streams while playing
  - **Download First** - Downloads songs for smooth, buffer-free playback
- **Cache Management** - View and clear downloaded songs
- **Settings Screen** - Customize streaming preferences
- **Persistent Settings** - Preferences saved across app restarts

### 📱 Screens
- **Home** - Trending tracks, top tracks, and curated playlists from Audius
- **Search** - Find songs, artists, and albums
- **Library** - Browse local music by folders
- **Profile** - User stats and settings
- **Player** - Full-screen player with artwork, controls, and queue
- **See All** - View complete track lists
- **Settings** - Configure streaming mode and cache

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Audio**: expo-audio (latest)
- **Storage**: expo-file-system, AsyncStorage
- **UI**: Custom components with theme system
- **Icons**: @expo/vector-icons (Ionicons)
- **API**: Audius API for streaming music
- **State Management**: React Context API

## 📦 Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-native-community/slider": "5.0.1",
  "expo": "~54.0.30",
  "expo-audio": "~1.1.1",
  "expo-constants": "^18.0.12",
  "expo-file-system": "~19.0.21",
  "expo-media-library": "~18.2.1",
  "expo-splash-screen": "^31.0.13",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for testing) or EAS CLI (for building)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd muxic_app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npx expo start
```

4. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

### Building APK

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Build preview APK
npx eas-cli build -p android --profile preview
```

## 📂 Project Structure

```
muxic_app/
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx           # Bottom navigation bar
│   │   ├── NowPlayingBar.tsx       # Mini player bar
│   │   ├── SectionHeader.tsx       # Section headers with "See All"
│   │   ├── StreamingTrackCard.tsx  # Track card component
│   │   └── LocalMusicCard.tsx      # Local music card
│   ├── contexts/
│   │   ├── ThemeContext.tsx        # Theme provider
│   │   ├── PlayerContext.tsx       # Music player state
│   │   └── SettingsContext.tsx     # App settings
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Home with Audius tracks
│   │   ├── SearchScreen.tsx        # Search functionality
│   │   ├── LibraryScreen.tsx       # Local music library
│   │   ├── ProfileScreen.tsx       # User profile & settings
│   │   ├── PlayerScreen.tsx        # Full-screen player
│   │   ├── SeeAllScreen.tsx        # Full track lists
│   │   └── SettingsScreen.tsx      # Streaming settings
│   ├── services/
│   │   └── audiusApi.ts            # Audius API integration
│   ├── utils/
│   │   └── cacheManager.ts         # File caching utilities
│   ├── types/
│   │   └── music.ts                # TypeScript types
│   └── constants/
│       └── theme.ts                # Theme configuration
├── App.tsx                         # Main app component
├── app.json                        # Expo configuration
├── eas.json                        # EAS Build configuration
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript config
```

## 🎨 Theme System

### Colors
- **Light Mode**: Clean white backgrounds with vibrant accents
- **Dark Mode**: Dark slate backgrounds with lighter accents
- **Primary**: Purple (#8B5CF6 / #A78BFA)
- **Secondary**: Pink (#EC4899 / #F472B6)

### Usage
```tsx
import { useTheme } from './src/contexts/ThemeContext';

const { theme, themeMode, toggleTheme } = useTheme();
```

## 🎵 Music Sources

### Audius API
- Trending tracks
- Top tracks
- Search functionality
- No authentication required
- Free streaming

### Local Music
- Reads from device storage
- Folder-based browsing
- Requires READ_MEDIA_AUDIO permission (Android 13+)

## ⚙️ Streaming Modes

### Progressive Streaming (Default)
- ✅ Fast start
- ✅ Low storage usage
- ⚠️ May buffer on slow networks

### Download First
- ✅ Smooth, buffer-free playback
- ✅ Offline playback (cached songs)
- ✅ Next song preloaded
- ⚠️ Slower initial start
- ⚠️ Uses storage space

**Access**: Profile → Streaming Settings

## 🔧 Configuration

### App Version
- Version: 1.0.0
- Version Code: 1 (auto-incremented by EAS)

### Permissions (Android)
- READ_MEDIA_AUDIO - Access local music files
- READ_EXTERNAL_STORAGE - Legacy storage access

### Build Profiles
- **development** - Development client
- **preview** - APK for testing
- **production** - App bundle for Play Store

## 📱 Features by Screen

### Home Screen
- Trending Now section
- Top Tracks section
- "See All" for full lists
- Dynamic content from Audius

### Library Screen
- Folder-based browsing
- Local music playback
- Folder artwork and track counts

### Player Screen
- Full-screen expandable player
- Album artwork display
- Playback controls (play, pause, next, previous)
- Progress slider with time display
- Queue button
- Like button (animated)
- Swipe-down to minimize

### Settings Screen
- Streaming mode selector
- Cache size display
- Clear cache option
- Helpful descriptions

## 🔨 Development

### Available Scripts
```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build preview APK
npx eas-cli build -p android --profile preview
```

### Code Style
- TypeScript strict mode
- Consistent component structure
- Theme-aware styling
- Context-based state management

## 🐛 Known Issues

- Download-first mode: expo-audio may not support local file playback (use progressive mode)
- Local music: Requires Android 13+ for proper permissions

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using React Native and Expo

---

**Version**: 1.0.0  
**Last Updated**: December 2025
