import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const ProfileScreen: React.FC = () => {
    const { theme, themeMode, toggleTheme } = useTheme();

    const stats = [
        { label: 'Hours Listened', value: '127', icon: 'headset' },
        { label: 'Favorite Genre', value: 'Pop', icon: 'musical-note' },
        { label: 'Total Songs', value: '1,234', icon: 'disc' },
    ];

    const settingsSections = [
        {
            title: 'Account',
            items: [
                { icon: 'person-outline', label: 'Edit Profile', action: 'edit-profile' },
                { icon: 'notifications-outline', label: 'Notifications', action: 'notifications' },
                { icon: 'lock-closed-outline', label: 'Privacy', action: 'privacy' },
            ],
        },
        {
            title: 'Playback',
            items: [
                { icon: 'volume-high-outline', label: 'Audio Quality', action: 'audio-quality' },
                { icon: 'shuffle-outline', label: 'Crossfade', action: 'crossfade' },
                { icon: 'download-outline', label: 'Downloads', action: 'downloads' },
            ],
        },
        {
            title: 'Appearance',
            items: [
                { icon: themeMode === 'light' ? 'moon-outline' : 'sunny-outline', label: 'Theme', action: 'theme', isTheme: true },
            ],
        },
        {
            title: 'About',
            items: [
                { icon: 'information-circle-outline', label: 'About Muxic', action: 'about' },
                { icon: 'help-circle-outline', label: 'Help & Support', action: 'help' },
                { icon: 'document-text-outline', label: 'Terms & Privacy', action: 'terms' },
            ],
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>
                        Profile
                    </Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileSection}>
                    <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.avatarText}>ML</Text>
                        </View>
                        <Text style={[styles.profileName, { color: theme.colors.text }]}>
                            Music Lover
                        </Text>
                        <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                            musiclover@example.com
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsSection}>
                    {stats.map((stat, index) => (
                        <View
                            key={index}
                            style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        >
                            <Ionicons name={stat.icon as any} size={24} color={theme.colors.primary} />
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>
                                {stat.value}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                                {stat.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Settings Sections */}
                {settingsSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.settingsSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                            {section.title}
                        </Text>
                        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    style={[
                                        styles.settingsItem,
                                        itemIndex < section.items.length - 1 && styles.settingsItemBorder,
                                        itemIndex < section.items.length - 1 && { borderBottomColor: theme.colors.border },
                                    ]}
                                    onPress={item.isTheme ? toggleTheme : () => console.log(item.action)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name={item.icon as any} size={22} color={theme.colors.text} />
                                    <Text style={[styles.settingsLabel, { color: theme.colors.text }]}>
                                        {item.label}
                                    </Text>
                                    {item.isTheme ? (
                                        <Text style={[styles.themeValue, { color: theme.colors.textSecondary }]}>
                                            {themeMode === 'light' ? 'Light' : 'Dark'}
                                        </Text>
                                    ) : (
                                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: theme.colors.error + '20', borderColor: theme.colors.error }]}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                        <Text style={[styles.logoutText, { color: theme.colors.error }]}>
                            Logout
                        </Text>
                    </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    profileSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    profileCard: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
    },
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        textAlign: 'center',
    },
    settingsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    settingsCard: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    settingsItemBorder: {
        borderBottomWidth: 1,
    },
    settingsLabel: {
        flex: 1,
        fontSize: 16,
    },
    themeValue: {
        fontSize: 14,
        marginRight: 4,
    },
    logoutSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 20,
    },
});
