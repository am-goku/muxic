# Muxic - Music Player App 🎵

A modern, beautiful music player app built with React Native and Expo, featuring a stunning UI with dark/light theme support.

## 📱 Features

### ✅ Implemented

- **4 Navigation Tabs** - Home, Search, Library, Profile
- **Theme System** - Beautiful purple/pink gradient theme with dark/light mode
- **Home Screen** - Recently Played, Favorites, Trending, You May Also Like sections
- **Search Screen** - Search bar, recent searches, trending searches
- **Library Screen** - Quick access cards, playlists, albums, artists
- **Profile Screen** - User info, stats, settings, theme toggle
- **Modern Icons** - Ionicons vector icons throughout
- **Responsive Design** - Smooth scrolling and interactions
- **TypeScript** - Full type safety

### 🚧 Coming Soon

- Music playback functionality
- Real device music library integration
- Player screen with controls
- Playlist management
- Search functionality
- Audio player integration

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **UI**: Custom components with theme system
- **Icons**: @expo/vector-icons (Ionicons)
- **State Management**: React Hooks
- **Navigation**: Tab-based state navigation

## 📦 Dependencies

```json
{
  "@expo/vector-icons": "^15.0.3",
  "expo": "~54.0.30",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device

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

## 📂 Project Structure

```
muxic_app/
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx       # Bottom navigation bar
│   │   ├── SectionHeader.tsx   # Section headers
│   │   └── SongCard.tsx        # Song card component
│   ├── constants/
│   │   └── theme.ts            # Theme configuration
│   ├── contexts/
│   │   └── ThemeContext.tsx    # Theme context provider
│   ├── data/
│   │   └── mockData.ts         # Mock song data
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Home tab screen
│   │   ├── SearchScreen.tsx    # Search tab screen
│   │   ├── LibraryScreen.tsx   # Library tab screen
│   │   └── ProfileScreen.tsx   # Profile tab screen
│   └── types/
│       └── theme.ts            # TypeScript type definitions
├── App.tsx                     # Main app component
├── app.json                    # Expo configuration
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🎨 Theme System

The app features a comprehensive theme system with:

### Colors

- **Light Mode**: Clean white backgrounds with vibrant accents
- **Dark Mode**: Dark slate backgrounds with lighter accents
- **Primary**: Purple (#8B5CF6 / #A78BFA)
- **Secondary**: Pink (#EC4899 / #F472B6)

### Typography

- H1: 32px, bold
- H2: 24px, bold
- H3: 20px, semibold
- Body: 16px, regular
- Caption: 12px, regular

### Usage

```tsx
import { useTheme } from "./src/contexts/ThemeContext";

const { theme, themeMode, toggleTheme } = useTheme();
```

## 📱 Screens

### Home Screen

- Dynamic greeting based on time of day
- Recently Played section (6 songs)
- Your Favorites section (6 songs)
- Trending Now section (6 songs)
- You May Also Like section (6 songs)
- Horizontal scrollable song cards

### Search Screen

- Search bar with clear button
- Recent searches with clear option
- Trending searches with ranking badges
- Theme toggle

### Library Screen

- Quick access cards (Liked Songs, Playlists, Albums, Artists)
- Your Playlists section
- Item counts for each category
- Colorful category icons

### Profile Screen

- User profile with avatar
- Listening statistics
- Settings sections (Account, Playback, Appearance, About)
- Logout button

## 🎯 Navigation

Tab-based navigation with 4 tabs:

- 🏠 **Home** - Music discovery and recently played
- 🔍 **Search** - Search for songs, artists, albums
- 📚 **Library** - Your music collection
- 👤 **Profile** - User settings and stats

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

### Code Style

- TypeScript strict mode enabled
- ESLint configuration
- Consistent component structure
- Theme-aware styling

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using React Native and Expo

---

**Note**: This is currently a UI template. Music playback functionality will be added in future updates.
