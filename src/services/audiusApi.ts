// Audius API Service
// Decentralized music streaming platform with royalty-free music

const BASE_URL = 'https://discoveryprovider.audius.co/v1';

export interface AudiusUser {
    id: string;
    name: string;
    handle: string;
    profile_picture: {
        '150x150'?: string;
        '480x480'?: string;
        '1000x1000'?: string;
    } | null;
    follower_count: number;
    track_count: number;
    is_verified: boolean;
}

export interface AudiusTrack {
    id: string;
    title: string;
    user: AudiusUser;
    duration: number;
    artwork: {
        '150x150'?: string;
        '480x480'?: string;
        '1000x1000'?: string;
    } | null;
    play_count: number;
    favorite_count: number;
    repost_count: number;
    genre: string;
    mood?: string;
    release_date?: string;
    permalink: string;
}

export interface AudiusPlaylist {
    id: string;
    playlist_name: string;
    user: AudiusUser;
    artwork: {
        '150x150'?: string;
        '480x480'?: string;
        '1000x1000'?: string;
    } | null;
    track_count: number;
    total_play_count: number;
    is_album: boolean;
}

export interface AudiusResponse<T> {
    data: T;
}

class AudiusAPI {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async fetchFromAPI<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });

        const url = `${this.baseUrl}${endpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Audius API Error:', error);
            throw error;
        }
    }

    async getTrendingTracks(limit: number = 20): Promise<AudiusTrack[]> {
        try {
            const response = await this.fetchFromAPI<AudiusResponse<AudiusTrack[]>>('/tracks/trending', {
                limit,
            });
            return Array.isArray(response?.data) ? response.data : [];
        } catch (error) {
            console.error('getTrendingTracks error:', error);
            return [];
        }
    }

    async searchTracks(query: string, limit: number = 20): Promise<AudiusTrack[]> {
        try {
            const response = await this.fetchFromAPI<AudiusResponse<AudiusTrack[]>>('/tracks/search', {
                query,
                limit,
            });
            return Array.isArray(response?.data) ? response.data : [];
        } catch (error) {
            console.error('searchTracks error:', error);
            return [];
        }
    }

    async getTrack(trackId: string): Promise<AudiusTrack> {
        const response = await this.fetchFromAPI<AudiusResponse<AudiusTrack>>(`/tracks/${trackId}`);
        return response.data;
    }

    getStreamUrl(trackId: string): string {
        return `${this.baseUrl}/tracks/${trackId}/stream`;
    }

    async getTrendingPlaylists(limit: number = 20): Promise<AudiusPlaylist[]> {
        const response = await this.fetchFromAPI<AudiusResponse<AudiusPlaylist[]>>('/playlists/trending', {
            limit,
        });
        return response.data;
    }

    async getPlaylistTracks(playlistId: string): Promise<AudiusTrack[]> {
        const response = await this.fetchFromAPI<AudiusResponse<AudiusTrack[]>>(`/playlists/${playlistId}/tracks`);
        return response.data;
    }

    async getUserTracks(userId: string, limit: number = 20): Promise<AudiusTrack[]> {
        const response = await this.fetchFromAPI<AudiusResponse<AudiusTrack[]>>(`/users/${userId}/tracks`, {
            limit,
        });
        return response.data;
    }

    async searchUsers(query: string, limit: number = 20): Promise<AudiusUser[]> {
        const response = await this.fetchFromAPI<AudiusResponse<AudiusUser[]>>('/users/search', {
            query,
            limit,
        });
        return response.data;
    }
}

export const audiusAPI = new AudiusAPI(BASE_URL);
