import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    return { currentTrack: null, queue: [], favorites: [], recentlyPlayed: [] };
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('currentTrack');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [queue, setQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('queue');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [originalQueue, setOriginalQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('originalQueue');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('volume');
      return saved ? parseInt(saved) : 80;
    } catch (e) {
      return 80;
    }
  });

  const [isShuffled, setIsShuffled] = useState(() => {
    try {
      return localStorage.getItem('isShuffled') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [repeatMode, setRepeatMode] = useState(() => {
    try {
      return localStorage.getItem('repeatMode') || 'none';
    } catch (e) {
      return 'none';
    }
  });
  
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem('recentlyPlayed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const audioRef = useRef(new Audio());

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem('volume', volume);
      if (audioRef.current) {
        audioRef.current.volume = (volume || 0) / 100;
      }
    } catch (e) {}
  }, [volume]);

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites || []));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed || []));
    } catch (e) {}
  }, [recentlyPlayed]);

  useEffect(() => {
    try {
      if (currentTrack) localStorage.setItem('currentTrack', JSON.stringify(currentTrack));
      localStorage.setItem('queue', JSON.stringify(queue || []));
      localStorage.setItem('originalQueue', JSON.stringify(originalQueue || []));
      localStorage.setItem('isShuffled', isShuffled);
      localStorage.setItem('repeatMode', repeatMode);
    } catch (e) {}
  }, [currentTrack, queue, originalQueue, isShuffled, repeatMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      setProgress(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue, currentTrack, repeatMode, isShuffled]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      try {
        switch(e.code) {
          case 'Space':
            e.preventDefault();
            togglePlay();
            break;
          case 'ArrowRight':
            if (e.ctrlKey || e.metaKey) playNext();
            else seek((audioRef.current?.currentTime || 0) + 5);
            break;
          case 'ArrowLeft':
            if (e.ctrlKey || e.metaKey) playPrevious();
            else seek((audioRef.current?.currentTime || 0) - 5);
            break;
          case 'ArrowUp':
            setVolume(prev => Math.min(100, (prev || 0) + 5));
            break;
          case 'ArrowDown':
            setVolume(prev => Math.max(0, (prev || 0) - 5));
            break;
          default:
            break;
        }
      } catch (err) {}
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTrack, isPlaying]);

  const playTrack = (track, newQueue = []) => {
    if (!track || !track.url) {
      console.warn("Invalid track or missing URL", track);
      return;
    }
    
    try {
      setCurrentTrack(track);
      if (Array.isArray(newQueue) && newQueue.length > 0) {
        setQueue(newQueue);
        setOriginalQueue(newQueue);
      } else if ((queue || []).length === 0) {
        setQueue([track]);
        setOriginalQueue([track]);
      }

      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.error("Playback error:", e);
            setIsPlaying(false);
          });
      }

      // Update recently played
      setRecentlyPlayed(prev => {
        const filtered = (prev || []).filter(t => t?.id !== track?.id);
        return [track, ...filtered].slice(0, 20);
      });
    } catch (e) {
      console.error("Error in playTrack:", e);
    }
  };

  const togglePlay = () => {
    if (!currentTrack || !audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } catch (e) {}
  };

  const playNext = () => {
    if (!queue || queue.length === 0 || !currentTrack) return;
    const currentIndex = queue.findIndex(t => t?.id === currentTrack?.id);
    
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    } else if (repeatMode === 'all') {
      playTrack(queue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    if (!queue || queue.length === 0 || !currentTrack) return;
    const currentIndex = queue.findIndex(t => t?.id === currentTrack?.id);
    
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    } else if (repeatMode === 'all') {
      playTrack(queue[queue.length - 1]);
    } else {
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      setQueue(originalQueue || []);
    } else {
      const shuffled = [...(queue || [])].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const toggleFavorite = (track) => {
    if (!track) return;
    setFavorites(prev => {
      const isFav = (prev || []).find(t => t?.id === track?.id);
      if (isFav) return (prev || []).filter(t => t?.id !== track?.id);
      return [...(prev || []), track];
    });
  };

  const seek = (time) => {
    if (!audioRef.current) return;
    const safeTime = Math.max(0, Math.min(time, duration || 0));
    audioRef.current.currentTime = safeTime;
    setProgress(safeTime);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        queue,
        setQueue,
        isPlaying,
        progress,
        duration,
        volume,
        setVolume,
        isShuffled,
        repeatMode,
        recentlyPlayed,
        favorites,
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        seek
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
