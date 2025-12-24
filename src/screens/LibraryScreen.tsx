import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const LibraryScreen: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();

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
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
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
