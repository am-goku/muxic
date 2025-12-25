import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export const AppLoadingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.appName}>Muxic</Text>
            <Text style={styles.tagline}>Your Music, Your Vibe</Text>
            <ActivityIndicator
                size="large"
                color="#FFFFFF"
                style={styles.loader}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    appName: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 40,
    },
    loader: {
        marginTop: 20,
    },
});
