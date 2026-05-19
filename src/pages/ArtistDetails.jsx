import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, ArrowLeft, CheckCircle, Users } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { formatDuration, getArtist } from '../api/api';

const ArtistDetails = () => {
  const { id } = useParams();
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
        const artistData = await getArtist(id);
        if (artistData) {
          setData(artistData);
        }
      } catch (error) {
        console.error("Fetch artist error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
        <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-text-secondary font-black uppercase tracking-[0.3em] text-xs">Summoning Artist Data</p>
      </div>
    );
  }

  if (!data) return (
     <div className="flex flex-col items-center justify-center h-[70vh] gap-8">
        <h2 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Artist Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-primary text-white rounded-2xl font-black">GO BACK</button>
     </div>
  );

  const tracks = data?.topSongs || [];
  const isFav = favorites.some(f => f.id === data?.id);

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
      {/* Hero Header */}
      <div className="relative -mx-10 -mt-10 px-10 pt-24 pb-16 mb-12 overflow-hidden rounded-b-[4rem] border-b border-white/10 h-[50vh] flex items-end">
        {data?.image && (
          <div 
            className="absolute inset-0 z-0 scale-110 blur-xl opacity-20"
            style={{ backgroundImage: `url(${data.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        <div 
          className="absolute inset-0 z-0"
          style={{ backgroundImage: `url(${data?.image || ''})`, backgroundSize: 'cover', backgroundPosition: 'center 20%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-0" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-12 p-4 rounded-full glass hover:bg-white/10 transition-all z-20 group"
        >
          <ArrowLeft className="text-text-primary group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10 flex flex-col gap-6 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
             <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                <CheckCircle size={16} className="text-white" fill="currentColor" />
             </div>
             <span className="text-sm font-black uppercase tracking-[0.3em] text-text-primary">Verified Artist</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-text-primary tracking-tighter text-glow leading-[0.8]">
            {data?.name || 'Artist'}
          </h1>
          
          <div className="flex items-center gap-8 text-xl font-bold text-text-primary/90 mt-4">
             <div className="flex items-center gap-3">
                <Users size={24} className="text-primary" />
                <span>{data?.follower_count || 'Trending'} Monthly Listeners</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10">
        {/* Actions */}
        <div className="flex items-center gap-8 mb-20">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => tracks.length > 0 && handlePlayTrack(tracks[0], 0)}
            className="px-12 h-20 bg-primary text-white rounded-[2.5rem] flex items-center gap-4 shadow-xl transition-all"
          >
            <Play fill="currentColor" size={32} className="ml-1" />
            <span className="text-2xl font-black uppercase tracking-widest">Play</span>
          </motion.button>
          
          <button 
            onClick={() => toggleFavorite(data)}
            className={`px-8 h-20 rounded-[2.5rem] glass border border-white/10 font-black uppercase tracking-widest transition-all flex items-center gap-3 ${isFav ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Heart size={24} fill={isFav ? "currentColor" : "none"} />
            <span>{isFav ? 'Following' : 'Follow'}</span>
          </button>
        </div>

        {/* Popular Songs */}
        {tracks.length > 0 && (
          <div className="mb-24">
             <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-10 bg-primary rounded-full" />
                <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">Popular Songs</h2>
             </div>
             
             <div className="glass rounded-[3rem] p-4 border border-white/5 shadow-2xl">
                <div className="flex flex-col gap-2">
                   {tracks.slice(0, 10).map((track, idx) => {
                     const isCurrent = currentTrack?.id === track?.id;
                     return (
                       <div 
                          key={(track?.id || idx) + idx}
                          onClick={() => handlePlayTrack(track, idx)}
                          className={`flex items-center gap-6 p-5 rounded-3xl cursor-pointer transition-all duration-300 group ${isCurrent ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                       >
                          <span className="w-8 text-center text-lg font-black text-text-secondary group-hover:text-primary transition-colors">{idx + 1}</span>
                          <img src={track?.image} className="w-16 h-16 rounded-2xl object-cover shadow-lg bg-white/5" alt="" />
                          <div className="flex-1 min-w-0">
                             <p className={`text-xl font-black truncate tracking-tight ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>{track?.title || 'Unknown Title'}</p>
                             <p className="text-sm font-bold text-text-secondary">{track?.subtitle || ''}</p>
                          </div>
                          <div className="text-text-secondary font-black text-sm">{formatDuration(track?.duration || 0)}</div>
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        )}

        {/* Albums Section */}
        {data?.topAlbums && data.topAlbums.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-1.5 h-10 bg-primary rounded-full" />
              <h2 className="text-4xl font-black text-text-primary tracking-tight uppercase">Albums</h2>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x px-2 -mx-2">
              {data.topAlbums.map((album, idx) => (
                <motion.div 
                  key={album.id + idx} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="min-w-[240px] w-[240px] snap-start"
                >
                  <div 
                    onClick={() => navigate(`/album/${album.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl border border-white/10">
                      <img 
                        src={album.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt="" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                          <Play fill="white" size={24} className="ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-text-primary truncate px-2 group-hover:text-primary transition-colors">{album.title}</h3>
                    <p className="text-sm font-bold text-text-secondary px-2">{album.year || 'Album'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ArtistDetails;
