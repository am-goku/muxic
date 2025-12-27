export interface LocalSong {
    id: string;
    filename: string;
    uri: string;
    duration: number;
    mediaType: string;
    creationTime: number;
}

export interface AudioFolder {
    path: string;
    name: string;
    songCount: number;
    songs: LocalSong[];
}

export interface StreamingTrack {
    id: string;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
    streamUrl: string;
}

export type PlayableTrack = LocalSong | StreamingTrack;

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';
