export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,

  SEARCH: {
    GLOBAL: import.meta.env.VITE_GLOBAL_SEARCH,
    SONGS: import.meta.env.VITE_SEARCH_SONGS,
    ALBUMS: import.meta.env.VITE_SEARCH_ALBUMS,
    ARTISTS: import.meta.env.VITE_SEARCH_ARTISTS,
    PLAYLISTS: import.meta.env.VITE_SEARCH_PLAYLISTS,
  },

  SONGS: import.meta.env.VITE_SONGS,
  ALBUMS: import.meta.env.VITE_ALBUMS,
  ARTISTS: import.meta.env.VITE_ARTISTS,
  PLAYLISTS: import.meta.env.VITE_PLAYLISTS,

  DEFAULT_LIMIT: import.meta.env.VITE_DEFAULT_LIMIT,
  DEFAULT_PAGE: import.meta.env.VITE_DEFAULT_PAGE,
};
