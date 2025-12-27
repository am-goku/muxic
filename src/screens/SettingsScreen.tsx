import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings, StreamingMode } from '../contexts/SettingsContext';
import { cacheManager } from '../utils/cacheManager';

interface SettingsScreenProps {
    navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const { streamingMode, setStreamingMode } = useSettings();
    const [cacheSize, setCacheSize] = useState('0 B');

    useEffect(() => {
        loadCacheSize();
    }, []);

    const loadCacheSize = async () => {
        const size = await cacheManager.getCacheSize();
        setCacheSize(cacheManager.formatSize(size));
    };

    const handleModeChange = async (mode: StreamingMode) => {
        await setStreamingMode(mode);
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache',
            'This will delete all downloaded songs. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await cacheManager.clearCache();
                        await loadCacheSize();
                        Alert.alert('Success', 'Cache cleared successfully');
                    },
                },
            ]
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

                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Streaming Settings
                </Text>

                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Description */}
                <View style={styles.descriptionSection}>
                    <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                        Choose how you want to stream music. Progressive streaming starts playing quickly but may buffer on slow connections. Download mode ensures smooth playback by downloading songs first.
                    </Text>
                </View>

                {/* Streaming Mode Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Streaming Mode
                    </Text>

                    <TouchableOpacity
                        style={[styles.option, { backgroundColor: theme.colors.surface }]}
                        onPress={() => handleModeChange('progressive')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.optionContent}>
                            <View style={styles.optionLeft}>
                                <Ionicons
                                    name={streamingMode === 'progressive' ? 'radio-button-on' : 'radio-button-off'}
                                    size={24}
                                    color={streamingMode === 'progressive' ? theme.colors.primary : theme.colors.textSecondary}
                                />
                                <View style={styles.optionText}>
                                    <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                                        Progressive Streaming
                                    </Text>
                                    <Text style={[styles.optionDesc, { color: theme.colors.textSecondary }]}>
                                        Fast start, may buffer on slow networks
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.option, { backgroundColor: theme.colors.surface }]}
                        onPress={() => handleModeChange('download')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.optionContent}>
                            <View style={styles.optionLeft}>
                                <Ionicons
                                    name={streamingMode === 'download' ? 'radio-button-on' : 'radio-button-off'}
                                    size={24}
                                    color={streamingMode === 'download' ? theme.colors.primary : theme.colors.textSecondary}
                                />
                                <View style={styles.optionText}>
                                    <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                                        Download First
                                    </Text>
                                    <Text style={[styles.optionDesc, { color: theme.colors.textSecondary }]}>
                                        Smooth playback, downloads before playing
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Cache Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                        Cache Storage
                    </Text>

                    <Text style={[styles.cacheNote, { color: theme.colors.textSecondary }]}>
                        Downloaded songs are cached locally for faster playback and offline listening.
                    </Text>

                    <View style={styles.cacheInfoContainer}>
                        <View style={styles.cacheInfoRow}>
                            <Ionicons name="folder-outline" size={20} color={theme.colors.primary} />
                            <Text style={[styles.cacheInfoLabel, { color: theme.colors.textSecondary }]}>
                                Current Cache Size
                            </Text>
                        </View>
                        <Text style={[styles.cacheInfoValue, { color: theme.colors.text }]}>
                            {cacheSize}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.clearButton, { backgroundColor: theme.colors.error || '#FF3B30' }]}
                        onPress={handleClearCache}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.clearButtonText}>Clear Cache</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    title: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    descriptionSection: {
        padding: 20,
        paddingBottom: 0,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    cacheNote: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 12,
    },
    option: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionText: {
        marginLeft: 12,
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    optionDesc: {
        fontSize: 13,
    },
    cacheInfoContainer: {
        marginBottom: 12,
    },
    cacheInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    cacheInfoLabel: {
        fontSize: 14,
    },
    cacheInfoValue: {
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 28,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    clearButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
