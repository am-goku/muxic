import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const SearchScreen: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const recentSearches = ['Blinding Lights', 'Dua Lipa', 'Pop Hits', 'Chill Vibes'];
    const trendingSearches = ['Flowers - Miley Cyrus', 'Anti-Hero', 'As It Was', 'Calm Down'];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Search
                    </Text>
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

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            style={[styles.searchInput, { color: theme.colors.text }]}
                            placeholder="Songs, artists, albums..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Recent Searches */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Recent Searches
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.clearButton, { color: theme.colors.primary }]}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {recentSearches.map((search, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.searchItem}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="time-outline" size={20} color={theme.colors.textSecondary} />
                            <Text style={[styles.searchText, { color: theme.colors.text }]}>
                                {search}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Trending Searches */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Trending Now
                    </Text>
                    {trendingSearches.map((search, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.searchItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.trendingBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Text style={[styles.trendingNumber, { color: theme.colors.primary }]}>
                                    {index + 1}
                                </Text>
                            </View>
                            <Text style={[styles.searchText, { color: theme.colors.text }]}>
                                {search}
                            </Text>
                            <Ionicons name="trending-up" size={20} color={theme.colors.success} />
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
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
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
    clearButton: {
        fontSize: 14,
        fontWeight: '600',
    },
    searchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    searchText: {
        flex: 1,
        fontSize: 16,
    },
    trendingBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendingNumber: {
        fontSize: 14,
        fontWeight: '700',
    },
    bottomSpacing: {
        height: 20,
    },
});
