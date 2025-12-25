import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { PlayerProvider } from './src/contexts/PlayerContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { BottomNav } from './src/components/BottomNav';
import { NowPlayingBar } from './src/components/NowPlayingBar';
import { View, StyleSheet } from 'react-native';

type TabType = 'home' | 'search' | 'library' | 'profile';

function AppContent() {
  const { themeMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [playerVisible, setPlayerVisible] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'library':
        return <LibraryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <NowPlayingBar onPress={() => setPlayerVisible(true)} />
      <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      <PlayerScreen visible={playerVisible} onClose={() => setPlayerVisible(false)} />
      <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
