import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Disc, Search, SortAsc, Globe } from 'lucide-react';
import { MediaCard } from '../components/ui/Cards';
import { CardSkeleton } from '../components/ui/Skeleton';
import { getHomeData, searchAlbums } from '../api/api';

const Albums = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('tamil');
  const [sortBy, setSortBy] = useState('latest');
  const [albums, setAlbums] = useState([]);

  const languages = ['tamil', 'english', 'hindi', 'telugu', 'punjabi', 'korean'];

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const data = await searchAlbums(searchQuery, 0, 40);
          setAlbums(data || []);
        } else {
          const data = await getHomeData(selectedLang);
          setAlbums(data?.new_albums || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchAlbums, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [selectedLang, searchQuery]);

  const filteredAlbums = albums
    .filter(album => {
      const title = album.title || '';
      const subtitle = album.subtitle || '';
      return title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'latest') return parseInt(b.year || 0) - parseInt(a.year || 0);
      return 0;
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 pb-32"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-text-primary mb-4 tracking-tighter uppercase">Albums</h1>
          <p className="text-text-secondary text-xl font-bold">Explore the best collections from your favorite artists</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search albums..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="glass rounded-2xl py-4 pl-12 pr-6 text-text-primary placeholder:text-text-secondary/50 focus:ring-2 focus:ring-primary/50 outline-none w-full md:w-64 border border-white/5"
            />
          </div>
          
          <div className="flex items-center gap-2 glass rounded-2xl p-2 px-4 border border-white/5">
            <Globe size={18} className="text-primary" />
            <select 
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="bg-transparent text-text-primary font-black focus:outline-none cursor-pointer uppercase text-[10px] tracking-widest"
            >
              {languages.map(l => <option key={l} value={l} className="bg-background text-text-primary">{l.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 glass rounded-2xl p-2 px-4 border border-white/5">
            <SortAsc size={18} className="text-primary" />
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent text-text-primary font-black focus:outline-none cursor-pointer uppercase text-[10px] tracking-widest"
            >
              <option value="latest" className="bg-background text-text-primary">LATEST</option>
              <option value="popular" className="bg-background text-text-primary">POPULAR</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array(10).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredAlbums.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 glass rounded-[3rem] border border-white/5"
        >
          <Disc size={100} className="mx-auto text-primary/20 mb-8 animate-spin-slow" />
          <h3 className="text-4xl font-black text-text-primary mb-4 tracking-tighter uppercase">No Cosmic Collections</h3>
          <p className="text-xl text-text-secondary font-bold">Try adjusting your filters or search terms.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredAlbums.map((album, i) => (
            <motion.div
              key={album.id + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MediaCard 
                id={album.id}
                title={album.title}
                subtitle={album.subtitle}
                image={album.image}
                type="album"
                data={album}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Albums;
