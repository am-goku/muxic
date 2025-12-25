import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { AudioFolder } from '../types/music';

interface FolderCardProps {
    folder: AudioFolder;
    onPress: () => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, onPress }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="folder-open" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.info}>
                <Text style={[styles.folderName, { color: theme.colors.text }]} numberOfLines={1}>
                    {folder.name}
                </Text>
                <Text style={[styles.songCount, { color: theme.colors.textSecondary }]}>
                    {folder.songCount} {folder.songCount === 1 ? 'song' : 'songs'}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    folderName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    songCount: {
        fontSize: 14,
    },
});
