import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { MediaCard } from '../components/ui/Cards';
import { CardSkeleton } from '../components/ui/Skeleton';
import { searchArtists } from '../api/api';

const Artists = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        let data;
        if (!searchQuery) {
          // Show top artists by default
          data = await searchArtists('Top Artists', 0, 30);
          setArtists(data || []);
        } else {
          // Dedicated search for more results
          data = await searchArtists(searchQuery, 0, 30);
          setArtists(data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchArtists, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 pb-32"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-text-primary mb-4 tracking-tighter uppercase">Artists</h1>
          <p className="text-text-secondary text-xl font-bold">Connect with the creators who inspire you</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search creators..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="glass rounded-2xl py-5 pl-14 pr-8 text-text-primary placeholder:text-text-secondary/50 focus:ring-2 focus:ring-primary/50 outline-none w-full md:w-96 border border-white/5 shadow-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array(10).fill(0).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : artists.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 glass rounded-[3rem] border border-white/5"
        >
          <Users size={100} className="mx-auto text-primary/20 mb-8" />
          <h3 className="text-4xl font-black text-text-primary mb-4 tracking-tighter uppercase">No Cosmic Creators</h3>
          <p className="text-xl text-text-secondary font-bold">Search for an artist to begin.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {artists.map((artist, i) => (
            <motion.div
              key={artist.id + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MediaCard 
                id={artist.id}
                title={artist.name}
                subtitle={artist.subtitle || 'Artist'}
                image={artist.image}
                type="artist"
                data={artist}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Artists;
