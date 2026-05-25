import { motion } from 'framer-motion';
import { Library as LibraryIcon, Heart, ListMusic, User, Plus } from 'lucide-react';
import { useQueueStore } from '../store/useQueueStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { MediaCard } from '../components/ui/Cards';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PlaylistModal } from '../components/ui/Modals';

const Library = () => {
  const navigate = useNavigate();
  const { favorites } = useFavoritesStore();
  const [showModal, setShowModal] = useState(false);

  // Mock playlists since we don't have a backend for user playlists yet
  const playlists = [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 md:px-10 pb-32 pt-4 md:pt-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 md:gap-8 mb-10 md:mb-16">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary shadow-2xl border border-primary/20 flex-shrink-0">
             <LibraryIcon size={28} className="md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-6xl font-black text-text-primary tracking-tighter uppercase">Your Library</h1>
            <p className="text-text-secondary font-bold text-sm sm:text-lg mt-0.5 sm:mt-1">Manage your music and playlists</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-3 md:px-8 md:py-4 bg-primary text-white font-black rounded-2xl md:rounded-3xl flex items-center gap-2 md:gap-3 shadow-xl hover:scale-105 transition-all neon-glow text-xs md:text-sm"
        >
          <Plus size={20} className="md:w-6 md:h-6" /> NEW PLAYLIST
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-20">
         <motion.div 
            whileHover={{ y: -10 }}
            onClick={() => navigate('/favorites')}
            className="h-48 sm:h-72 rounded-3xl md:rounded-[3.5rem] bg-gradient-to-br from-primary via-primary/80 to-accent p-6 sm:p-12 relative overflow-hidden cursor-pointer group shadow-3xl flex flex-col justify-end"
         >
            <div className="relative z-10">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 sm:mb-8">
                  <Heart size={24} className="text-white sm:w-8 sm:h-8" fill="white" />
               </div>
               <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tighter uppercase">Liked Songs</h2>
               <p className="text-white/80 font-bold text-sm sm:text-2xl mt-1 sm:mt-2 tracking-tight">{favorites.length} cosmic tracks</p>
            </div>
         </motion.div>

         <motion.div 
            whileHover={{ y: -10 }}
            className="h-48 sm:h-72 rounded-3xl md:rounded-[3.5rem] bg-gradient-to-br from-secondary via-secondary/80 to-primary p-6 sm:p-12 relative overflow-hidden cursor-pointer group shadow-3xl flex flex-col justify-end"
         >
            <div className="relative z-10">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 sm:mb-8">
                  <ListMusic size={24} className="text-white sm:w-8 sm:h-8" />
               </div>
               <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tighter uppercase">Your Playlists</h2>
               <p className="text-white/80 font-bold text-sm sm:text-2xl mt-1 sm:mt-2 tracking-tight">{playlists.length} curated lists</p>
            </div>
         </motion.div>
      </div>

      <section className="mb-20">
         <div className="flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-1.5 h-8 md:h-10 bg-primary rounded-full" />
            <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tighter uppercase">Created Playlists</h2>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8">
            <div 
               onClick={() => setShowModal(true)}
               className="aspect-square glass rounded-2xl md:rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 md:gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group p-4"
            >
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <Plus size={24} className="text-text-secondary group-hover:text-primary md:w-8 md:h-8" />
               </div>
               <span className="text-xs md:text-sm font-black text-text-secondary group-hover:text-text-primary uppercase tracking-widest text-center">Create New</span>
            </div>
         </div>
      </section>

      <PlaylistModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  );
};

export default Library;
