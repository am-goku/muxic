import { Theme } from '../types/theme';

export const lightTheme: Theme = {
    colors: {
        primary: '#8B5CF6', // Purple
        primaryDark: '#7C3AED',
        secondary: '#EC4899', // Pink
        background: '#FFFFFF',
        surface: '#F9FAFB',
        card: '#FFFFFF',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        accent: '#EC4899',
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700',
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 16,
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        round: 9999,
    },
};

export const darkTheme: Theme = {
    colors: {
        primary: '#A78BFA', // Lighter purple for dark mode
        primaryDark: '#8B5CF6',
        secondary: '#F472B6', // Lighter pink
        background: '#0F172A', // Dark slate
        surface: '#1E293B',
        card: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        border: '#334155',
        error: '#F87171',
        success: '#34D399',
        warning: '#FBBF24',
        accent: '#F472B6',
    },
    typography: lightTheme.typography, // Same typography for both themes
    spacing: lightTheme.spacing, // Same spacing for both themes
    borderRadius: lightTheme.borderRadius, // Same border radius for both themes
};
