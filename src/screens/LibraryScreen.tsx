import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '../contexts/ThemeContext';
import { LocalSong, AudioFolder } from '../types/music';
import { FolderCard } from '../components/FolderCard';
import { FolderSongsModal } from '../components/FolderSongsModal';

export const LibraryScreen: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();
    const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
    const [audioFolders, setAudioFolders] = useState<AudioFolder[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<AudioFolder | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const quickAccessItems = [
        { icon: 'heart', label: 'Liked Songs', count: 127, color: '#E63946' },
        { icon: 'list', label: 'Playlists', count: 12, color: '#8B5CF6' },
        { icon: 'albums', label: 'Albums', count: 45, color: '#EC4899' },
        { icon: 'people', label: 'Artists', count: 68, color: '#10B981' },
    ];

    const playlists = [
        { name: 'Chill Vibes', songs: 42, color: '#4ECDC4' },
        { name: 'Workout Mix', songs: 35, color: '#FF6B6B' },
        { name: 'Road Trip', songs: 58, color: '#F4A261' },
        { name: 'Study Focus', songs: 29, color: '#2A9D8F' },
    ];

    useEffect(() => {
        requestPermissionAndLoadSongs();
    }, []);

    const requestPermissionAndLoadSongs = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setPermissionStatus(status);

            if (status === 'granted') {
                await loadLocalSongs();
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
            Alert.alert('Error', 'Failed to request storage permission');
        }
    };

    const loadLocalSongs = async () => {
        try {
            setLoading(true);
            const media = await MediaLibrary.getAssetsAsync({
                mediaType: 'audio',
                first: 1000, // Load more songs to get all folders
                sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            });

            const songs: LocalSong[] = media.assets.map((asset) => ({
                id: asset.id,
                filename: asset.filename,
                uri: asset.uri,
                duration: asset.duration,
                mediaType: asset.mediaType,
                creationTime: asset.creationTime,
            }));

            // Group songs by folder
            const folders = groupSongsByFolder(songs);
            setAudioFolders(folders);
        } catch (error) {
            console.error('Error loading songs:', error);
            Alert.alert('Error', 'Failed to load local songs');
        } finally {
            setLoading(false);
        }
    };

    const groupSongsByFolder = (songs: LocalSong[]): AudioFolder[] => {
        const folderMap = new Map<string, LocalSong[]>();

        songs.forEach((song) => {
            // Extract folder path from URI
            const folderPath = song.uri.substring(0, song.uri.lastIndexOf('/'));

            if (!folderMap.has(folderPath)) {
                folderMap.set(folderPath, []);
            }
            folderMap.get(folderPath)!.push(song);
        });

        // Convert map to array of AudioFolder objects
        const folders: AudioFolder[] = Array.from(folderMap.entries()).map(([path, songs]) => {
            // Extract folder name from path
            const folderName = path.substring(path.lastIndexOf('/') + 1) || 'Root';

            return {
                path,
                name: folderName,
                songCount: songs.length,
                songs: songs.sort((a, b) => a.filename.localeCompare(b.filename)),
            };
        });

        // Sort folders by song count (descending)
        return folders.sort((a, b) => b.songCount - a.songCount);
    };

    const handleFolderPress = (folder: AudioFolder) => {
        setSelectedFolder(folder);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setTimeout(() => setSelectedFolder(null), 300);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                            Your Library
                        </Text>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>
                            Music Collection
                        </Text>
                    </View>
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

                {/* Quick Access */}
                <View style={styles.section}>
                    <View style={styles.quickAccessGrid}>
                        {quickAccessItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.quickAccessCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <Text style={[styles.quickAccessLabel, { color: theme.colors.text }]}>
                                    {item.label}
                                </Text>
                                <Text style={[styles.quickAccessCount, { color: theme.colors.textSecondary }]}>
                                    {item.count} items
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Device Music Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Device Music
                        </Text>
                        {permissionStatus === 'granted' && audioFolders.length > 0 && (
                            <Text style={[styles.folderCount, { color: theme.colors.textSecondary }]}>
                                {audioFolders.length} {audioFolders.length === 1 ? 'folder' : 'folders'}
                            </Text>
                        )}
                    </View>

                    {permissionStatus === 'undetermined' && (
                        <View style={[styles.permissionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Ionicons name="musical-notes" size={48} color={theme.colors.primary} />
                            <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
                                Requesting Permission...
                            </Text>
                        </View>
                    )}

                    {permissionStatus === 'denied' && (
                        <View style={[styles.permissionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Ionicons name="lock-closed" size={48} color={theme.colors.error} />
                            <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
                                Permission Denied
                            </Text>
                            <Text style={[styles.permissionDescription, { color: theme.colors.textSecondary }]}>
                                Please enable storage permission in your device settings to access local music.
                            </Text>
                            <TouchableOpacity
                                style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
                                onPress={requestPermissionAndLoadSongs}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {permissionStatus === 'granted' && loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                                Loading your music...
                            </Text>
                        </View>
                    )}

                    {permissionStatus === 'granted' && !loading && audioFolders.length === 0 && (
                        <View style={[styles.permissionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            <Ionicons name="musical-note-outline" size={48} color={theme.colors.textSecondary} />
                            <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
                                No Music Found
                            </Text>
                            <Text style={[styles.permissionDescription, { color: theme.colors.textSecondary }]}>
                                No audio files found on your device.
                            </Text>
                        </View>
                    )}

                    {permissionStatus === 'granted' && !loading && audioFolders.length > 0 && (
                        <View>
                            {audioFolders.map((folder) => (
                                <FolderCard
                                    key={folder.path}
                                    folder={folder}
                                    onPress={() => handleFolderPress(folder)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Playlists */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Your Playlists
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                                See All
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {playlists.map((playlist, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.playlistItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.playlistArtwork, { backgroundColor: playlist.color }]}>
                                <Ionicons name="musical-notes" size={24} color="rgba(255, 255, 255, 0.8)" />
                            </View>
                            <View style={styles.playlistInfo}>
                                <Text style={[styles.playlistName, { color: theme.colors.text }]}>
                                    {playlist.name}
                                </Text>
                                <Text style={[styles.playlistSongs, { color: theme.colors.textSecondary }]}>
                                    {playlist.songs} songs
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Folder Songs Modal */}
            <FolderSongsModal
                visible={modalVisible}
                folder={selectedFolder}
                onClose={handleCloseModal}
            />
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
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickAccessCard: {
        width: '48%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickAccessLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    quickAccessCount: {
        fontSize: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    folderCount: {
        fontSize: 14,
        fontWeight: '600',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    permissionCard: {
        padding: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    permissionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    permissionDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 16,
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
    },
    playlistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 12,
    },
    playlistArtwork: {
        width: 56,
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playlistInfo: {
        flex: 1,
    },
    playlistName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    playlistSongs: {
        fontSize: 14,
    },
    bottomSpacing: {
        height: 20,
    },
});
