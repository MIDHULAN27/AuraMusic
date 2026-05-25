import { API } from '../config/api';

export const playlistService = {
  getPlaylistDetails: async (id, page = API.DEFAULT_PAGE, limit = 100) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.PLAYLISTS}?id=${id}&page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || null;
    } catch (error) {
      console.error('Get playlist details error:', error);
      return null;
    }
  }
};
