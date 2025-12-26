import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { StreamingTrack } from '../types/music';

interface PlayerScreenProps {
    visible: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');

export const PlayerScreen: React.FC<PlayerScreenProps> = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const { currentSong, isPlaying, isLoading, progress, duration, pauseSong, resumeSong, seekTo } = usePlayer();
    const [isSeeking, setIsSeeking] = useState(false);

    if (!currentSong) return null;

    const isStreamingTrack = (song: any): song is StreamingTrack => {
        return 'streamUrl' in song;
    };

    const getSongTitle = (): string => {
        if (isStreamingTrack(currentSong)) {
            return currentSong.title;
        }
        return currentSong.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    };

    const getArtistName = (): string => {
        if (isStreamingTrack(currentSong)) {
            return currentSong.artist;
        }
        return 'Unknown Artist';
    };

    const getAlbumArtwork = () => {
        if (isStreamingTrack(currentSong) && currentSong.artwork) {
            return (
                <Image
                    source={{ uri: currentSong.artwork }}
                    style={styles.artwork}
                    resizeMode="cover"
                />
            );
        }
        return (
            <View style={[styles.artwork, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="musical-notes" size={120} color="rgba(255, 255, 255, 0.6)" />
            </View>
        );
    };

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = async (value: number) => {
        await seekTo(value);
        setIsSeeking(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="chevron-down" size={28} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.textSecondary }]}>
                        Now Playing
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Album Artwork */}
                <View style={styles.artworkContainer}>
                    {getAlbumArtwork()}
                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    )}
                </View>

                {/* Song Info */}
                <View style={styles.songInfo}>
                    <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
                        {getSongTitle()}
                    </Text>
                    <Text style={[styles.artist, { color: theme.colors.textSecondary }]}>
                        {isLoading ? 'Loading...' : getArtistName()}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration || 1}
                        value={isSeeking ? undefined : progress}
                        onValueChange={() => setIsSeeking(true)}
                        onSlidingComplete={handleSeek}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.border}
                        thumbTintColor={theme.colors.primary}
                        disabled={isLoading}
                    />
                    <View style={styles.timeContainer}>
                        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                            {formatTime(progress)}
                        </Text>
                        <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                            {formatTime(duration)}
                        </Text>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                        <Ionicons name="shuffle" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                        <Ionicons name="play-skip-back" size={32} color={theme.colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
                        onPress={isPlaying ? pauseSong : resumeSong}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons
                                name={isPlaying ? 'pause' : 'play'}
                                size={36}
                                color="#FFFFFF"
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                        <Ionicons name="play-skip-forward" size={32} color={theme.colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                        <Ionicons name="repeat" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Additional Controls */}
                <View style={styles.additionalControls}>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <Ionicons name="share-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
    },
    closeButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    placeholder: {
        width: 44,
    },
    artworkContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
        position: 'relative',
    },
    artwork: {
        width: width - 80,
        height: width - 80,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 16,
    },
    songInfo: {
        paddingHorizontal: 32,
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    artist: {
        fontSize: 16,
    },
    progressContainer: {
        paddingHorizontal: 32,
        marginBottom: 32,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -8,
    },
    time: {
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        marginBottom: 32,
        gap: 24,
    },
    controlButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    additionalControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
    },
    iconButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
