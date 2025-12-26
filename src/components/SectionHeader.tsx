import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface SectionHeaderProps {
    title: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, onSeeAll }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={24}
                        color={theme.colors.primary}
                        style={styles.icon}
                    />
                )}
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {title}
                </Text>
            </View>
            {onSeeAll && (
                <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
                    <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                        See All
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
});
