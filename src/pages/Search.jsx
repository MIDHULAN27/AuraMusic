import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Clock, TrendingUp, Music, Disc, User, ListMusic, History } from 'lucide-react';
import { MediaCard } from '../components/ui/Cards';
import { CardSkeleton } from '../components/ui/Skeleton';
import { searchAll, searchSongs, searchAlbums, searchArtists, searchPlaylists } from '../api/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  
  // Sync query when URL changes (e.g. clicking "See all" again with different term)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) setQuery(q);
  }, [searchParams]);

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches')) || [];
    } catch { return []; }
  });
  const [results, setResults] = useState({ songs: [], albums: [], artists: [], playlists: [] });
  const [activeType, setActiveType] = useState('all'); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const saveSearch = useCallback((q) => {
    if (!q.trim() || q.length < 2) return;
    setRecentSearches(prev => {
      const updated = [q, ...prev.filter(item => item !== q)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const performSearch = useCallback(async (q, isNewSearch = true) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults({ songs: [], albums: [], artists: [], playlists: [] });
      return;
    }
    
    if (isNewSearch) {
      setIsSearching(true);
      setPage(0);
      setHasMore(true);
    }

    try {
      const currentPage = isNewSearch ? 0 : page + 1;
      
      if (activeType === 'all') {
        const data = await searchAll(trimmed);
        if (data) setResults(data);
        setHasMore(false); // Global search doesn't pagination easily in this UI
      } else {
        let items = [];
        if (activeType === 'songs') items = await searchSongs(trimmed, currentPage);
        else if (activeType === 'albums') items = await searchAlbums(trimmed, currentPage);
        else if (activeType === 'artists') items = await searchArtists(trimmed, currentPage);
        else if (activeType === 'playlists') items = await searchPlaylists(trimmed, currentPage);
        
        if (items && items.length > 0) {
          setResults(prev => ({
            ...prev,
            [activeType]: isNewSearch ? items : [...prev[activeType], ...items]
          }));
          setPage(currentPage);
          if (items.length < 20) setHasMore(false);
        } else {
          setHasMore(false);
        }
      }
      
      if (isNewSearch && trimmed.length > 3) saveSearch(trimmed);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [activeType, page, saveSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) performSearch(query, true);
    }, 500); 
    return () => clearTimeout(timer);
  }, [query, activeType, performSearch]);

  const clearSearch = () => {
    setQuery('');
    setResults({ songs: [], albums: [], artists: [], playlists: [] });
  };

  const renderResultSection = (title, items, type, icon) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-12 md:mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="p-3 md:p-4 rounded-2xl md:rounded-3xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
              {icon}
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tighter uppercase">{title}</h2>
          </div>
          <span className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] pl-1">{items.length} Cosmic Matches</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={(item?.id || i) + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <MediaCard 
                id={item?.id} 
                title={item?.title || item?.name} 
                subtitle={item?.subtitle} 
                image={item?.image} 
                type={type} 
                data={item} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 md:space-y-16 pb-40 pt-4 md:pt-12 px-4 md:px-10"
    >
      <div className="relative max-w-4xl mx-auto z-50" ref={searchRef}>
        <div className="absolute inset-0 bg-primary/10 rounded-2xl md:rounded-[3.5rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-1000" />
        <div className="relative glass rounded-2xl md:rounded-[3.5rem] flex items-center p-2 md:p-4 pl-4 md:pl-10 pr-4 md:pr-6 border border-white/10 group-focus-within:border-primary/50 shadow-3xl transition-all">
          <SearchIcon className="text-text-secondary group-focus-within:text-primary transition-colors flex-shrink-0" size={20} className="md:w-8 md:h-8" />
          <input
            type="text"
            value={query}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists, songs..."
            className="w-full bg-transparent border-none py-3 px-4 md:py-6 md:px-8 text-lg md:text-3xl font-black text-text-primary placeholder:text-text-secondary/20 focus:outline-none"
          />
          <AnimatePresence>
            {query && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={clearSearch}
                className="p-4 glass rounded-full hover:bg-white/10 text-text-primary transition-all border border-white/5"
              >
                <X size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && !query && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 10 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 glass rounded-2xl md:rounded-[2.5rem] border border-white/10 p-4 md:p-6 shadow-3xl z-50"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 ml-2 md:ml-4">
                <History size={16} className="text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Recent Journeys</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentSearches.map((s, i) => (
                  <button
                    key={s + i}
                    onClick={() => {
                      setQuery(s);
                      setShowSuggestions(false);
                    }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-primary/10 text-text-primary font-bold transition-all group"
                  >
                    <span className="truncate">{s}</span>
                    <TrendingUp size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 justify-center">
        {['all', 'songs', 'albums', 'artists'].map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-10 py-3.5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all ${
              activeType === type 
              ? 'bg-primary text-white shadow-xl neon-glow' 
              : 'glass text-text-secondary hover:text-text-primary border border-white/5 hover:border-white/20'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {!query ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-20">
          <section>
            <div className="flex items-center gap-4 mb-8 md:mb-12">
               <div className="w-1.5 h-8 md:h-10 bg-primary rounded-full" />
               <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tighter uppercase">Explore Galaxies</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
              {[
                { name: 'K-Pop', color: 'from-pink-500 to-rose-600', icon: '✨' },
                { name: 'Phonk', color: 'from-zinc-700 to-black', icon: '💀' },
                { name: 'Lo-fi', color: 'from-purple-500 to-violet-600', icon: '🌙' },
                { name: 'Jazz', color: 'from-amber-500 to-yellow-600', icon: '🎷' },
                { name: 'Rock', color: 'from-orange-500 to-red-600', icon: '🎸' },
                { name: 'Pop', color: 'from-emerald-500 to-teal-700', icon: '💿' },
              ].map((genre) => (
                <motion.div 
                  key={genre.name}
                  whileHover={{ scale: 1.05, y: -10 }}
                  onClick={() => setQuery(genre.name)}
                  className={`relative h-28 sm:h-48 rounded-2xl sm:rounded-[3rem] bg-gradient-to-br ${genre.color} p-4 sm:p-8 overflow-hidden cursor-pointer shadow-2xl group flex items-center justify-center`}
                >
                  <div className="absolute top-2 right-4 sm:top-4 sm:right-6 text-2xl sm:text-4xl opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:rotate-12">{genre.icon}</div>
                  <h3 className="text-lg sm:text-3xl font-black text-white z-10 relative tracking-tighter uppercase">{genre.name}</h3>
                </motion.div>
              ))}
            </div>
          </section>

          <aside className="space-y-8 md:space-y-16">
            <section className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/10">
               <div className="flex items-center gap-4 mb-6 md:mb-10">
                  <TrendingUp className="text-secondary" size={24} className="md:w-7 md:h-7" />
                  <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight uppercase">Trending Tags</h2>
               </div>
               <div className="flex flex-wrap gap-3">
                  {['Latest Releases', 'Global Top 50', 'Viral Phonk', 'Aura Chill', 'Night Drive', 'Hardstyle'].map(tag => (
                    <button key={tag} onClick={() => setQuery(tag)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary hover:border-primary/20 transition-all">
                       {tag}
                    </button>
                  ))}
               </div>
            </section>
          </aside>
        </div>
      ) : (
        <section className="space-y-20">
          {isSearching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
              {Array(12).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-24">
              {(activeType === 'all' || activeType === 'songs') && renderResultSection("Songs", results.songs, "song", <Music size={32} />)}
              {(activeType === 'all' || activeType === 'albums') && renderResultSection("Albums", results.albums, "album", <Disc size={32} />)}
              {(activeType === 'all' || activeType === 'artists') && renderResultSection("Artists", results.artists, "artist", <User size={32} />)}
              {(activeType === 'all' || activeType === 'playlists') && renderResultSection("Playlists", results.playlists, "playlist", <ListMusic size={32} />)}
              
              {activeType !== 'all' && hasMore && (
                <div className="flex justify-center pt-10">
                  <button 
                    onClick={() => performSearch(query, false)}
                    disabled={isSearching}
                    className="px-12 py-5 rounded-3xl glass border border-white/10 text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl disabled:opacity-50"
                  >
                    {isSearching ? 'Summoning More...' : 'Explore Further'}
                  </button>
                </div>
              )}
              
              {results.songs.length === 0 && results.albums.length === 0 && results.artists.length === 0 && results.playlists.length === 0 && !isSearching && (
                <div className="text-center py-40 glass rounded-[4rem] border border-white/10 flex flex-col items-center">
                  <SearchIcon size={80} className="text-primary/10 mb-8 animate-pulse" />
                  <h3 className="text-5xl font-black text-text-primary mb-6 tracking-tighter uppercase">No Celestial Matches</h3>
                  <p className="text-xl text-text-secondary max-w-lg mx-auto font-bold px-4 opacity-60">We couldn't find any resonance matching "{query}" in this galaxy.</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </motion.div>
  );
};

export default Search;
