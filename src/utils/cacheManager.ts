import * as FileSystem from 'expo-file-system/legacy';

const CACHE_DIR = (FileSystem.documentDirectory || '') + 'music_cache/';

export const cacheManager = {
    // Initialize cache directory
    init: async () => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
            }
        } catch (error) {
            console.error('Error initializing cache:', error);
        }
    },

    // Save song to cache
    saveSong: async (trackId: string, sourceUri: string): Promise<string | null> => {
        try {
            await cacheManager.init();
            const fileUri = CACHE_DIR + `${trackId}.mp3`;

            // Check if already cached
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (fileInfo.exists) {
                return fileUri;
            }

            // Download to cache
            const download = await FileSystem.downloadAsync(sourceUri, fileUri);
            return download.uri;
        } catch (error) {
            console.error('Error saving song to cache:', error);
            return null;
        }
    },

    // Get cached song
    getSong: async (trackId: string): Promise<string | null> => {
        try {
            const fileUri = CACHE_DIR + `${trackId}.mp3`;
            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            if (fileInfo.exists) {
                return fileUri;
            }
            return null;
        } catch (error) {
            console.error('Error getting cached song:', error);
            return null;
        }
    },

    // Get cache size in bytes
    getCacheSize: async (): Promise<number> => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
            if (!dirInfo.exists) {
                return 0;
            }

            const files = await FileSystem.readDirectoryAsync(CACHE_DIR);
            let totalSize = 0;

            for (const file of files) {
                const fileInfo = await FileSystem.getInfoAsync(CACHE_DIR + file);
                if (fileInfo.exists && !fileInfo.isDirectory) {
                    totalSize += fileInfo.size || 0;
                }
            }

            return totalSize;
        } catch (error) {
            console.error('Error getting cache size:', error);
            return 0;
        }
    },

    // Clear all cache
    clearCache: async (): Promise<void> => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
            if (dirInfo.exists) {
                await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
                await cacheManager.init();
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    },

    // Format bytes to human readable
    formatSize: (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
};
