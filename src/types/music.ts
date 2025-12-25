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

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';
