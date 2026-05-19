import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, Clock, ArrowLeft } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { formatDuration, getAlbum, getPlaylist } from '../api/api';

const AlbumDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { favorites, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const isPlaylist = location.pathname.includes('playlist');
        let result = null;
        
        if (isPlaylist) {
          result = await getPlaylist(id);
        } else {
          result = await getAlbum(id);
        }

        if (result) {
          setData({
            ...result,
            type: isPlaylist ? 'Playlist' : 'Album'
          });
        }
      } catch (error) {
        console.error("Fetch details error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, location.pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
        <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-secondary font-black uppercase tracking-[0.3em] text-xs">Summoning Cosmic Content</p>
      </div>
    );
  }

  if (!data) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <p className="text-text-primary text-2xl font-black uppercase tracking-tighter">Celestial Body Not Found</p>
      <button onClick={() => navigate(-1)} className="text-primary font-black uppercase tracking-widest hover:underline">Go Back</button>
    </div>
  );

  const tracks = data?.songs || [];
  const isFav = favorites.some(f => f.id === data?.id);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0);
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const handlePlayTrack = (track, idx) => {
    setQueue(tracks, idx);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      {/* Header */}
      <div className="relative -mx-10 -mt-10 px-10 pt-24 pb-16 mb-12 overflow-hidden rounded-b-[4rem] border-b border-white/10 min-h-[500px] flex items-end">
        {data?.image && (
          <div 
            className="absolute inset-0 z-0 blur-[100px] opacity-40 scale-125"
            style={{ backgroundImage: `url(${data.image})`, backgroundSize: 'cover' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-12 p-4 rounded-full glass hover:bg-white/10 transition-all z-20 group"
        >
          <ArrowLeft className="text-text-primary group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-end w-full">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-64 h-64 lg:w-80 lg:h-80 flex-shrink-0 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/10 group bg-white/5"
          >
            {data?.image && <img src={data.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
          </motion.div>

          <div className="flex flex-col gap-4 pb-4 flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-white">
                {data?.type || 'COLLECTION'}
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black text-text-primary tracking-tighter text-glow leading-[0.9] truncate py-2">
              {data?.title || 'Unknown Title'}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-lg font-bold text-text-secondary mt-2">
              <span className="text-text-primary">{data?.subtitle || ''}</span>
              {data?.year && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span>{data.year}</span>
                </>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>{tracks.length} Songs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10">
        {/* Actions */}
        <div className="flex items-center gap-8 mb-16 pl-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAll}
            className="px-10 h-20 bg-primary text-white rounded-[2rem] flex items-center gap-4 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Play fill="white" size={24} className="ml-1" />
            </div>
            <span className="text-xl font-black uppercase tracking-widest">Play All</span>
          </motion.button>
          
          <button 
            onClick={() => toggleFavorite(data)}
            className={`p-6 rounded-[2rem] glass transition-all ${isFav ? 'text-primary scale-110' : 'text-text-secondary hover:text-text-primary border border-white/5'}`}
          >
            <Heart size={28} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Tracklist */}
        <div className="glass rounded-[3rem] p-1 border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary/60 border-b border-white/5">
                <th className="px-10 py-8 text-center w-24">#</th>
                <th className="py-8">Title</th>
                <th className="py-8 text-right px-12 w-32"><Clock size={18} className="ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track?.id;
                return (
                  <motion.tr 
                    key={track?.id || idx}
                    onClick={() => handlePlayTrack(track, idx)}
                    className={`group cursor-pointer transition-all duration-300 ${isCurrent ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                  >
                    <td className="px-10 py-6 text-center">
                      <span className={`text-lg font-black ${isCurrent ? 'text-primary' : 'text-text-secondary'}`}>{idx + 1}</span>
                    </td>
                    <td className="py-6">
                      <div className="flex flex-col truncate">
                        <span className={`text-lg font-black truncate ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>{track?.title || 'Unknown Title'}</span>
                        <span className="text-sm font-bold text-text-secondary truncate">{track?.subtitle || ''}</span>
                      </div>
                    </td>
                    <td className="py-6 text-right px-12 text-sm font-black text-text-secondary">
                      {formatDuration(track?.duration || 0)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AlbumDetails;
