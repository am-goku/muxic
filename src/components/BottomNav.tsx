import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

type TabType = 'home' | 'search' | 'library' | 'profile';

interface BottomNavProps {
    activeTab?: TabType;
    onTabPress?: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
    activeTab = 'home',
    onTabPress
}) => {
    const { theme } = useTheme();

    const tabs: { id: TabType; icon: 'home' | 'search' | 'library' | 'person'; iconOutline: 'home-outline' | 'search-outline' | 'library-outline' | 'person-outline'; label: string }[] = [
        { id: 'home' as TabType, icon: 'home', iconOutline: 'home-outline', label: 'Home' },
        { id: 'search' as TabType, icon: 'search', iconOutline: 'search-outline', label: 'Search' },
        { id: 'library' as TabType, icon: 'library', iconOutline: 'library-outline', label: 'Library' },
        { id: 'profile' as TabType, icon: 'person', iconOutline: 'person-outline', label: 'Profile' },
    ];

    return (
        <View style={[styles.container, {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
        }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tab}
                        onPress={() => onTabPress?.(tab.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive ? tab.icon : tab.iconOutline}
                            size={24}
                            color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                        />
                        <Text style={[
                            styles.label,
                            { color: isActive ? theme.colors.primary : theme.colors.textSecondary }
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingBottom: 20,
        borderTopWidth: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
});
