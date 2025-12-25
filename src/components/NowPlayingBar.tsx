import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';

interface NowPlayingBarProps {
    onPress: () => void;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({ onPress }) => {
    const { theme } = useTheme();
    const { currentSong, isPlaying, pauseSong, resumeSong, progress, duration } = usePlayer();

    if (!currentSong) return null;

    const getSongTitle = (filename: string): string => {
        return filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    };

    const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Progress bar */}
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View
                    style={[
                        styles.progressFill,
                        { backgroundColor: theme.colors.primary, width: `${progressPercentage}%` }
                    ]}
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Album art */}
                <View style={[styles.artwork, { backgroundColor: theme.colors.primary }]}>
                    <Ionicons name="musical-note" size={20} color="#FFFFFF" />
                </View>

                {/* Song info */}
                <View style={styles.songInfo}>
                    <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                        {getSongTitle(currentSong.filename)}
                    </Text>
                    <Text style={[styles.artist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        Unknown Artist
                    </Text>
                </View>

                {/* Play/Pause button */}
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={isPlaying ? pauseSong : resumeSong}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={28}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        position: 'relative',
    },
    progressBar: {
        height: 2,
        width: '100%',
    },
    progressFill: {
        height: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    artwork: {
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    songInfo: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    artist: {
        fontSize: 12,
    },
    playButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
