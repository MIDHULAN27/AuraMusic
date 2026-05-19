import axios from 'axios';

const API_BASE_URL = 'https://saavn.sumit.co/api/';

/**
 * High-Quality Mock Data for Fallback
 */
export const MOCK_TRACKS = [
  { 
    id: 'mock1', 
    title: 'Stellar Drift', 
    subtitle: 'Cosmic Voyager', 
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    album: 'Galactic Horizon',
    duration: 240,
    type: 'song'
  },
  { 
    id: 'mock2', 
    title: 'Nebula Pulse', 
    subtitle: 'Aura Collective', 
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&h=500&fit=crop', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    album: 'Deep Space',
    duration: 180,
    type: 'song'
  }
];

/**
 * Robust HTML entity decoder
 */
export const decodeHtmlEntities = (text) => {
  if (!text || typeof text !== 'string') return text || '';
  try {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || text;
  } catch (error) {
    return text.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
};

/**
 * Safely extracts high-res image from API response
 */
const getSafeImage = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop';
  
  if (Array.isArray(image)) {
    const highRes = image.find(img => img.quality === '500x500') || image[image.length - 1];
    return highRes?.url || highRes?.link || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop';
  }
  
  if (typeof image === 'string') return image;
  return image?.url || image?.link || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop';
};

/**
 * Safely extracts high-quality audio URL
 */
const getSafeAudio = (downloadUrl) => {
  if (!downloadUrl || !Array.isArray(downloadUrl) || downloadUrl.length === 0) return '';
  const highQuality = downloadUrl.find(d => d.quality === '320kbps') || downloadUrl[downloadUrl.length - 1];
  const link = highQuality?.link || highQuality?.url || '';
  return link ? link.replace('http:', 'https:') : '';
};

/**
 * Normalizes API track data
 */
export const normalizeTrack = (track) => {
  if (!track) return null;
  
  const audioUrl = getSafeAudio(track.downloadUrl);
  
  return {
    id: String(track.id),
    title: decodeHtmlEntities(track.name || track.title || 'Unknown Track'),
    subtitle: decodeHtmlEntities(
      track.artists?.primary?.[0]?.name || 
      track.primaryArtists || 
      track.singers || 
      track.subtitle || 
      'Aura Artist'
    ),
    image: getSafeImage(track.image),
    url: audioUrl,
    duration: parseInt(track.duration || 0) || 0,
    album: decodeHtmlEntities(track.album?.name || track.album || ''),
    albumId: String(track.album?.id || track.albumId || ''),
    type: 'song',
    language: track.language,
    year: track.year,
    raw: track
  };
};

/**
 * Base fetch utility
 */
const apiFetch = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams(params);
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_BASE_URL}${cleanEndpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error.message);
    return null;
  }
};

/**
 * Search all categories
 */
export const searchAll = async (query) => {
  if (!query) return { songs: [], albums: [], artists: [], playlists: [] };
  const data = await apiFetch('search', { query });
  
  if (!data) return { songs: [], albums: [], artists: [], playlists: [] };

  return {
    songs: (data.songs?.results || []).map(normalizeTrack).filter(Boolean),
    albums: (data.albums?.results || []).map(a => ({
      id: String(a.id),
      title: decodeHtmlEntities(a.title || a.name || ''),
      subtitle: decodeHtmlEntities(a.description || a.artist || 'Album'),
      image: getSafeImage(a.image),
      type: 'album'
    })),
    artists: (data.artists?.results || []).map(ar => ({
      id: String(ar.id),
      name: decodeHtmlEntities(ar.title || ar.name || ''),
      subtitle: 'Artist',
      image: getSafeImage(ar.image),
      type: 'artist'
    })),
    playlists: (data.playlists?.results || []).map(p => ({
      id: String(p.id),
      title: decodeHtmlEntities(p.title || p.name || ''),
      subtitle: 'Playlist',
      image: getSafeImage(p.image),
      type: 'playlist'
    }))
  };
};

/**
 * Specific Search Fetchers
 */
export const searchSongs = async (query, page = 0, limit = 50) => {
  const data = await apiFetch('/search/songs', { query, page, limit });
  return (data?.results || []).map(normalizeTrack).filter(Boolean);
};

export const searchAlbums = async (query, page = 0, limit = 50) => {
  const data = await apiFetch('/search/albums', { query, page, limit });
  return (data?.results || []).map(a => ({
    id: String(a.id),
    title: decodeHtmlEntities(a.title || a.name || ''),
    subtitle: decodeHtmlEntities(a.description || a.artist || 'Album'),
    image: getSafeImage(a.image),
    type: 'album'
  }));
};

export const searchArtists = async (query, page = 0, limit = 50) => {
  const data = await apiFetch('/search/artists', { query, page, limit });
  return (data?.results || []).map(ar => ({
    id: String(ar.id),
    name: decodeHtmlEntities(ar.title || ar.name || ''),
    subtitle: 'Artist',
    image: getSafeImage(ar.image),
    type: 'artist'
  }));
};

export const searchPlaylists = async (query, page = 0, limit = 50) => {
  const data = await apiFetch('/search/playlists', { query, page, limit });
  return (data?.results || []).map(p => ({
    id: String(p.id),
    title: decodeHtmlEntities(p.title || p.name || ''),
    subtitle: 'Playlist',
    image: getSafeImage(p.image),
    type: 'playlist'
  }));
};

