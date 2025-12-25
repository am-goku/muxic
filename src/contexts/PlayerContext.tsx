import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { LocalSong } from '../types/music';

interface PlayerContextType {
    currentSong: LocalSong | null;
    isPlaying: boolean;
    progress: number;
    duration: number;
    playSong: (song: LocalSong) => Promise<void>;
    pauseSong: () => Promise<void>;
    resumeSong: () => Promise<void>;
    stopSong: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<LocalSong | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const soundRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        // Configure audio mode
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
        });

        return () => {
            // Cleanup on unmount
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    const playSong = async (song: LocalSong) => {
        try {
            // Stop current song if playing
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            // Load and play new song
            const { sound } = await Audio.Sound.createAsync(
                { uri: song.uri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            soundRef.current = sound;
            setCurrentSong(song);
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const pauseSong = async () => {
        if (soundRef.current) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
        }
    };

    const resumeSong = async () => {
        if (soundRef.current) {
            await soundRef.current.playAsync();
            setIsPlaying(true);
        }
    };

    const stopSong = async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
            setIsPlaying(false);
            setCurrentSong(null);
            setProgress(0);
            setDuration(0);
        }
    };

    const seekTo = async (position: number) => {
        if (soundRef.current) {
            await soundRef.current.setPositionAsync(position);
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setProgress(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);

            // Handle song end
            if (status.didJustFinish) {
                setIsPlaying(false);
                setProgress(0);
            }
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                progress,
                duration,
                playSong,
                pauseSong,
                resumeSong,
                stopSong,
                seekTo,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within PlayerProvider');
    }
    return context;
};
