import { API } from '../config/api';

export const albumService = {
  getAlbumDetails: async (id) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.ALBUMS}?id=${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data?.data || null;
    } catch (error) {
      console.error('Get album details error:', error);
      return null;
    }
  }
};
