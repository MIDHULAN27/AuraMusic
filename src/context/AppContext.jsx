import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/ui/Toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    return { user: {}, settings: { appearance: {} }, playlists: [], notifications: [] };
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Feedback State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch (e) {
      return false;
    }
  });

  // User Profile State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : {
        username: 'Guest Explorer',
        email: '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        stats: { listeningTime: '124h', favoriteGenre: 'Phonk', topArtist: 'Aura Collective' }
      };
    } catch (e) {
      return { username: 'Guest Explorer', avatar: '' };
    }
  });

  // Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('settings');
      const defaultSettings = {
        appearance: {
          theme: 'dark',
          accentColor: '#A78BFA',
          uiDensity: 'comfortable',
          glassIntensity: 50,
          fontSize: 'medium'
        },
        playback: {
          quality: 'High',
          crossfade: 0,
          autoplay: true,
          normalizeVolume: true,
          explicitContent: true
        },
        notifications: {
          push: true,
          email: false,
          newReleases: true,
          recommendations: true
        },
        privacy: {
          privateSession: false,
          listeningActivity: true,
          searchHistory: true
        }
      };
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return { appearance: { theme: 'dark' } };
    }
  });

  // Playlists State
  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('playlists');
      return saved ? JSON.parse(saved) : [
        { id: 'p1', name: 'My Favorites', description: 'Songs I love', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop', songs: [] },
        { id: 'p2', name: 'Chill Vibes', description: 'Relaxing tracks', image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=200&h=200&fit=crop', songs: [] }
      ];
    } catch (e) {
      return [];
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS || []);
  const [unreadCount, setUnreadCount] = useState((MOCK_NOTIFICATIONS || []).filter(n => !n?.read).length);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return (parsed?.appearance?.theme || 'dark') === 'dark';
    }
    return true;
  });

  // Apply theme class instantly and persist
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setSettings(prev => {
      if (prev.appearance.theme === (isDarkMode ? 'dark' : 'light')) return prev;
      return {
        ...prev,
        appearance: { ...prev.appearance, theme: isDarkMode ? 'dark' : 'light' }
      };
    });
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--glass-blur', `${settings.appearance.glassIntensity * 0.4}px`);
  }, [settings.appearance.glassIntensity]);

  useEffect(() => {
    try {
      localStorage.setItem('isLoggedIn', isLoggedIn);
    } catch (e) {}
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('playlists', JSON.stringify(playlists));
    } catch (e) {}
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    setUnreadCount((notifications || []).filter(n => !n?.read).length);
  }, [notifications]);

  // Actions
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const login = (userData) => {
    setUser(prev => ({ ...prev, ...(userData || {}) }));
    setIsLoggedIn(true);
    showToast('Logged in successfully!');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({
      username: 'Guest Explorer',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
      stats: { listeningTime: '0h', favoriteGenre: '-', topArtist: '-' }
    });
    showToast('Logged out');
  };

  const updateProfile = (newData) => {
    setUser(prev => ({ ...prev, ...(newData || {}) }));
    showToast('Profile updated!');
  };

  const createPlaylist = (playlist) => {
    const newPlaylist = {
      ...(playlist || {}),
      id: `p${Date.now()}`,
      songs: []
    };
    setPlaylists(prev => [...(prev || []), newPlaylist]);
    showToast('Playlist created!');
    return newPlaylist;
  };

  const deletePlaylist = (id) => {
    setPlaylists(prev => (prev || []).filter(p => p?.id !== id));
    showToast('Playlist deleted');
  };

  const updatePlaylist = (id, updates) => {
    setPlaylists(prev => (prev || []).map(p => p?.id === id ? { ...p, ...(updates || {}) } : p));
    showToast('Playlist updated!');
  };

  const addToPlaylist = (playlistId, song) => {
    if (!song) return;
    setPlaylists(prev => (prev || []).map(p => {
      if (p?.id === playlistId) {
        if ((p?.songs || []).find(s => s?.id === song?.id)) return p;
        showToast(`Added to ${p.name}`);
        return { ...p, songs: [...(p?.songs || []), song] };
      }
      return p;
    }));
  };

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists(prev => (prev || []).map(p => {
      if (p?.id === playlistId) {
        showToast('Removed from playlist');
        return { ...p, songs: (p?.songs || []).filter(s => s?.id !== songId) };
      }
      return p;
    }));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => (prev || []).map(n => n?.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const updateSettings = (section, newData) => {
    if (!section) return;
    setSettings(prev => ({
      ...prev,
      [section]: { ...(prev?.[section] || {}), ...(newData || {}) }
    }));
    showToast('Settings saved!');
  };

  const resetSettings = () => {
    const defaultSettings = {
      appearance: { theme: 'dark', accentColor: '#A78BFA', uiDensity: 'comfortable', glassIntensity: 50, fontSize: 'medium' },
      playback: { quality: 'High', crossfade: 0, autoplay: true, normalizeVolume: true, explicitContent: true },
      notifications: { push: true, email: false, newReleases: true, recommendations: true },
      privacy: { privateSession: false, listeningActivity: true, searchHistory: true }
    };
    setSettings(defaultSettings);
    setIsDarkMode(true);
    showToast('Settings reset to default');
  };

  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleTheme,
      isLoggedIn,
      login,
      logout,
      user,
      updateProfile,
      playlists,
      createPlaylist,
      deletePlaylist,
      updatePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      notifications,
      unreadCount,
      markNotificationAsRead,
      clearNotifications,
      settings,
      updateSettings,
      resetSettings,
      showToast
    }}>
      {children}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </AppContext.Provider>
  );
};
