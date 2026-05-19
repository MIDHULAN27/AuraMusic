import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicCard = ({ item, type = 'song', onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card p-4 rounded-3xl cursor-pointer group flex flex-col gap-4 relative overflow-hidden"
      onClick={() => onClick && onClick(item)}
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
        <img 
          src={item.image || item.coverUrl} 
          alt={item.title || item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <motion.button 
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_rgba(167,139,250,0.6)]"
          >
            <Play size={24} className="ml-1" fill="currentColor" />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col px-1">
        <h3 className="font-bold text-white text-lg truncate group-hover:text-primary transition-colors">
          {item.title || item.name}
        </h3>
        <p className="text-sm text-text-secondary truncate mt-1">
          {type === 'artist' ? 'Artist' : (item.artist || item.description || 'Various Artists')}
        </p>
      </div>
    </motion.div>
  );
};

export default MusicCard;
