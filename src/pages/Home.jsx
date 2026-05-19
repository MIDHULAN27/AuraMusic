import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, History, Heart, Star, Disc, TrendingUp, Sparkles, Globe, Zap, ListMusic } from 'lucide-react';
import { MediaCard, SectionHeader } from '../components/ui/Cards';
import { CardSkeleton } from '../components/ui/Skeleton';
import { getHomeData } from '../api/api';
import { useQueueStore } from '../store/useQueueStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useSettingsStore } from '../store/useSettingsStore';

const Home = () => {
  const navigate = useNavigate();
  const { recentlyPlayed } = useQueueStore();
  const { favorites } = useFavoritesStore();
  const { languages } = useSettingsStore();
  
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({ trending: [], charts: [], new_albums: [], top_playlists: [] });

  const fetchData = useCallback(async () => {
    // Keep existing data if we have it to avoid flash
    setLoading(true);
    try {
      const data = await getHomeData(languages.join(','));
      if (data) {
        setHomeData(data);
      }
    } catch (error) {
      console.error("Home Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [languages]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const heroItem = homeData?.trending?.[0] || homeData?.new_albums?.[0] || null;

  const renderSection = (title, items, type = 'song', icon = null) => {
    // If loading and no items, show skeletons
    if (loading && (!items || items.length === 0)) {
      return (
        <section className="mb-14">
          <SectionHeader title={title} icon={icon} />
          <div className="flex gap-6 overflow-hidden pb-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="min-w-[220px] w-[220px]">
                <CardSkeleton />
              </div>
            ))}
          </div>
        </section>
      );
    }

    // If not loading and no items, show fallback or nothing if it's recently played
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-14">
        <SectionHeader title={title} icon={icon} />
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x px-2 -mx-2 no-scrollbar">
          {items.slice(0, 15).map((item, idx) => (
            <motion.div 
              key={(item?.id || idx) + idx} 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="min-w-[220px] w-[220px] snap-start"
            >
              <MediaCard 
                id={item?.id}
                title={item?.title || item?.name || 'Unknown'}
                subtitle={item?.subtitle || ''}
                image={item?.image}
                type={item?.type || type}
                data={item}
              />
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 pb-32"
    >
      <div className="flex items-center gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-primary/20 text-primary">
          <Globe size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Global Rhythm</span>
        </div>
        {['All', 'Trending', 'Charts', 'New Releases'].map(tab => (
          <button
            key={tab}
            className="px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all glass text-text-secondary hover:text-text-primary border border-white/5"
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && !heroItem ? (
        <div className="w-full h-[550px] rounded-[3.5rem] bg-white/5 animate-pulse mb-20" />
      ) : heroItem && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative w-full h-[550px] rounded-[3.5rem] overflow-hidden mb-20 group shadow-3xl border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          
          <img 
            src={heroItem.image}
            alt="Hero" 
            className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
          />
          
          <div className="absolute bottom-0 left-0 p-12 lg:p-24 z-20 max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-full mb-10 w-fit backdrop-blur-xl"
            >
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Trending Now</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl lg:text-9xl font-black mb-10 text-text-primary tracking-tighter text-glow drop-shadow-2xl leading-[0.85]"
            >
              {heroItem.title}
            </motion.h1>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => navigate(heroItem.type === 'song' ? `/album/${heroItem.albumId}` : `/${heroItem.type}/${heroItem.id}`)}
                className="px-12 py-6 bg-primary text-white font-black rounded-[2rem] flex items-center gap-4 shadow-2xl hover:scale-105 transition-all neon-glow"
              >
                <Play fill="currentColor" size={28} className="ml-1" />
                <span className="text-lg uppercase">Listen Now</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-10">
        {renderSection("Trending Now", homeData.trending, 'song', <TrendingUp />)}
        {renderSection("New Albums", homeData.new_albums, 'album', <Sparkles />)}
        {renderSection("Top Charts", homeData.charts, 'playlist', <ListMusic />)}
        {renderSection("Popular Playlists", homeData.top_playlists, 'playlist', <Star />)}
      </div>
      
      {recentlyPlayed.length > 0 && renderSection("Recently Explored", recentlyPlayed, 'song', <History />)}
      {favorites.length > 0 && renderSection("Your Celestial Favorites", favorites, 'song', <Heart />)}
    </motion.div>
  );
};

export default Home;
