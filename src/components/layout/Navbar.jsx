import { Search, Bell, Settings, User, LogOut, Moon, Sun, X, LogIn, UserPlus, Menu, Heart } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SettingsModal, AuthModal } from '../ui/Modals';
import Logo from '../ui/Logo';
import { searchAll } from '../../api/api';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isDarkMode, toggleTheme, setShowSettings, setShowAuth } = useUIStore();
  const { volume } = usePlayerStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ songs: [], albums: [], artists: [], playlists: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchSuggestions(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
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

  return (
    <header className="sticky top-0 z-40 h-24 w-full glass flex items-center justify-between px-6 md:px-10 border-b border-white/5">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <div className="lg:hidden">
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
        <div ref={searchRef} className="relative max-w-md w-full ml-0 md:ml-4 group">
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
            {showSearchSuggestions && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 glass rounded-3xl overflow-hidden shadow-2xl z-50 p-2 border border-white/10"
              >
                {isSearching ? (
                  <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
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

                          // Play the song directly
                          const { setQueue } = useQueueStore.getState();
                          const { setCurrentTrack, setIsPlaying } = usePlayerStore.getState();
                          
                          if (trackToPlay.url) {
                            setQueue([trackToPlay], 0);
                            setCurrentTrack(trackToPlay);
                            setIsPlaying(true);
                          } else {
                            console.error(`[Navbar] Cannot play song, URL still missing`, trackToPlay);
                            if (trackToPlay.albumId) navigate(`/album/${trackToPlay.albumId}`);
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
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-85 sm:w-96 glass rounded-[2.5rem] overflow-hidden shadow-2xl z-[60] border border-white/20"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <h3 className="font-black text-text-primary uppercase tracking-widest text-[11px]">Notifications</h3>
                  <button className="text-[10px] text-primary hover:text-primary/80 uppercase font-black transition-colors px-3 py-1 bg-primary/10 rounded-full">Clear all</button>
                </div>
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/5">
                    <Bell size={28} className="text-text-secondary/20" />
                  </div>
                  <p className="text-text-secondary text-xs font-black uppercase tracking-[0.2em] opacity-50">No new alerts</p>
                </div>
              </motion.div>
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
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-64 glass rounded-3xl overflow-hidden shadow-2xl z-50 p-2 border border-white/10"
              >
                <div className="p-6 text-center border-b border-white/5 bg-white/5">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover rounded-full border-2 border-white/10" />
                  </div>
                  <h4 className="text-text-primary font-black text-lg truncate tracking-tight">Explorer</h4>
                  <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Free Member</p>
                </div>
                <div className="p-2 space-y-1">
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
            )}
          </AnimatePresence>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
