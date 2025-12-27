import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { PlayableTrack, StreamingTrack } from '../types/music';
import { useSettings } from './SettingsContext';
import { cacheManager } from '../utils/cacheManager';

interface PlayerContextType {
    currentSong: PlayableTrack | null;
    isPlaying: boolean;
    isLoading: boolean;
    progress: number;
    duration: number;
    queue: PlayableTrack[];
    currentIndex: number;
    playSong: (song: PlayableTrack, newQueue?: PlayableTrack[]) => Promise<void>;
    pauseSong: () => void;
    resumeSong: () => void;
    stopSong: () => void;
    seekTo: (position: number) => void;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<PlayableTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [queue, setQueue] = useState<PlayableTrack[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const player = useAudioPlayer();
    const { streamingMode } = useSettings();
    const loadingRef = useRef(false);
    const loadRequestIdRef = useRef(0);
    const preloadingRef = useRef(false);

    // Update progress while playing and detect song end
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            if (player.playing) {
                const currentTime = player.currentTime * 1000;
                const songDuration = player.duration ? player.duration * 1000 : 0;

                setProgress(currentTime);
                if (songDuration) {
                    setDuration(songDuration);
                }

                // Detect song end (within 500ms of completion)
                if (songDuration > 0 && currentTime >= songDuration - 500) {
                    setIsPlaying(false);
                    setProgress(0);

                    // Auto-play next song if available
                    const nextIndex = currentIndex + 1;
                    if (nextIndex < queue.length) {
                        playSong(queue[nextIndex]);
                    }
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isPlaying, player, currentIndex, queue]);

    const isStreamingTrack = (song: PlayableTrack): song is StreamingTrack => {
        return 'streamUrl' in song;
    };

    const getSongUri = (song: PlayableTrack): string => {
        if (isStreamingTrack(song)) {
            return song.streamUrl;
        }
        return song.uri;
    };

    const playSong = async (song: PlayableTrack, newQueue?: PlayableTrack[]) => {
        try {
            // Increment request ID to invalidate previous requests
            loadRequestIdRef.current += 1;
            const currentRequestId = loadRequestIdRef.current;

            loadingRef.current = true;
            setIsLoading(true);

            // Update queue if provided
            if (newQueue) {
                setQueue(newQueue);
                const index = newQueue.findIndex(s => s.id === song.id);
                setCurrentIndex(index);
            } else {
                // Find song in existing queue
                const index = queue.findIndex(s => s.id === song.id);
                if (index !== -1) {
                    setCurrentIndex(index);
                } else {
                    // Song not in queue, add it to the end
                    const updatedQueue = [...queue, song];
                    setQueue(updatedQueue);
                    setCurrentIndex(updatedQueue.length - 1);
                }
            }

            // Update current song immediately for UI feedback
            setCurrentSong(song);
            setProgress(0);
            setDuration(0);

            const sourceUri = getSongUri(song);
            let playUri = sourceUri;

            // Handle download mode
            if (streamingMode === 'download') {
                try {
                    // Check cache first
                    const cachedUri = await cacheManager.getSong(song.id);

                    if (cachedUri) {
                        console.log('Playing from cache:', cachedUri);
                        playUri = cachedUri;
                    } else {
                        console.log('Downloading song:', song.id);
                        // Download to cache
                        const downloadedUri = await cacheManager.saveSong(song.id, sourceUri);
                        if (downloadedUri) {
                            console.log('Download complete:', downloadedUri);
                            playUri = downloadedUri;
                        } else {
                            console.warn('Download failed, falling back to streaming');
                            playUri = sourceUri;
                        }
                    }
                } catch (downloadError) {
                    console.error('Error in download mode, falling back to streaming:', downloadError);
                    playUri = sourceUri;
                }
            }

            // Load and play song
            console.log('Loading song with URI:', playUri);

            // expo-audio expects different format for local vs remote files
            const source = playUri.startsWith('file://')
                ? { uri: playUri }
                : { uri: playUri };

            await player.replace(source);

            // Check if this request is still valid
            if (currentRequestId !== loadRequestIdRef.current) {
                // This request was superseded, stop playback
                player.pause();
                return;
            }

            console.log('Starting playback...');
            player.play();
            setIsPlaying(true);
            loadingRef.current = false;
            setIsLoading(false);
            console.log('Playback started successfully');

            // Preload next song in download mode
            if (streamingMode === 'download') {
                preloadNextSong();
            }
        } catch (error) {
            console.error('Error playing song:', error);
            loadingRef.current = false;
            setIsLoading(false);
        }
    };

    const preloadNextSong = async () => {
        if (preloadingRef.current) return;

        try {
            preloadingRef.current = true;
            const nextIndex = currentIndex + 1;

            if (nextIndex < queue.length) {
                const nextSong = queue[nextIndex];
                const cachedUri = await cacheManager.getSong(nextSong.id);

                if (!cachedUri) {
                    const sourceUri = getSongUri(nextSong);
                    await cacheManager.saveSong(nextSong.id, sourceUri);
                }
            }
        } catch (error) {
            console.error('Error preloading next song:', error);
        } finally {
            preloadingRef.current = false;
        }
    };

    const pauseSong = () => {
        player.pause();
        setIsPlaying(false);
    };

    const resumeSong = () => {
        player.play();
        setIsPlaying(true);
    };

    const stopSong = () => {
        player.pause();
        player.remove();
        setIsPlaying(false);
        setCurrentSong(null);
        setProgress(0);
        setDuration(0);
    };

    const seekTo = async (position: number) => {
        // expo-audio uses seconds, we use milliseconds
        player.seekTo(position / 1000);
    };

    const playNext = async () => {
        if (queue.length === 0 || currentIndex === -1) return;

        const nextIndex = currentIndex + 1;
        if (nextIndex < queue.length) {
            await playSong(queue[nextIndex]);
        }
    };

    const playPrevious = async () => {
        if (queue.length === 0 || currentIndex === -1) return;

        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            await playSong(queue[prevIndex]);
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
                queue,
                currentIndex,
                playSong,
                pauseSong,
                resumeSong,
                stopSong,
                seekTo,
                playNext,
                playPrevious,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
