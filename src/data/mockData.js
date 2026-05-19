
export const MOCK_SONGS = [
  {
    id: '1',
    title: 'Starboy',
    subtitle: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    album: 'Starboy',
    year: '2016',
    genre: 'R&B/Pop'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    subtitle: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 200,
    album: 'After Hours',
    year: '2020',
    genre: 'Synthwave'
  },
  {
    id: '3',
    title: 'Levitating',
    subtitle: 'Dua Lipa',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 203,
    album: 'Future Nostalgia',
    year: '2020',
    genre: 'Pop'
  },
  {
    id: '4',
    title: 'Save Your Tears',
    subtitle: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 215,
    album: 'After Hours',
    year: '2020',
    genre: 'Pop'
  },
  {
    id: '5',
    title: 'Heat Waves',
    subtitle: 'Glass Animals',
    image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 238,
    album: 'Dreamland',
    year: '2020',
    genre: 'Indie Pop'
  },
  {
    id: '6',
    title: 'Stay',
    subtitle: 'The Kid LAROI & Justin Bieber',
    image: 'https://images.unsplash.com/photo-1514525253344-991474154d37?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 141,
    album: 'F*CK LOVE 3: OVER YOU',
    year: '2021',
    genre: 'Pop'
  },
  {
    id: '7',
    title: 'Peaches',
    subtitle: 'Justin Bieber',
    image: 'https://images.unsplash.com/photo-1453090927415-5f45085b6a31?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 198,
    album: 'Justice',
    year: '2021',
    genre: 'R&B'
  },
  {
    id: '8',
    title: 'Good 4 U',
    subtitle: 'Olivia Rodrigo',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 178,
    album: 'SOUR',
    year: '2021',
    genre: 'Pop Rock'
  }
];

export const MOCK_ALBUMS = [
  {
    id: 'a1',
    title: 'After Hours',
    subtitle: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&h=500&fit=crop',
    year: '2020',
    genre: 'Pop/R&B',
    songCount: 14,
    songs: MOCK_SONGS.filter(s => s.album === 'After Hours')
  },
  {
    id: 'a2',
    title: 'Future Nostalgia',
    subtitle: 'Dua Lipa',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&h=500&fit=crop',
    year: '2020',
    genre: 'Dance/Pop',
    songCount: 11,
    songs: MOCK_SONGS.filter(s => s.album === 'Future Nostalgia')
  },
  {
    id: 'a3',
    title: 'Justice',
    subtitle: 'Justin Bieber',
    image: 'https://images.unsplash.com/photo-1453090927415-5f45085b6a31?w=500&h=500&fit=crop',
    year: '2021',
    genre: 'Pop',
    songCount: 16,
    songs: MOCK_SONGS.filter(s => s.album === 'Justice')
  },
  {
    id: 'a4',
    title: 'SOUR',
    subtitle: 'Olivia Rodrigo',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop',
    year: '2021',
    genre: 'Pop',
    songCount: 11,
    songs: MOCK_SONGS.filter(s => s.album === 'SOUR')
  }
];

export const MOCK_ARTISTS = [
  {
    id: 'ar1',
    name: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1514525253344-991474154d37?w=500&h=500&fit=crop',
    followers: '75.2M',
    monthlyListeners: '108.5M',
    genres: ['R&B', 'Pop', 'Synthwave'],
    bio: 'Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer, songwriter, and record producer. Known for his sonic versatility and dark lyricism, his music explores hedonism and escapism and features unconventional instrumentation and melancholic, vocal-centric production.',
    topTracks: MOCK_SONGS.filter(s => s.subtitle.includes('Weeknd')),
    albums: MOCK_ALBUMS.filter(a => a.subtitle === 'The Weeknd')
  },
  {
    id: 'ar2',
    name: 'Dua Lipa',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&h=500&fit=crop',
    followers: '42.1M',
    monthlyListeners: '72.3M',
    genres: ['Pop', 'Dance'],
    bio: 'Dua Lipa is an English singer and songwriter. After working as a model, she signed with Warner Bros. Records in 2014 and released her eponymous debut album in 2017. The album peaked at number three on the UK Albums Chart and yielded nine singles, including "Be the One", "IDGAF", and the UK number-one single "New Rules".',
    topTracks: MOCK_SONGS.filter(s => s.subtitle.includes('Dua Lipa')),
    albums: MOCK_ALBUMS.filter(a => a.subtitle === 'Dua Lipa')
  },
  {
    id: 'ar3',
    name: 'Justin Bieber',
    image: 'https://images.unsplash.com/photo-1453090927415-5f45085b6a31?w=500&h=500&fit=crop',
    followers: '68.9M',
    monthlyListeners: '85.4M',
    genres: ['Pop', 'R&B'],
    bio: 'Justin Drew Bieber is a Canadian singer. He is credited with three multi-platinum studio albums and has won numerous awards, including a Grammy Award and an American Music Award. He has been named by Forbes magazine as one of the top ten most powerful celebrities in the world three times.',
    topTracks: MOCK_SONGS.filter(s => s.subtitle.includes('Justin Bieber')),
    albums: MOCK_ALBUMS.filter(a => a.subtitle === 'Justin Bieber')
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Release', message: 'The Weeknd just dropped a new single!', time: '2h ago', read: false },
  { id: 2, title: 'Playlist Update', message: 'Your "Workout" playlist has been updated.', time: '5h ago', read: false },
  { id: 3, title: 'Artist Followed', message: 'You are now following Dua Lipa.', time: '1d ago', read: true }
];
