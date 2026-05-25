import { API } from '../config/api';

export const songService = {
  getSongDetails: async (id) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SONGS}/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || [];
    } catch (error) {
      console.error('Get song details error:', error);
      return [];
    }
  },

  getSongSuggestions: async (id, limit = API.DEFAULT_LIMIT) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.SONG_SUGGESTIONS}/${id}/suggestions?limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || [];
    } catch (error) {
      console.error('Get song suggestions error:', error);
      return [];
    }
  }
};