/**
 * Get Home Data (Modules)
 */
export const getHomeData = async (language = 'tamil,english,hindi') => {
  const normalizeCollection = (items, type) => {
    return (items || []).map(item => {
      if (type === 'song') return normalizeTrack(item);
      return {
        id: String(item.id || ''),
        title: decodeHtmlEntities(item.title || item.name || ''),
        subtitle: decodeHtmlEntities(item.subtitle || ''),
        image: getSafeImage(item.image),
        type: item.type || type
      };
    }).filter(Boolean);
  };

  try {
    // Try modules first as specified in prompt
    const data = await apiFetch('modules', { language });
    
    if (data) {
      return {
        trending: normalizeCollection(data.trending?.songs, 'song'),
        charts: normalizeCollection(data.charts, 'playlist'),
        new_albums: normalizeCollection(data.albums, 'album'),
        top_playlists: normalizeCollection(data.playlists, 'playlist')
      };
    }
    
    // Fallback if modules endpoint is down/missing
    console.warn("Home modules endpoint failed, using language-aware fallback...");
    
    const langArray = language.split(',').filter(Boolean);
    const mainLang = langArray[0] || 'hindi';
    
    // For trending, we try to get a mix if multiple languages
    const languagesToFetch = langArray.slice(0, 3); // Fetch top 3 languages
    
    const results = await Promise.all(languagesToFetch.map(async (lang) => {
      const [t, a] = await Promise.all([
        searchSongs(`Trending ${lang}`),
        searchAlbums(`New ${lang}`)
      ]);
      return { t, a };
    }));

    // Merge results
    const mixedTrending = [];
    const mixedAlbums = [];
    
    for (let i = 0; i < 15; i++) {
      results.forEach(res => {
        if (res.t?.[i]) mixedTrending.push(res.t[i]);
        if (res.a?.[i]) mixedAlbums.push(res.a[i]);
      });
    }

    // Get some charts/playlists from the first language
    const [charts, playlists] = await Promise.all([
      searchPlaylists(`Top ${mainLang}`),
      searchPlaylists(`${mainLang} Hits`)
    ]);

    return {
      trending: mixedTrending.length ? mixedTrending : MOCK_TRACKS,
      new_albums: mixedAlbums,
      charts: charts || [],
      top_playlists: playlists || []
    };
  } catch (error) {
    console.error("Home data fetch error:", error);
    return { trending: MOCK_TRACKS, charts: [], new_albums: [], top_playlists: [] };
  }
};

/**
 * Details fetchers
 */
export const getSongDetails = async (ids) => {
  const data = await apiFetch(`/songs/${ids}`);
  if (!data || !Array.isArray(data)) return null;
  return data.map(normalizeTrack).filter(Boolean);
};

export const getSongSuggestions = async (id, limit = 10) => {
  const data = await apiFetch(`/songs/${id}/suggestions`, { limit });
  return (data || []).map(normalizeTrack).filter(Boolean);
};

export const getAlbum = async (id) => {
  const data = await apiFetch(`/albums`, { id });
  if (!data) return null;
  return {
    ...data,
    title: decodeHtmlEntities(data.name || ''),
    subtitle: decodeHtmlEntities(data.artists?.primary?.[0]?.name || ''),
    image: getSafeImage(data.image),
    songs: (data.songs || []).map(normalizeTrack).filter(Boolean)
  };
};

export const getPlaylist = async (id, page = 0, limit = 100) => {
  const data = await apiFetch(`/playlists`, { id, page, limit });
  if (!data) return null;
  return {
    ...data,
    title: decodeHtmlEntities(data.name || ''),
    subtitle: decodeHtmlEntities(data.description || 'Playlist'),
    image: getSafeImage(data.image),
    songs: (data.songs || []).map(normalizeTrack).filter(Boolean)
  };
};

export const getArtist = async (id, page = 0, songCount = 50, albumCount = 50) => {
  const data = await apiFetch(`/artists`, { id, page, songCount, albumCount });
  if (!data) return null;
  return {
    ...data,
    name: decodeHtmlEntities(data.name || ''),
    subtitle: 'Artist',
    image: getSafeImage(data.image),
    topSongs: (data.topSongs || []).map(normalizeTrack).filter(Boolean),
    topAlbums: (data.topAlbums || []).map(a => ({
      id: String(a.id),
      title: decodeHtmlEntities(a.name || ''),
      image: getSafeImage(a.image),
      type: 'album'
    }))
  };
};

export const getArtistSongs = async (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
  const data = await apiFetch(`/artists/${id}/songs`, { page, sortBy, sortOrder });
  return (data || []).map(normalizeTrack).filter(Boolean);
};

export const getArtistAlbums = async (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
  const data = await apiFetch(`/artists/${id}/albums`, { page, sortBy, sortOrder });
  return (data || []).map(a => ({
    id: String(a.id),
    title: decodeHtmlEntities(a.name || ''),
    image: getSafeImage(a.image),
    type: 'album'
  }));
};

/**
 * Lyrics Fetcher
 */
export const getLyrics = async (id) => {
  const data = await apiFetch(`/songs/${id}/lyrics`);
  if (!data) return null;
  return {
    text: data.lyrics,
    copyright: data.copyright
  };
};

/**
 * Formatting & Parsing
 */
export const formatDuration = (seconds) => {
  const s = parseInt(seconds || 0);
  if (isNaN(s)) return '0:00';
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
