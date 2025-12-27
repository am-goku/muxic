import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Animated, PanResponder, Dimensions, Modal, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Slider from '@react-native-community/slider';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { StreamingTrack } from '../types/music';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PlayerScreenProps {
    visible: boolean;
    onClose: () => void;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({ visible, onClose }) => {
    const { theme } = useTheme();
    const { currentSong, isPlaying, isLoading, progress, duration, pauseSong, resumeSong, seekTo, playNext, playPrevious, currentIndex, queue, playSong } = usePlayer();
    const [isSeeking, setIsSeeking] = useState(false);
    const [queueVisible, setQueueVisible] = useState(false);
    const [liked, setLiked] = useState(false);

    // Animation for sliding up/down
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const likeScale = useRef(new Animated.Value(1)).current;

    // Animate in/out when visible changes
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 65,
                    friction: 11,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: SCREEN_HEIGHT,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    // Gesture handling for swipe down
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        tension: 65,
                        friction: 11,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!currentSong || !visible) return null;

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
                <View style={styles.artwork}>
                    <Image
                        source={{ uri: currentSong.artwork }}
                        style={styles.artworkImage}
                        resizeMode="cover"
                    />
                </View>
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

    const handleLikePress = () => {
        setLiked(!liked);

        // Bounce animation
        Animated.sequence([
            Animated.spring(likeScale, {
                toValue: 1.3,
                tension: 100,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.spring(likeScale, {
                toValue: 1,
                tension: 100,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <>
            {/* Backdrop */}
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity: backdropOpacity,
                        pointerEvents: visible ? 'auto' : 'none'
                    }
                ]}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    activeOpacity={1}
                />
            </Animated.View>

            {/* Player Content */}
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.colors.background,
                        transform: [{ translateY }]
                    }
                ]}
                {...panResponder.panHandlers}
            >
                {/* Swipe Indicator */}
                <View style={styles.swipeIndicatorContainer}>
                    <View style={[styles.swipeIndicator, { backgroundColor: theme.colors.textSecondary }]} />
                </View>

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
                </View>

                {/* Song Info */}
                <View style={styles.songInfo}>
                    <Text style={[styles.songTitle, { color: theme.colors.text }]} numberOfLines={1}>
                        {getSongTitle()}
                    </Text>
                    <Text style={[styles.songArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {getArtistName()}
                    </Text>
                </View>

                {/* Progress Slider */}
                <View style={styles.progressContainer}>
                    <Slider
                        style={styles.slider}
                        value={isSeeking ? progress : progress}
                        minimumValue={0}
                        maximumValue={duration}
                        onValueChange={(value) => {
                            setIsSeeking(true);
                        }}
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

                    <TouchableOpacity
                        style={styles.controlButton}
                        activeOpacity={0.7}
                        onPress={playPrevious}
                        disabled={currentIndex <= 0}
                    >
                        <Ionicons
                            name="play-skip-back"
                            size={32}
                            color={currentIndex <= 0 ? theme.colors.textSecondary : theme.colors.text}
                        />
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
                                size={32}
                                color="#FFFFFF"
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.controlButton}
                        activeOpacity={0.7}
                        onPress={playNext}
                        disabled={currentIndex >= queue.length - 1}
                    >
                        <Ionicons
                            name="play-skip-forward"
                            size={32}
                            color={currentIndex >= queue.length - 1 ? theme.colors.textSecondary : theme.colors.text}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                        <Ionicons name="repeat" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Additional Controls */}
                <View style={styles.additionalControls}>
                    <View style={styles.leftControls}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            activeOpacity={0.7}
                            onPress={handleLikePress}
                        >
                            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                                <Ionicons
                                    name={liked ? "heart" : "heart-outline"}
                                    size={24}
                                    color={liked ? "#FF6B6B" : theme.colors.text}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                            <Ionicons name="share-outline" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.iconButton}
                        activeOpacity={0.7}
                        onPress={() => setQueueVisible(true)}
                    >
                        <Ionicons name="list" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Queue Modal */}
            <Modal
                visible={queueVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setQueueVisible(false)}
            >
                <View style={[styles.queueContainer, { backgroundColor: theme.colors.background }]}>
                    {/* Queue Header */}
                    <View style={styles.queueHeader}>
                        <Text style={[styles.queueTitle, { color: theme.colors.text }]}>
                            Queue ({queue.length} songs)
                        </Text>
                        <TouchableOpacity onPress={() => setQueueVisible(false)}>
                            <Ionicons name="close" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Queue List */}
                    <FlatList
                        data={queue}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item, index }) => {
                            const isCurrent = index === currentIndex;
                            const isStreamingTrack = (song: any): song is StreamingTrack => {
                                return 'streamUrl' in song;
                            };

                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.queueItem,
                                        {
                                            backgroundColor: isCurrent ? theme.colors.surface : 'transparent',
                                            borderLeftColor: isCurrent ? theme.colors.primary : 'transparent',
                                        }
                                    ]}
                                    onPress={() => {
                                        playSong(item);
                                        setQueueVisible(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.queueItemContent}>
                                        {/* Track Number or Playing Indicator */}
                                        <View style={styles.queueItemNumber}>
                                            {isCurrent ? (
                                                <Ionicons
                                                    name={isPlaying ? "volume-high" : "pause"}
                                                    size={16}
                                                    color={theme.colors.primary}
                                                />
                                            ) : (
                                                <Text style={[styles.queueItemNumberText, { color: theme.colors.textSecondary }]}>
                                                    {index + 1}
                                                </Text>
                                            )}
                                        </View>

                                        {/* Song Info */}
                                        <View style={styles.queueItemInfo}>
                                            <Text
                                                style={[
                                                    styles.queueItemTitle,
                                                    { color: isCurrent ? theme.colors.primary : theme.colors.text }
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {isStreamingTrack(item) ? item.title : item.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                                            </Text>
                                            <Text
                                                style={[styles.queueItemArtist, { color: theme.colors.textSecondary }]}
                                                numberOfLines={1}
                                            >
                                                {isStreamingTrack(item) ? item.artist : 'Unknown Artist'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={styles.queueList}
                    />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 98,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SCREEN_HEIGHT,
        zIndex: 99,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    swipeIndicatorContainer: {
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        paddingBottom: 4,
    },
    swipeIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        opacity: 0.3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10,
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
        width: 280,
        height: 280,
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 40,
        position: 'relative',
    },
    artwork: {
        width: 280,
        height: 280,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
    },
    artworkImage: {
        width: 280,
        height: 280,
    },
    songInfo: {
        paddingHorizontal: 32,
        marginBottom: 32,
    },
    songTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    songArtist: {
        fontSize: 16,
        textAlign: 'center',
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
        paddingHorizontal: 8,
    },
    time: {
        fontSize: 12,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 32,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    additionalControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    leftControls: {
        flexDirection: 'row',
        gap: 32,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    queueContainer: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    queueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    queueTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    queueList: {
        paddingBottom: 20,
    },
    queueItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderLeftWidth: 3,
    },
    queueItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    queueItemNumber: {
        width: 24,
        alignItems: 'center',
    },
    queueItemNumberText: {
        fontSize: 14,
        fontWeight: '500',
    },
    queueItemInfo: {
        flex: 1,
    },
    queueItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    queueItemArtist: {
        fontSize: 13,
    },
});
