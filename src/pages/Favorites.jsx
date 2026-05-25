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
      className="max-w-7xl mx-auto px-4 md:px-10 pb-32 pt-4 md:pt-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
        <div>
          <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary shadow-2xl border border-primary/20 flex-shrink-0">
               <Heart size={28} className="md:w-10 md:h-10" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-6xl font-black text-text-primary tracking-tighter uppercase">Liked Songs</h1>
              <p className="text-text-secondary text-sm sm:text-xl font-bold mt-0.5 sm:mt-1">{favorites.length} cosmic tracks in your heart</p>
            </div>
          </div>
        </div>
        
        {favorites.length > 0 && (
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button 
              onClick={handleShufflePlay}
              className="px-5 py-3 md:px-8 md:py-4 glass text-text-primary font-black rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 md:gap-3 border border-white/10 hover:bg-white/10 transition-all text-xs md:text-sm flex-1 sm:flex-initial"
            >
              <Shuffle size={18} className="md:w-6 md:h-6" />
              <span>SHUFFLE</span>
            </button>
            <button 
              onClick={handlePlayAll}
              className="px-5 py-3 md:px-10 md:py-5 bg-primary text-white font-black rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 md:gap-3 shadow-2xl hover:scale-105 transition-all neon-glow text-xs md:text-sm flex-1 sm:flex-initial"
            >
              <Play fill="currentColor" size={18} className="md:w-6 md:h-6" />
              <span>PLAY ALL</span>
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-20 sm:py-40 glass rounded-2xl sm:rounded-[4rem] border border-white/5 flex flex-col items-center p-6"
        >
          <div className="w-20 h-20 sm:w-32 sm:h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 sm:mb-10">
             <Heart size={40} className="text-primary/30 sm:w-16 sm:h-16" />
          </div>
          <h3 className="text-2xl sm:text-5xl font-black text-text-primary mb-3 sm:mb-6 tracking-tighter uppercase text-center">Your Heart is Empty</h3>
          <p className="text-sm sm:text-xl text-text-secondary max-w-lg mx-auto font-bold text-center">Start exploring and like some tracks to build your personal cosmic collection.</p>
          <button onClick={() => navigate('/search')} className="mt-8 sm:mt-12 px-6 py-3.5 sm:px-10 sm:py-5 bg-primary text-white font-black rounded-xl sm:rounded-3xl hover:scale-105 transition-all shadow-xl text-sm">FIND MUSIC</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
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
