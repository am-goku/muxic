import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { AudioFolder } from '../types/music';

interface FolderSongsModalProps {
    visible: boolean;
    folder: AudioFolder | null;
    onClose: () => void;
}

export const FolderSongsModal: React.FC<FolderSongsModalProps> = ({ visible, folder, onClose }) => {
    const { theme } = useTheme();
    const { playSong, pauseSong, resumeSong, currentSong, isPlaying } = usePlayer();
    const [loadingSongId, setLoadingSongId] = React.useState<string | null>(null);

    if (!folder) return null;

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getSongTitle = (filename: string): string => {
        return filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    };

    const handlePlaySong = async (song: any) => {
        // If this song is currently playing, toggle pause/resume
        if (currentSong?.id === song.id) {
            if (isPlaying) {
                await pauseSong();
            } else {
                await resumeSong();
            }
        } else {
            // Play new song
            setLoadingSongId(song.id);
            await playSong(song);
            setLoadingSongId(null);
        }
    };

    const isCurrentSong = (songId: string) => currentSong?.id === songId;
    const isLoadingSong = (songId: string) => loadingSongId === songId;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="formSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.folderName, { color: theme.colors.text }]} numberOfLines={1}>
                            {folder.name}
                        </Text>
                        <Text style={[styles.songCount, { color: theme.colors.textSecondary }]}>
                            {folder.songCount} {folder.songCount === 1 ? 'song' : 'songs'}
                        </Text>
                    </View>
                    <View style={styles.placeholder} />
                </View>

                {/* Songs List */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.songsList}>
                        {folder.songs.map((song, index) => {
                            const isCurrent = isCurrentSong(song.id);
                            const isLoading = isLoadingSong(song.id);
                            const showPause = isCurrent && isPlaying;

                            return (
                                <TouchableOpacity
                                    key={song.id}
                                    style={[
                                        styles.songItem,
                                        index < folder.songs.length - 1 && styles.songItemBorder,
                                        index < folder.songs.length - 1 && { borderBottomColor: theme.colors.border },
                                        isCurrent && { backgroundColor: theme.colors.primary + '10' }
                                    ]}
                                    onPress={() => handlePlaySong(song)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.songArtwork,
                                        { backgroundColor: isCurrent ? theme.colors.primary : theme.colors.surface }
                                    ]}>
                                        <Ionicons
                                            name="musical-note"
                                            size={20}
                                            color={isCurrent ? "#FFFFFF" : theme.colors.primary}
                                        />
                                    </View>
                                    <View style={styles.songInfo}>
                                        <Text
                                            style={[
                                                styles.songTitle,
                                                { color: isCurrent ? theme.colors.primary : theme.colors.text }
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {getSongTitle(song.filename)}
                                        </Text>
                                        <Text style={[styles.songDuration, { color: theme.colors.textSecondary }]}>
                                            {formatDuration(song.duration)}
                                        </Text>
                                    </View>

                                    {/* Play/Pause/Loading Button */}
                                    <View style={styles.playButtonContainer}>
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color={theme.colors.primary} />
                                        ) : (
                                            <Ionicons
                                                name={showPause ? 'pause-circle' : 'play-circle'}
                                                size={32}
                                                color={theme.colors.primary}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
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
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
    },
    placeholder: {
        width: 40,
    },
    folderName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    songCount: {
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Extra padding for bottom content
    },
    songsList: {
        padding: 20,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 12,
        borderRadius: 8,
    },
    songItemBorder: {
        borderBottomWidth: 1,
    },
    songArtwork: {
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    songDuration: {
        fontSize: 14,
    },
    playButtonContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
