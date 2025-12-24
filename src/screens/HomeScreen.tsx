import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SongCard } from '../components/SongCard';
import { SectionHeader } from '../components/SectionHeader';
import { recentlyPlayed, favorites, trending, youMayLike, Song } from '../data/mockData';

export const HomeScreen: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const renderSongList = (songs: Song[]) => (
        <FlatList
            data={songs}
            renderItem={({ item }) => (
                <SongCard
                    song={item}
                    onPress={() => console.log('Play:', item.title)}
                />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.songList}
        />
    );

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
                    <View style={styles.headerIcons}>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="search" size={20} color={theme.colors.text} />
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

                {/* Recently Played */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Recently Played"
                        onSeeAll={() => console.log('See all recently played')}
                    />
                    {renderSongList(recentlyPlayed)}
                </View>

                {/* Favorites */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Your Favorites"
                        onSeeAll={() => console.log('See all favorites')}
                    />
                    {renderSongList(favorites)}
                </View>

                {/* Trending Now */}
                <View style={styles.section}>
                    <SectionHeader
                        title="Trending Now"
                        onSeeAll={() => console.log('See all trending')}
                    />
                    {renderSongList(trending)}
                </View>

                {/* You May Also Like */}
                <View style={styles.section}>
                    <SectionHeader
                        title="You May Also Like"
                        onSeeAll={() => console.log('See all recommendations')}
                    />
                    {renderSongList(youMayLike)}
                </View>

                {/* Bottom spacing for navigation */}
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
    headerIcons: {
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
    icon: {
        fontSize: 20,
    },
    section: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    songList: {
        paddingRight: 20,
    },
    bottomSpacing: {
        height: 20,
    },
});
