import { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { PlayerProvider } from './src/contexts/PlayerContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { SeeAllScreen } from './src/screens/SeeAllScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomNav } from './src/components/BottomNav';
import { NowPlayingBar } from './src/components/NowPlayingBar';
import { View, StyleSheet, BackHandler } from 'react-native';
import { StreamingTrack } from './src/types/music';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

type TabType = 'home' | 'search' | 'library' | 'profile';

function AppContent() {
  const { themeMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [playerVisible, setPlayerVisible] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [seeAllParams, setSeeAllParams] = useState<{
    title: string;
    tracks: StreamingTrack[];
    icon: any;
  } | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible for at least 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If player is visible, close it
      if (playerVisible) {
        setPlayerVisible(false);
        return true;
      }

      // If Settings screen is visible, close it
      if (settingsVisible) {
        setSettingsVisible(false);
        return true;
      }

      // If SeeAll screen is visible, close it
      if (seeAllParams) {
        setSeeAllParams(null);
        return true;
      }

      // Otherwise, let default behavior happen (exit app)
      return false;
    });

    return () => backHandler.remove();
  }, [playerVisible, seeAllParams, settingsVisible]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const navigation = {
    navigate: (screen: string, params?: any) => {
      if (screen === 'SeeAll') {
        setSeeAllParams(params);
      } else if (screen === 'Settings') {
        setSettingsVisible(true);
      }
    },
    goBack: () => {
      if (settingsVisible) {
        setSettingsVisible(false);
      } else {
        setSeeAllParams(null);
      }
    },
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* Keep all screens mounted but hide inactive ones */}
      <View style={{ display: activeTab === 'home' && !seeAllParams && !settingsVisible ? 'flex' : 'none', flex: 1 }}>
        <HomeScreen navigation={navigation} />
      </View>
      <View style={{ display: activeTab === 'search' && !seeAllParams && !settingsVisible ? 'flex' : 'none', flex: 1 }}>
        <SearchScreen />
      </View>
      <View style={{ display: activeTab === 'library' && !seeAllParams && !settingsVisible ? 'flex' : 'none', flex: 1 }}>
        <LibraryScreen />
      </View>
      <View style={{ display: activeTab === 'profile' && !seeAllParams && !settingsVisible ? 'flex' : 'none', flex: 1 }}>
        <ProfileScreen navigation={navigation} />
      </View>

      {/* SeeAll Screen */}
      {seeAllParams && (
        <SeeAllScreen navigation={navigation} route={{ params: seeAllParams }} />
      )}

      {/* Settings Screen */}
      {settingsVisible && (
        <SettingsScreen navigation={navigation} />
      )}

      <NowPlayingBar onPress={() => setPlayerVisible(true)} />
      <BottomNav
        activeTab={activeTab}
        onTabPress={(tab) => {
          // Close any open overlays when switching tabs
          if (settingsVisible) setSettingsVisible(false);
          if (seeAllParams) setSeeAllParams(null);
          setActiveTab(tab);
        }}
      />
      <PlayerScreen visible={playerVisible} onClose={() => setPlayerVisible(false)} />
      <StatusBar style={themeMode === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
