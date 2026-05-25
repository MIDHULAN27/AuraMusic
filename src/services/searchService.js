import { API } from '../config/api';

export const searchService = {
  globalSearch: async (query) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SEARCH.GLOBAL}?query=${query}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || { songs: { results: [] }, albums: { results: [] }, artists: { results: [] }, playlists: { results: [] } };
    } catch (error) {
      console.error('Global search error:', error);
      return { songs: { results: [] }, albums: { results: [] }, artists: { results: [] }, playlists: { results: [] } };
    }
  },

  searchSongs: async (query, page = API.DEFAULT_PAGE, limit = API.DEFAULT_LIMIT) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SEARCH.SONGS}?query=${query}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data?.results || [];
    } catch (error) {
      console.error('Search songs error:', error);
      return [];
    }
  },

  searchAlbums: async (query, page = API.DEFAULT_PAGE, limit = API.DEFAULT_LIMIT) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SEARCH.ALBUMS}?query=${query}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data?.results || [];
    } catch (error) {
      console.error('Search albums error:', error);
      return [];
    }
  },

  searchArtists: async (query, page = API.DEFAULT_PAGE, limit = API.DEFAULT_LIMIT) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SEARCH.ARTISTS}?query=${query}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data?.results || [];
    } catch (error) {
      console.error('Search artists error:', error);
      return [];
    }
  },

  searchPlaylists: async (query, page = API.DEFAULT_PAGE, limit = API.DEFAULT_LIMIT) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SEARCH.PLAYLISTS}?query=${query}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data?.results || [];
    } catch (error) {
      console.error('Search playlists error:', error);
      return [];
    }
  }
};
