import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../contexts/ThemeContext';
import { usePlayer } from '../contexts/PlayerContext';
import { StreamingTrack } from '../types/music';

interface SeeAllScreenProps {
    navigation: any;
    route: {
        params: {
            title: string;
            tracks: StreamingTrack[];
            icon: keyof typeof Ionicons.glyphMap;
        };
    };
}

export const SeeAllScreen: React.FC<SeeAllScreenProps> = ({ navigation, route }) => {
    const { theme } = useTheme();
    const { playSong, currentSong, isPlaying } = usePlayer();
    const { title, tracks, icon } = route.params;

    const renderTrack = ({ item }: { item: StreamingTrack }) => {
        const isCurrent = currentSong?.id === item.id;

        return (
            <TouchableOpacity
                style={[styles.trackItem, { backgroundColor: theme.colors.surface }]}
                onPress={() => playSong(item, tracks)}
                activeOpacity={0.7}
            >
                <Image
                    source={{ uri: item.artwork }}
                    style={styles.artwork}
                    resizeMode="cover"
                />
                <View style={styles.trackInfo}>
                    <Text
                        style={[styles.trackTitle, { color: isCurrent ? theme.colors.primary : theme.colors.text }]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    <Text style={[styles.trackArtist, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                        {item.artist}
                    </Text>
                </View>
                {isCurrent && isPlaying && (
                    <Ionicons name="volume-high" size={20} color={theme.colors.primary} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={[styles.header, {
                borderBottomColor: theme.colors.border,
                paddingTop: Constants.statusBarHeight || 0
            }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.headerTitle}>
                    <Ionicons name={icon} size={24} color={theme.colors.primary} style={styles.headerIcon} />
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        {title}
                    </Text>
                </View>

                <View style={styles.placeholder} />
            </View>

            {/* Track List */}
            <FlatList
                data={tracks}
                renderItem={renderTrack}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
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
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    listContent: {
        padding: 16,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    artwork: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    trackInfo: {
        flex: 1,
    },
    trackTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    trackArtist: {
        fontSize: 14,
    },
});
