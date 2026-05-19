import { motion } from 'framer-motion';
import { Play, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useQueueStore } from '../../store/useQueueStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { decodeHtmlEntities, normalizeTrack, getSongDetails } from '../../api/api';

export const MediaCard = ({ 
  id,
  title, 
  subtitle, 
  image, 
  type = 'album',
  data
}) => {
  const navigate = useNavigate();
  const { setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { toggleFavorite, favorites } = useFavoritesStore();
  
  const isFav = id && favorites?.some(f => f?.id === String(id));

  const handleClick = () => {
    if (!id) return;
    if (type === 'album' || type === 'playlist') navigate(`/album/${id}`);
    else if (type === 'artist') navigate(`/artist/${id}`);
    else if (type === 'song') {
      handlePlay();
    }
  };

  const handlePlay = async (e) => {
    if (e) e.stopPropagation();
    if (data) {
      console.log(`[MediaCard] Attempting to play ${type}:`, data.title || data.name || id);
      
      if (type === 'song') {
        // Ensure we have a valid track object
        let trackToPlay = (data.url || data.downloadUrl) ? 
          (data.url ? data : normalizeTrack(data)) : 
          normalizeTrack(data.raw || data);
          
        // If still no URL, it might be a global search result lacking downloadUrl
        if (!trackToPlay?.url && id) {
          console.log(`[MediaCard] Missing URL for song ${id}, fetching full details...`);
          try {
            const fullDetails = await getSongDetails(id);
            console.log(`[MediaCard] Fetch result for ${id}:`, fullDetails);
            if (fullDetails && fullDetails[0]) {
              trackToPlay = fullDetails[0];
              console.log(`[MediaCard] Updated trackToPlay with fetched details. URL: ${trackToPlay.url}`);
            } else {
              console.warn(`[MediaCard] getSongDetails returned nothing for ${id}`);
            }
          } catch (err) {
            console.error(`[MediaCard] Error fetching song details for ${id}:`, err);
          }
        }
          
        if (trackToPlay && trackToPlay.url) {
          console.log(`[MediaCard] Playing track: ${trackToPlay.title} (${trackToPlay.id})`);
          setQueue([trackToPlay], 0);
          setCurrentTrack(trackToPlay);
          setIsPlaying(true);
        } else {
          console.warn(`[MediaCard] Cannot play track: missing audio URL after fetch attempt`, trackToPlay);
          if (id) navigate(`/album/${data.albumId || id}`);
        }
      } else if (id) {
        console.log(`[MediaCard] Navigating to ${type}: ${id}`);
        const targetPath = (type === 'artist') ? `/artist/${id}` : `/album/${id}`;
        navigate(targetPath);
      }
    } else {
      console.warn(`[MediaCard] handlePlay called without data for ID: ${id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass rounded-3xl p-4 cursor-pointer group relative overflow-hidden flex flex-col gap-4 border border-white/5 shadow-lg"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
        <img 
          src={image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop'} 
          alt={title || 'Media'} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${type === 'artist' ? 'rounded-full' : 'rounded-2xl'}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(167,139,250,0.6)] hover:shadow-[0_0_25px_rgba(167,139,250,0.8)] transition-all transform translate-y-4 group-hover:translate-y-0"
            onClick={handlePlay}
          >
            <Play fill="currentColor" size={24} className="ml-1" />
          </motion.button>
        </div>
        <button 
          className={`absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 ${isFav ? 'text-primary' : 'hover:text-primary'}`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            const favoriteData = data || {id, title, subtitle, image, type};
            const normalized = favoriteData.url ? favoriteData : normalizeTrack(favoriteData.raw || favoriteData);
            if (normalized) toggleFavorite(normalized); 
          }}
        >
          <Heart size={18} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-col px-1">
        <h3 className="font-bold text-text-primary text-lg truncate group-hover:text-primary transition-colors">{decodeHtmlEntities(title || '')}</h3>
        <p className="text-sm text-text-secondary truncate mt-1">{decodeHtmlEntities(subtitle || '')}</p>
      </div>
    </motion.div>
  );
};

export const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center justify-between mb-6 px-1">
    <div className="flex items-center gap-3">
      {icon && <span className="text-primary">{icon}</span>}
      <h2 className="text-2xl font-extrabold tracking-tight text-text-primary uppercase">{title}</h2>
    </div>
    <button className="text-xs font-black text-text-secondary hover:text-primary transition-colors uppercase tracking-widest">
      Show all
    </button>
  </div>
);
