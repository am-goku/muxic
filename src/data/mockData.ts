export interface Song {
    id: string;
    title: string;
    artist: string;
    albumColor: string;
}

export const recentlyPlayed: Song[] = [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', albumColor: '#FF6B6B' },
    { id: '2', title: 'Levitating', artist: 'Dua Lipa', albumColor: '#4ECDC4' },
    { id: '3', title: 'Save Your Tears', artist: 'The Weeknd', albumColor: '#45B7D1' },
    { id: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo', albumColor: '#96CEB4' },
    { id: '5', title: 'Peaches', artist: 'Justin Bieber', albumColor: '#FFEAA7' },
    { id: '6', title: 'Montero', artist: 'Lil Nas X', albumColor: '#DDA15E' },
];

export const favorites: Song[] = [
    { id: '7', title: 'Shivers', artist: 'Ed Sheeran', albumColor: '#BC6C25' },
    { id: '8', title: 'Stay', artist: 'The Kid LAROI', albumColor: '#606C38' },
    { id: '9', title: 'Heat Waves', artist: 'Glass Animals', albumColor: '#283618' },
    { id: '10', title: 'Bad Habits', artist: 'Ed Sheeran', albumColor: '#E63946' },
    { id: '11', title: 'Butter', artist: 'BTS', albumColor: '#F4A261' },
    { id: '12', title: 'Kiss Me More', artist: 'Doja Cat', albumColor: '#E76F51' },
];

export const trending: Song[] = [
    { id: '13', title: 'As It Was', artist: 'Harry Styles', albumColor: '#2A9D8F' },
    { id: '14', title: 'Anti-Hero', artist: 'Taylor Swift', albumColor: '#264653' },
    { id: '15', title: 'Flowers', artist: 'Miley Cyrus', albumColor: '#E9C46A' },
    { id: '16', title: 'Unholy', artist: 'Sam Smith', albumColor: '#F4A261' },
    { id: '17', title: 'Calm Down', artist: 'Rema', albumColor: '#E76F51' },
    { id: '18', title: 'Die For You', artist: 'The Weeknd', albumColor: '#8338EC' },
];

export const youMayLike: Song[] = [
    { id: '19', title: 'Vampire', artist: 'Olivia Rodrigo', albumColor: '#3A0CA3' },
    { id: '20', title: 'Cruel Summer', artist: 'Taylor Swift', albumColor: '#4361EE' },
    { id: '21', title: 'Snooze', artist: 'SZA', albumColor: '#4CC9F0' },
    { id: '22', title: 'Paint The Town Red', artist: 'Doja Cat', albumColor: '#F72585' },
    { id: '23', title: 'Greedy', artist: 'Tate McRae', albumColor: '#B5179E' },
    { id: '24', title: 'Water', artist: 'Tyla', albumColor: '#7209B7' },
];
