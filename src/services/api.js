const BASE_URL = '/api';

const fetchApi = async (params) => {
  const query = new URLSearchParams({
    _format: 'json',
    _marker: '0',
    ctx: 'web6dot0',
    ...params,
  }).toString();

  try {
    const response = await fetch(`${BASE_URL}?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const saavnApi = {
  // Search
  searchAll: (query) => fetchApi({ __call: 'autocomplete.get', query }),
  searchSongs: (query, page = 1) => fetchApi({ __call: 'search.getResults', q: query, p: page, n: 20 }),
  searchAlbums: (query, page = 1) => fetchApi({ __call: 'search.getAlbumResults', q: query, p: page, n: 20 }),
  
  // Home/Trending
  getTrending: () => fetchApi({ __call: 'webapi.get' }), // Contains new trending, top charts etc.
  
  // Details
  getSongDetails: (pids) => fetchApi({ __call: 'song.getDetails', pids }),
  getAlbumDetails: (albumid) => fetchApi({ __call: 'content.getAlbumDetails', albumid }),
  getPlaylistDetails: (listid) => fetchApi({ __call: 'playlist.getDetails', listid }),
};

export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const decodeHtmlEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};
