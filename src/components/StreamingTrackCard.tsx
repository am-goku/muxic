import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { StreamingTrack } from '../types/music';

interface StreamingTrackCardProps {
    track: StreamingTrack;
    queue?: StreamingTrack[];
}

export const StreamingTrackCard: React.FC<StreamingTrackCardProps> = ({ track, queue }) => {
    const { theme } = useTheme();
    const { playSong, pauseSong, resumeSong, currentSong, isPlaying } = usePlayer();
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
            playSong(track, queue);
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

const styles = StyleSheet.create({
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
});
