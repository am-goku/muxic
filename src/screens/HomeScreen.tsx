import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { SectionHeader } from '../components/SectionHeader';
import { StreamingTrackCard } from '../components/StreamingTrackCard';
import { StreamingTrack } from '../types/music';
import { audiusAPI, AudiusTrack } from '../services/audiusApi';

export const HomeScreen: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();
    const { playSong, pauseSong, resumeSong, currentSong, isPlaying } = usePlayer();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [topTracks, setTopTracks] = useState<StreamingTrack[]>([]);
    const [trendingTracks, setTrendingTracks] = useState<StreamingTrack[]>([]);

    useEffect(() => {
        loadMusic();
    }, []);


    const loadMusic = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load Audius streaming music - each call independent
            let trending: AudiusTrack[] = [];
            let topTracksData: AudiusTrack[] = [];

            try {
                trending = await audiusAPI.getTrendingTracks(10);
            } catch (err) {
                console.log('Failed to load trending tracks:', err);
            }

            try {
                topTracksData = await audiusAPI.searchTracks('electronic', 10);
            } catch (err) {
                console.log('Failed to load top tracks:', err);
            }

            // Convert tracks safely
            const trendingConverted = convertAudiusTracks(trending);
            const topConverted = convertAudiusTracks(topTracksData);

            setTrendingTracks(trendingConverted);
            setTopTracks(topConverted);

            // Show error only if both failed
            if (trendingConverted.length === 0 && topConverted.length === 0) {
                setError('No music available. Please check your internet connection.');
            }
        } catch (error) {
            console.error('Error loading music:', error);
            setError('Failed to load music. Please try again.');
            setTrendingTracks([]);
            setTopTracks([]);
        } finally {
            setLoading(false);
        }
    };

    const convertAudiusTracks = (tracks: AudiusTrack[]): StreamingTrack[] => {
        if (!tracks || !Array.isArray(tracks)) {
            return [];
        }

        return tracks.map(track => {
            try {
                return {
                    id: track.id || '',
                    title: track.title || 'Unknown Title',
                    artist: track.user?.name || 'Unknown Artist',
                    artwork: track.artwork?.['480x480'] || track.artwork?.['1000x1000'] || '',
                    duration: track.duration || 0,
                    streamUrl: audiusAPI.getStreamUrl(track.id),
                };
            } catch (err) {
                console.error('Error converting track:', err);
                return null;
            }
        }).filter((track): track is StreamingTrack => track !== null);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const renderStreamingTrackCard = (track: StreamingTrack) => {
        const [imageLoaded, setImageLoaded] = React.useState(false);
        const [imageError, setImageError] = React.useState(false);
        const scaleAnim = React.useRef(new Animated.Value(1)).current;

        const isCurrent = currentSong?.id === track.id;
        const isCurrentPlaying = isCurrent && isPlaying;

        React.useEffect(() => {
            if (isCurrentPlaying) {
                // Pulse animation when playing
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.1,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            } else {
                scaleAnim.setValue(1);
            }
        }, [isCurrentPlaying]);

        const handleCardPress = () => {
            if (isCurrent) {
                if (isPlaying) {
                    pauseSong();
                } else {
                    resumeSong();
                }
            } else {
                playSong(track);
            }
        };

        return (
            <TouchableOpacity
                style={[styles.songCard, { backgroundColor: theme.colors.surface }]}
                onPress={handleCardPress}
                activeOpacity={0.8}
            >
                <View style={styles.artworkContainer}>
                    {track.artwork && !imageError ? (
                        <>
                            {!imageLoaded && (
                                <View style={[styles.artwork, styles.placeholderArtwork, { backgroundColor: theme.colors.primary }]}>
                                    <Ionicons name="musical-note" size={32} color="#FFFFFF" />
                                </View>
                            )}
                            <Image
                                source={{ uri: track.artwork }}
                                style={[styles.artwork, !imageLoaded && styles.hiddenImage]}
                                resizeMode="cover"
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        </>
                    ) : (
                        <View style={[styles.artwork, { backgroundColor: theme.colors.primary }]}>
                            <Ionicons name="musical-note" size={32} color="#FFFFFF" />
                        </View>
                    )}

                    {/* Play/Pause Overlay */}
                    {isCurrent && (
                        <Animated.View
                            style={[
                                styles.playOverlay,
                                { transform: [{ scale: scaleAnim }] }
                            ]}
                        >
                            <View style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
                                <Ionicons
                                    name={isCurrentPlaying ? 'pause' : 'play'}
                                    size={24}
                                    color="#FFFFFF"
                                />
                            </View>
                        </Animated.View>
                    )}
                </View>
                <Text style={[styles.songTitle, { color: isCurrent ? theme.colors.primary : theme.colors.text }]} numberOfLines={2}>
                    {track.title}
                </Text>
                <Text style={[styles.songArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {track.artist}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                            {getGreeting()}
                        </Text>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>
                            Music Lover
                        </Text>
                    </View>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
                            onPress={() => console.log('Equalizer')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="stats-chart" size={20} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
                            onPress={toggleTheme}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={themeMode === 'light' ? 'moon' : 'sunny'}
                                size={20}
                                color={theme.colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                            Loading music...
                        </Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="cloud-offline" size={64} color={theme.colors.textSecondary} />
                        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
                            {error}
                        </Text>
                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                            onPress={loadMusic}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Trending Now (Audius) */}
                        {trendingTracks.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader
                                    title="Trending Now"
                                    icon="trending-up"
                                    onSeeAll={() => console.log('See all trending')}
                                />
                                <FlatList
                                    data={trendingTracks}
                                    renderItem={({ item }) => <StreamingTrackCard track={item} queue={trendingTracks} />}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.songList}
                                />
                            </View>
                        )}

                        {/* Top Electronic Tracks (Audius) */}
                        {topTracks.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader
                                    title="Top Electronic"
                                    icon="musical-notes"
                                    onSeeAll={() => console.log('See all electronic')}
                                />
                                <FlatList
                                    data={topTracks}
                                    renderItem={({ item }) => <StreamingTrackCard track={item} queue={topTracks} />}
                                    keyExtractor={(item) => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.songList}
                                />
                            </View>
                        )}
                    </>
                )}

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    userName: {
        fontSize: 28,
        fontWeight: '700',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 60,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
    },
    errorContainer: {
        padding: 60,
        alignItems: 'center',
    },
    errorTitle: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginBottom: 32,
        paddingLeft: 24,
    },
    songList: {
        paddingRight: 24,
        gap: 16,
    },
    songCard: {
        width: 140,
        borderRadius: 12,
        padding: 12,
    },
    artworkContainer: {
        position: 'relative',
        width: 116,
        height: 116,
        marginBottom: 12,
    },
    artwork: {
        width: 116,
        height: 116,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderArtwork: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    hiddenImage: {
        opacity: 0,
    },
    playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 8,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    songTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    songArtist: {
        fontSize: 12,
    },
    bottomSpacing: {
        height: 100,
    },
});
