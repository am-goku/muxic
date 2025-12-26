import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { LocalSong, StreamingTrack } from '../types/music';

type PlayableTrack = LocalSong | StreamingTrack;

interface PlayerContextType {
    currentSong: PlayableTrack | null;
    isPlaying: boolean;
    isLoading: boolean;
    progress: number;
    duration: number;
    playSong: (song: PlayableTrack) => Promise<void>;
    pauseSong: () => Promise<void>;
    resumeSong: () => Promise<void>;
    stopSong: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<PlayableTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const soundRef = useRef<Audio.Sound | null>(null);
    const loadingRef = useRef(false);

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

    const isStreamingTrack = (song: PlayableTrack): song is StreamingTrack => {
        return 'streamUrl' in song;
    };

    const getSongUri = (song: PlayableTrack): string => {
        if (isStreamingTrack(song)) {
            return song.streamUrl;
        }
        return song.uri;
    };

    const playSong = async (song: PlayableTrack) => {
        try {
            // Prevent multiple simultaneous loads
            if (loadingRef.current) {
                return;
            }

            loadingRef.current = true;
            setIsLoading(true);

            // Update current song immediately for UI feedback
            setCurrentSong(song);
            setProgress(0);
            setDuration(0);

            // Stop current song if playing
            if (soundRef.current) {
                try {
                    await soundRef.current.unloadAsync();
                } catch (error) {
                    console.error('Error unloading previous sound:', error);
                }
                soundRef.current = null;
            }

            const uri = getSongUri(song);

            // Load and play new song
            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            soundRef.current = sound;
            setIsPlaying(true);
        } catch (error) {
            console.error('Error playing song:', error);
            setIsPlaying(false);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    };

    const pauseSong = async () => {
        if (soundRef.current) {
            try {
                await soundRef.current.pauseAsync();
                setIsPlaying(false);
            } catch (error) {
                console.error('Error pausing song:', error);
            }
        }
    };

    const resumeSong = async () => {
        if (soundRef.current) {
            try {
                await soundRef.current.playAsync();
                setIsPlaying(true);
            } catch (error) {
                console.error('Error resuming song:', error);
            }
        }
    };

    const stopSong = async () => {
        if (soundRef.current) {
            try {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
                setIsPlaying(false);
                setCurrentSong(null);
                setProgress(0);
                setDuration(0);
            } catch (error) {
                console.error('Error stopping song:', error);
            }
        }
    };

    const seekTo = async (position: number) => {
        if (soundRef.current) {
            try {
                await soundRef.current.setPositionAsync(position);
            } catch (error) {
                console.error('Error seeking:', error);
            }
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
                isLoading,
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
