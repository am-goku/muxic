import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Song } from '../data/mockData';

interface SongCardProps {
    song: Song;
    onPress?: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
    const { theme } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                { opacity: pressed ? 0.7 : 1 }
            ]}
        >
            <View style={[styles.artwork, { backgroundColor: song.albumColor }]}>
                <Ionicons name="musical-notes" size={40} color="rgba(255, 255, 255, 0.6)" />
            </View>
            <Text
                style={[styles.title, { color: theme.colors.text }]}
                numberOfLines={1}
            >
                {song.title}
            </Text>
            <Text
                style={[styles.artist, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
            >
                {song.artist}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 140,
        marginRight: 16,
    },
    artwork: {
        width: 140,
        height: 140,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    artist: {
        fontSize: 12,
    },
});
