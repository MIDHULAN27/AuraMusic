import { motion } from 'framer-motion';
import { Heart, Play, Shuffle } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { MediaCard } from '../components/ui/Cards';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const navigate = useNavigate();
  const { setCurrentTrack, setIsPlaying, setIsShuffled } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { favorites } = useFavoritesStore();

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      setQueue(favorites, 0);
      setCurrentTrack(favorites[0]);
      setIsPlaying(true);
    }
  };

  const handleShufflePlay = () => {
    if (favorites.length > 0) {
      setIsShuffled(true);
      const randomIdx = Math.floor(Math.random() * favorites.length);
      setQueue(favorites, randomIdx);
      setCurrentTrack(favorites[randomIdx]);
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-10 pb-32 pt-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary shadow-2xl border border-primary/20">
               <Heart size={40} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-6xl font-black text-text-primary tracking-tighter uppercase">Liked Songs</h1>
              <p className="text-text-secondary text-xl font-bold mt-1">{favorites.length} cosmic tracks in your heart</p>
            </div>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShufflePlay}
              className="px-8 py-4 glass text-text-primary font-black rounded-3xl flex items-center gap-3 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Shuffle size={24} />
              <span>SHUFFLE</span>
            </button>
            <button 
              onClick={handlePlayAll}
              className="px-10 py-5 bg-primary text-white font-black rounded-3xl flex items-center gap-3 shadow-2xl hover:scale-105 transition-all neon-glow"
            >
              <Play fill="currentColor" size={24} />
              <span>PLAY ALL</span>
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-40 glass rounded-[4rem] border border-white/5 flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-10">
             <Heart size={64} className="text-primary/30" />
          </div>
          <h3 className="text-5xl font-black text-text-primary mb-6 tracking-tighter uppercase">Your Heart is Empty</h3>
          <p className="text-xl text-text-secondary max-w-lg mx-auto font-bold">Start exploring and like some tracks to build your personal cosmic collection.</p>
          <button onClick={() => navigate('/search')} className="mt-12 px-10 py-5 bg-primary text-white font-black rounded-3xl hover:scale-105 transition-all shadow-xl">FIND MUSIC</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {favorites.map((song, i) => (
            <motion.div
              key={song.id + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MediaCard 
                id={song.id}
                title={song.title}
                subtitle={song.subtitle}
                image={song.image}
                type="song"
                data={song}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Favorites;
