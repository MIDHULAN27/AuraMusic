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
      className="max-w-7xl mx-auto px-10 pb-32 pt-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary shadow-2xl border border-primary/20">
             <LibraryIcon size={40} />
          </div>
          <div>
            <h1 className="text-6xl font-black text-text-primary tracking-tighter uppercase">Your Library</h1>
            <p className="text-text-secondary font-bold text-lg mt-1">Manage your music and playlists</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-primary text-white font-black rounded-3xl flex items-center gap-3 shadow-xl hover:scale-105 transition-all neon-glow"
        >
          <Plus size={24} /> NEW PLAYLIST
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
         <motion.div 
            whileHover={{ y: -10 }}
            onClick={() => navigate('/favorites')}
            className="h-72 rounded-[3.5rem] bg-gradient-to-br from-primary via-primary/80 to-accent p-12 relative overflow-hidden cursor-pointer group shadow-3xl"
         >
            <div className="relative z-10">
               <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8">
                  <Heart size={32} className="text-white" fill="white" />
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Liked Songs</h2>
               <p className="text-white/80 font-bold text-2xl mt-2 tracking-tight">{favorites.length} cosmic tracks</p>
            </div>
         </motion.div>

         <motion.div 
            whileHover={{ y: -10 }}
            className="h-72 rounded-[3.5rem] bg-gradient-to-br from-secondary via-secondary/80 to-primary p-12 relative overflow-hidden cursor-pointer group shadow-3xl"
         >
            <div className="relative z-10">
               <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8">
                  <ListMusic size={32} className="text-white" />
               </div>
               <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Your Playlists</h2>
               <p className="text-white/80 font-bold text-2xl mt-2 tracking-tight">{playlists.length} curated lists</p>
            </div>
         </motion.div>
      </div>

      <section className="mb-20">
         <div className="flex items-center gap-4 mb-10">
            <div className="w-1.5 h-10 bg-primary rounded-full" />
            <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase">Created Playlists</h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            <div 
               onClick={() => setShowModal(true)}
               className="aspect-square glass rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                  <Plus size={32} className="text-text-secondary group-hover:text-primary" />
               </div>
               <span className="text-sm font-black text-text-secondary group-hover:text-text-primary uppercase tracking-widest">Create New</span>
            </div>
         </div>
      </section>

      <PlaylistModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  );
};

export default Library;
