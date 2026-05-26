import { Search, Bell, Settings, User, LogOut, Moon, Sun, X, LogIn, UserPlus, Menu, Heart } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore } from '../../store/useUIStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useQueueStore } from '../../store/useQueueStore';
import { SettingsModal, AuthModal } from '../ui/Modals';
import Logo from '../ui/Logo';
import { searchAll } from '../../api/api';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isDarkMode, toggleTheme, setShowSettings, setShowAuth, isSidebarOpen, setSidebarOpen } = useUIStore();
  const { volume } = usePlayerStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS || []);
  const [showProfile, setShowProfile] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ songs: [], albums: [], artists: [], playlists: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchDropdownPos, setSearchDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const updateSearchDropdownPos = useCallback(() => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setSearchDropdownPos({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  }, []);

  useEffect(() => {
    if (showSearchSuggestions) {
      updateSearchDropdownPos();
      window.addEventListener('resize', updateSearchDropdownPos);
      window.addEventListener('scroll', updateSearchDropdownPos, true);
    }
    return () => {
      window.removeEventListener('resize', updateSearchDropdownPos);
      window.removeEventListener('scroll', updateSearchDropdownPos, true);
    };
  }, [showSearchSuggestions, updateSearchDropdownPos]);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('[data-portal-search]')) setShowSearchSuggestions(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target) && !e.target.closest('[data-portal-notifications]')) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target) && !e.target.closest('[data-portal-profile]')) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults({ songs: [], albums: [], artists: [], playlists: [] });
        return;
      }
      setIsSearching(true);
      const results = await searchAll(query);
      setSearchResults(results);
      setIsSearching(false);
    },
    []
  );

  // Simple debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Discover';
      case '/search': return 'Search';
      case '/favorites': return 'Favorites';
      case '/albums': return 'Albums';
      case '/artists': return 'Artists';
      case '/profile': return 'Profile';
      default: return 'Library';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-24 w-full glass flex items-center justify-between px-6 md:px-10 border-b border-white/5">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <div className="lg:hidden flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2.5 rounded-full glass-card text-text-secondary hover:text-text-primary transition-all border border-white/5 active:scale-95"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          <Logo size={24} />
        </div>
        
        <motion.h1 
          key={location.pathname}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-black tracking-tight text-text-primary text-glow hidden lg:block"
        >
          {getPageTitle()}
        </motion.h1>
        
        {/* Search input */}
        <div ref={searchRef} className="relative max-w-md w-full ml-0 md:ml-4 group hidden md:block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors z-10" size={20} />
          <input
            type="text"
            placeholder="Search artists, songs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchSuggestions(true);
            }}
            onFocus={() => setShowSearchSuggestions(true)}
            className="w-full glass-card border border-white/10 rounded-full py-2.5 md:py-3 pl-12 pr-6 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all z-10 relative"
          />

          <AnimatePresence>
            {showSearchSuggestions && searchQuery && typeof document !== 'undefined' && createPortal(
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSearchSuggestions(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
                />

                {/* Suggestions Dropdown */}
                <motion.div
                  data-portal-search="true"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'fixed',
                    top: `${searchDropdownPos.top + 8}px`,
                    left: `${Math.max(16, Math.min(searchDropdownPos.left, window.innerWidth - searchDropdownPos.width - 16))}px`,
                    width: `${Math.min(searchDropdownPos.width, window.innerWidth - 32)}px`
                  }}
                  className="glass rounded-3xl overflow-hidden shadow-2xl z-[100] p-2 border border-white/10 dark:bg-[#0B0B12]/95 bg-white/95 backdrop-blur-xl"
                >
                  {isSearching ? (
                    <div className="p-8 text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  ) : (searchResults.songs.length > 0 || searchResults.albums.length > 0) ? (
                    <div className="max-h-96 overflow-y-auto no-scrollbar p-2">
                      {searchResults.songs.slice(0, 5).map((result) => (
                        <button
                          key={result.id}
                          onClick={async () => {
                            setSearchQuery('');
                            setShowSearchSuggestions(false);
                            
                            let trackToPlay = result;
                            
                            // If it's a global search result, it might lack the audio URL
                            if (!trackToPlay.url && trackToPlay.id) {
                              console.log(`[Navbar] Fetching details for ${trackToPlay.id}`);
                              try {
                                const { getSongDetails } = await import('../../api/api');
                                const details = await getSongDetails(trackToPlay.id);
                                if (details && details[0]) {
                                  trackToPlay = details[0];
                                }
                              } catch (err) {
                                console.error(`[Navbar] Error fetching song details:`, err);
                              }
                            }

                            // Check downloadUrl or raw backup for robustness
                            if (!trackToPlay.url && trackToPlay.raw?.downloadUrl) {
                              try {
                                const { normalizeTrack } = await import('../../api/api');
                                const normalized = normalizeTrack(trackToPlay.raw);
                                if (normalized?.url) {
                                  trackToPlay = normalized;
                                }
                              } catch (err) {
                                console.error(`[Navbar] Normalization error:`, err);
                              }
                            }

                            // Play the song directly via the player store & queue store
                            try {
                              const { setQueue, addRecentlyPlayed } = useQueueStore.getState();
                              const { setCurrentTrack, setIsPlaying } = usePlayerStore.getState();
                              
                              if (trackToPlay.url) {
                                setQueue([trackToPlay], 0);
                                setCurrentTrack(trackToPlay);
                                setIsPlaying(true);
                                addRecentlyPlayed(trackToPlay);
                              } else {
                                console.error(`[Navbar] Cannot play song, URL still missing`, trackToPlay);
                                if (trackToPlay.albumId) navigate(`/album/${trackToPlay.albumId}`);
                              }
                            } catch (err) {
                              console.error(`[Navbar] Playback state sync failed:`, err);
                            }
                          }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-primary/10 rounded-2xl transition-all text-left group"
                        >
                          <img src={result.image} alt="" className="w-10 h-10 rounded-lg object-cover shadow-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-text-primary font-bold text-sm truncate group-hover:text-primary">{result.title}</p>
                            <p className="text-text-secondary text-[11px] truncate capitalize font-medium">{result.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="p-8 text-center text-text-secondary text-sm font-bold">No cosmic matches for "{searchQuery}"</p>
                  )}
                  <button 
                    onClick={() => { navigate(`/search?q=${searchQuery}`); setShowSearchSuggestions(false); }}
                    className="w-full p-4 text-center text-primary text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all mt-1 border-t border-white/5"
                  >
                    See all results
                  </button>
                </motion.div>
              </>,
              document.body
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5 ml-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 md:p-3 rounded-full glass-card hover:text-primary transition-all duration-300 hover:scale-110 relative group overflow-hidden border border-white/5"
        >
          <motion.div
            initial={false}
            animate={{ y: isDarkMode ? 0 : 40, opacity: isDarkMode ? 1 : 0 }}
            className="text-primary"
          >
            <Sun size={20} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ y: isDarkMode ? -40 : -22, opacity: isDarkMode ? 0 : 1 }}
            className="absolute text-primary"
          >
            <Moon size={20} />
          </motion.div>
        </button>

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 md:p-3 rounded-full glass-card hover:text-primary transition-all duration-300 hover:scale-110 relative border border-white/5"
          >
            <Bell size={20} className="text-text-secondary group-hover:text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-black text-white flex items-center justify-center neon-glow animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && typeof document !== 'undefined' && createPortal(
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
                />
                
                {/* Notifications Dropdown */}
                <motion.div
                  data-portal-notifications="true"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed top-24 right-6 md:right-10 mt-2 w-[calc(100vw-3rem)] sm:w-96 glass rounded-[2.5rem] overflow-hidden shadow-2xl z-[100] border border-white/10 dark:bg-[#0B0B12]/95 bg-white/95 backdrop-blur-xl"
                >
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="font-black text-text-primary uppercase tracking-widest text-[11px]">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-primary hover:text-primary/80 uppercase font-black transition-colors px-3 py-1 bg-primary/10 rounded-full"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[350px] overflow-y-auto no-scrollbar p-2">
                    {notifications.length > 0 ? (
                      <div className="space-y-1">
                        {notifications.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              // Mark as read
                              setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                            }}
                            className={`p-4 rounded-2xl transition-all cursor-pointer text-left flex items-start gap-4 hover:bg-primary/5 ${!n.read ? 'bg-primary/5 border border-primary/20' : 'border border-transparent'}`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-primary animate-pulse' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-text-primary truncate">{n.title}</span>
                                <span className="text-[9px] text-text-secondary whitespace-nowrap">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-text-secondary mt-1 leading-normal break-words">{n.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-16 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5">
                          <Bell size={28} className="text-text-secondary/20" />
                        </div>
                        <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em] opacity-50">No new alerts</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>,
              document.body
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2.5 md:p-3 rounded-full glass-card hover:text-primary transition-all duration-300 hover:scale-110 border border-white/5"
        >
          <Settings size={20} className="text-text-secondary group-hover:text-primary" />
        </button>

        {/* Auth / Profile */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full glass-card border border-white/10 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden p-0.5">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-sm font-black text-text-primary tracking-tight hidden sm:block truncate max-w-[100px]">Explorer</span>
          </button>

          <AnimatePresence>
            {showProfile && typeof document !== 'undefined' && createPortal(
              <>
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowProfile(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
                />
                
                {/* Profile Dropdown */}
                <motion.div
                  data-portal-profile="true"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed top-24 right-6 md:right-10 mt-2 w-[calc(100vw-3rem)] sm:w-64 glass rounded-3xl overflow-hidden shadow-2xl z-[100] border border-white/10 dark:bg-[#0B0B12]/95 bg-white/95 backdrop-blur-xl p-2"
                >
                  <div className="p-6 text-center border-b border-white/5 bg-white/5 rounded-2xl mb-2">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl">
                      <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover rounded-full border-2 border-white/10" />
                    </div>
                    <h4 className="text-text-primary font-black text-lg truncate tracking-tight">Explorer</h4>
                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Free Member</p>
                  </div>
                  <div className="space-y-1">
                    <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 rounded-2xl transition-all text-left text-sm font-bold text-text-primary group">
                      <User size={18} className="text-primary group-hover:scale-110 transition-transform" />
                      <span>My Profile</span>
                    </button>
                    <button onClick={() => { navigate('/favorites'); setShowProfile(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 rounded-2xl transition-all text-left text-sm font-bold text-text-primary group">
                      <Heart size={18} className="text-secondary group-hover:scale-110 transition-transform" />
                      <span>Favorites</span>
                    </button>
                  </div>
                </motion.div>
              </>,
              document.body
            )}
          </AnimatePresence>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
