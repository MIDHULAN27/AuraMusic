import { API } from '../config/api';

export const artistService = {
  getArtistDetails: async (id, page = API.DEFAULT_PAGE, songCount = API.DEFAULT_LIMIT, albumCount = API.DEFAULT_LIMIT) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.ARTISTS}?id=${id}&page=${page}&songCount=${songCount}&albumCount=${albumCount}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || null;
    } catch (error) {
      console.error('Get artist details error:', error);
      return null;
    }
  },

  getArtistSongs: async (id, page = API.DEFAULT_PAGE, sortBy = 'popularity', sortOrder = 'desc') => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.ARTISTS}/${id}/songs?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || [];
    } catch (error) {
      console.error('Get artist songs error:', error);
      return [];
    }
  },

  getArtistAlbums: async (id, page = API.DEFAULT_PAGE, sortBy = 'popularity', sortOrder = 'desc') => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.ARTISTS}/${id}/albums?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || [];
    } catch (error) {
      console.error('Get artist albums error:', error);
      return [];
    }
  }
};
