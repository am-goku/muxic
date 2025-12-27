import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StreamingMode = 'progressive' | 'download';

interface SettingsContextType {
    streamingMode: StreamingMode;
    setStreamingMode: (mode: StreamingMode) => Promise<void>;
}

const defaultSettings: SettingsContextType = {
    streamingMode: 'progressive',
    setStreamingMode: async () => { },
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

const SETTINGS_KEY = '@muxic_settings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [streamingMode, setStreamingModeState] = useState<StreamingMode>('progressive');

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                const settings = JSON.parse(stored);
                setStreamingModeState(settings.streamingMode || 'progressive');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const setStreamingMode = async (mode: StreamingMode) => {
        try {
            setStreamingModeState(mode);
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ streamingMode: mode }));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ streamingMode, setStreamingMode }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};
