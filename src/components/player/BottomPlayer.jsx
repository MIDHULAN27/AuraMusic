import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Volume, ListMusic, Mic, 
  Repeat, Shuffle, Heart, Maximize2, X, ChevronDown, Share2, MoreHorizontal
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useQueueStore } from '../../store/useQueueStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { formatDuration } from '../../api/api';

const AudioVisualizer = ({ isPlaying }) => (
  <div className="flex items-center justify-center gap-1.5 h-16">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        animate={isPlaying ? {
          height: [12, 30, 12, 40, 12],
        } : { height: 12 }}
        transition={isPlaying ? {
          duration: 1 + (i * 0.1),
          repeat: Infinity,
          ease: "easeInOut"
        } : { duration: 0.3 }}
        className="w-1.5 bg-gradient-to-t from-primary/40 to-primary rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"
      />
    ))}
  </div>
);

const BottomPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    duration, 
    volume, 
    setVolume, 
    togglePlay, 
    repeatMode,
    setRepeatMode,
    isShuffled,
    setIsShuffled,
    setCurrentTrack,
    setProgress
  } = usePlayerStore();
  
  const { queue, currentIndex, setCurrentIndex, addToQueue, playNext, playPrevious } = useQueueStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [lyrics, setLyrics] = useState(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (currentTrack?.id && showFullscreen) {
        if (currentTrack.lyrics) {
          setLyrics({ text: currentTrack.lyrics, copyright: currentTrack.copyright });
          setIsLoadingLyrics(false);
          return;
        }

        setIsLoadingLyrics(true);
        try {
           const { getLyrics } = await import('../../api/api');
           const data = await getLyrics(currentTrack.id);
           setLyrics(data);
        } catch (error) {
           console.error("Failed to fetch lyrics:", error);
           setLyrics(null);
        }
        setIsLoadingLyrics(false);
      }
    };
    fetchLyrics();
  }, [currentTrack?.id, showFullscreen, currentTrack?.lyrics]);

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    
    const audio = document.querySelector('audio');
    if (audio) {
      audio.currentTime = time;
      setProgress(time);
    }
  };



  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;
  const isFav = currentTrack && favorites?.some(f => f?.id === String(currentTrack?.id));

  if (!currentTrack) return null;

  return (
    <>
      <AnimatePresence>
        {!showFullscreen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => {
              if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('a')) {
                setShowFullscreen(true);
              }
            }}
            className="fixed bottom-4 lg:bottom-8 left-4 lg:left-[304px] right-4 lg:right-8 h-20 lg:h-24 glass rounded-2xl lg:rounded-[2.5rem] border border-white/10 px-4 lg:px-8 flex items-center justify-between z-50 shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-pointer"
          >
            {/* Progress Bar */}
            <div 
              className="absolute -top-1 left-4 lg:left-8 right-4 lg:right-8 h-1.5 bg-white/5 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative shadow-[0_0_15px_rgba(167,139,250,0.6)]"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-xl" />
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 lg:gap-4 w-[40%] md:w-[30%] min-w-[110px] md:min-w-[150px]">
              <motion.div 
                onClick={() => setShowFullscreen(true)}
                whileHover={{ scale: 1.05 }}
                className="relative w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl cursor-pointer group flex-shrink-0"
              >
                <img src={currentTrack.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                   <Maximize2 size={16} className="text-white lg:w-5 lg:h-5" />
                </div>
              </motion.div>
              
              <div className="flex flex-col truncate">
                <span className="text-xs lg:text-base font-black text-text-primary truncate">{currentTrack.title}</span>
                <span className="text-[9px] lg:text-xs text-text-secondary truncate mt-0.5">{currentTrack.subtitle}</span>
              </div>

              <button 
                onClick={() => toggleFavorite(currentTrack)}
                className={`p-1.5 transition-colors hidden sm:block ${isFav ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <Heart size={18} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center flex-1 md:flex-initial max-w-md">
              <div className="flex items-center gap-3 lg:gap-8">
                <button 
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`transition-colors hidden sm:block ${isShuffled ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <Shuffle size={18} />
                </button>
                
                <button onClick={playPrevious} className="text-text-primary hover:text-primary transition-all active:scale-90 p-1">
                  <SkipBack size={20} fill="currentColor" className="lg:w-[22px] lg:h-[22px]" />
                </button>

                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(167,139,250,0.5)]"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" className="lg:w-6 lg:h-6" /> : <Play size={18} fill="currentColor" className="lg:w-6 lg:h-6 ml-0.5" />}
                </motion.button>

                <button onClick={playNext} className="text-text-primary hover:text-primary transition-all active:scale-90 p-1">
                  <SkipForward size={20} fill="currentColor" className="lg:w-[22px] lg:h-[22px]" />
                </button>

                <button 
                  onClick={toggleRepeat}
                  className={`relative transition-colors hidden sm:block ${repeatMode !== 'none' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <Repeat size={18} />
                  {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-primary text-white rounded-full w-3 h-3 flex items-center justify-center">1</span>}
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center justify-end gap-2 lg:gap-6 w-[20%] md:w-[30%]">
              <button 
                onClick={() => setIsQueueOpen(!isQueueOpen)}
                className={`p-2 transition-all hidden md:block ${isQueueOpen ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                <ListMusic size={20} />
              </button>

              <div className="hidden lg:flex items-center gap-3 w-24">
                 <button onClick={() => setVolume(volume === 0 ? 80 : 0)} className="text-text-secondary hover:text-text-primary">
                    {volume === 0 ? <Volume size={18} /> : <Volume2 size={18} />}
                 </button>
                 <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                 />
              </div>

              <button 
                onClick={() => setShowFullscreen(true)}
                className="text-text-secondary hover:text-text-primary p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <Maximize2 size={18} className="lg:w-5 lg:h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Player */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-[9999] bg-background flex flex-col p-4 sm:p-6 md:p-12 overflow-hidden"
          >
            {/* Background Ambient */}
            <div 
              className="absolute inset-0 z-0 opacity-20 blur-[120px] scale-150 pointer-events-none"
              style={{ backgroundImage: `url(${currentTrack.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            
            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between mb-8">
               <button onClick={() => setShowFullscreen(false)} className="p-3 md:p-4 rounded-full glass hover:bg-white/10 transition-all">
                  <ChevronDown size={28} />
               </button>
               <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-text-secondary mb-1">Playing From Collection</span>
                  <span className="text-xs md:text-sm font-bold text-text-primary text-center px-4 line-clamp-1">{currentTrack.album || 'Unknown Album'}</span>
               </div>
               <div className="relative">
                 <button onClick={() => setShowOptions(!showOptions)} className="p-3 md:p-4 rounded-full glass hover:bg-white/10 transition-all">
                    <MoreHorizontal size={24} />
                 </button>
                 <AnimatePresence>
                   {showOptions && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute right-0 mt-2 w-48 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-50 flex flex-col bg-background/90 backdrop-blur-xl"
                     >
                        <button onClick={() => { toggleFavorite(currentTrack); setShowOptions(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-primary hover:bg-white/10 transition-colors">
                           <Heart size={16} fill={isFav ? "currentColor" : "none"} className={isFav ? "text-primary" : ""} />
                           {isFav ? "Remove Favorite" : "Add to Favorites"}
                        </button>
                        <button onClick={() => { addToQueue(currentTrack); setShowOptions(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-primary hover:bg-white/10 transition-colors">
                           <ListMusic size={16} />
                           Add to Queue
                        </button>
                        <button onClick={() => { setShowOptions(false); }} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-text-primary hover:bg-white/10 transition-colors">
                           <Share2 size={16} />
                           Share Track
                        </button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>

            {/* Main Grid */}
            <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center max-w-7xl mx-auto w-full overflow-y-auto lg:overflow-hidden no-scrollbar pb-10 lg:pb-0">
               {/* Left: Art */}
               <div className="flex flex-col items-center justify-center h-full py-4 lg:py-0">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-48 h-48 sm:w-64 sm:h-64 md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] rounded-3xl sm:rounded-[3.5rem] overflow-hidden shadow-3xl border border-white/10 mb-6 lg:mb-8 group"
                  >
                     <img src={currentTrack.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                  </motion.div>
                  
                  <div className="w-full text-center px-4 max-w-xl">
                     <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-text-primary mb-2 lg:mb-3 tracking-tighter leading-tight line-clamp-2">{currentTrack.title}</h2>
                     <p className="text-sm sm:text-lg md:text-xl text-primary font-bold opacity-80">{currentTrack.subtitle}</p>
                  </div>
               </div>

               {/* Right: Lyrics & Controls */}
               <div className="flex flex-col gap-6 lg:gap-10 h-full justify-center w-full max-w-xl lg:max-w-none mx-auto py-4 lg:py-0">
                  {/* Lyrics Section */}
                  <div className="glass rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 h-40 sm:h-56 md:h-72 lg:h-96 border border-white/10 overflow-y-auto no-scrollbar mask-fade-y text-center relative">
                     <div className="space-y-4 md:space-y-6 flex flex-col justify-center min-h-full">
                        {isLoadingLyrics ? (
                           <>
                              <p className="text-xl md:text-3xl font-black text-white/40">Searching for cosmic lyrics...</p>
                              <p className="text-xl md:text-3xl font-black text-white/60 animate-pulse">Exploring the soundwaves</p>
                              <p className="text-xl md:text-3xl font-black text-white/40">Mapping the rhythm</p>
                           </>
                        ) : lyrics?.text ? (
                           <div className="text-lg md:text-2xl font-bold text-white/80 whitespace-pre-line leading-relaxed pb-10">
                              {lyrics.text.replace(/<br\s*\/?>/gi, '\n')}
                              {lyrics.copyright && <p className="text-sm font-normal text-white/40 mt-8">{lyrics.copyright}</p>}
                           </div>
                        ) : (
                           <>
                              <p className="text-xl md:text-3xl font-black text-white/40">Lyrics not available</p>
                              <p className="text-xl md:text-3xl font-black text-white/60">For this cosmic track</p>
                           </>
                        )}
                     </div>
                  </div>

                  {/* Controls Section */}
                  <div className="space-y-6 md:space-y-8">
                     {/* Seekbar */}
                     <div className="space-y-3">
                        <div 
                          className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group relative"
                          onClick={handleSeek}
                        >
                           <motion.div 
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative shadow-[0_0_15px_rgba(167,139,250,0.6)]"
                              style={{ width: `${progressPercent}%` }}
                           />
                           <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-all border-2 border-primary" style={{ left: `${progressPercent}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">
                           <span>{formatDuration(progress)}</span>
                           <span>{formatDuration(duration)}</span>
                        </div>
                     </div>

                     {/* Buttons */}
                     <div className="flex items-center justify-between px-2 md:px-0">
                        <button onClick={() => setIsShuffled(!isShuffled)} className={`p-3 md:p-4 rounded-full transition-all ${isShuffled ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary'}`}>
                           <Shuffle size={24} />
                        </button>
                        
                        <div className="flex items-center gap-6 md:gap-12">
                           <button onClick={playPrevious} className="text-text-primary hover:text-primary transition-all active:scale-90">
                              <SkipBack size={36} className="md:w-12 md:h-12" fill="currentColor" />
                           </button>
                           <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={togglePlay}
                              className="w-20 h-20 md:w-28 md:h-28 bg-primary text-white rounded-full flex items-center justify-center shadow-3xl hover:shadow-primary/50 transition-all"
                           >
                              {isPlaying ? <Pause size={36} className="md:w-12 md:h-12" fill="currentColor" /> : <Play size={36} className="md:w-12 md:h-12 ml-1" fill="currentColor" />}
                           </motion.button>
                           <button onClick={playNext} className="text-text-primary hover:text-primary transition-all active:scale-90">
                              <SkipForward size={36} className="md:w-12 md:h-12" fill="currentColor" />
                           </button>
                        </div>

                        <button onClick={toggleRepeat} className={`p-3 md:p-4 rounded-full transition-all relative ${repeatMode !== 'none' ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-text-primary'}`}>
                           <Repeat size={24} />
                           {repeatMode === 'one' && <span className="absolute top-1 right-1 text-[8px] md:text-[10px] font-black bg-primary text-white rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">1</span>}
                        </button>
                     </div>

                     {/* Volume & Extras */}
                     <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-white/10 px-2 md:px-0">
                        <div className="flex items-center gap-4 md:gap-6 w-1/3">
                           <button onClick={() => setVolume(volume === 0 ? 80 : 0)} className="text-text-secondary hover:text-text-primary">
                              {volume === 0 ? <Volume size={20} className="md:w-6 md:h-6" /> : <Volume2 size={20} className="md:w-6 md:h-6" />}
                           </button>
                           <input 
                              type="range"
                              min="0"
                              max="100"
                              value={volume}
                              onChange={(e) => setVolume(parseInt(e.target.value))}
                              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                           />
                        </div>
                        
                        <div className="flex items-center gap-4 md:gap-8">
                           <button onClick={() => toggleFavorite(currentTrack)} className={`p-2 transition-all ${isFav ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                              <Heart size={24} className="md:w-8 md:h-8" fill={isFav ? "currentColor" : "none"} />
                           </button>
                           <button onClick={() => setIsQueueOpen(!isQueueOpen)} className={`p-2 transition-all ${isQueueOpen ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                              <ListMusic size={24} className="md:w-8 md:h-8" />
                           </button>
                           <button className="text-text-secondary hover:text-text-primary p-2 hidden md:block"><Mic size={24} /></button>
                           <button className="text-text-secondary hover:text-text-primary p-2 hidden md:block"><Share2 size={24} /></button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queue View */}
      <AnimatePresence>
        {isQueueOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`fixed ${showFullscreen ? 'top-32 right-12 bottom-32 w-96' : 'bottom-36 right-8 h-[500px] w-80'} glass rounded-[2.5rem] border border-white/20 z-[10000] flex flex-col overflow-hidden shadow-3xl`}
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-black text-text-primary uppercase tracking-widest text-[11px]">Up Next</h3>
              <button onClick={() => setIsQueueOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar scroll-smooth">
              {queue.length > 0 ? queue.map((track, i) => (
                <div 
                  key={(track?.id || '') + i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setCurrentTrack(track);
                  }}
                  className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${currentIndex === i ? 'bg-primary/20 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img src={track.image} className="w-full h-full rounded-xl object-cover" alt="" />
                    {currentIndex === i && isPlaying && (
                       <div className="absolute inset-0 bg-primary/40 flex items-center justify-center rounded-xl">
                          <div className="flex gap-0.5 items-end h-3">
                             <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white" />
                             <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white" />
                             <motion.div animate={{ height: [12, 4, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-white" />
                          </div>
                       </div>
                    )}
                  </div>
                  <div className="flex-1 truncate">
                    <p className={`font-bold truncate text-sm ${currentIndex === i ? 'text-primary' : 'text-text-primary'}`}>{track.title}</p>
                    <p className="text-[10px] text-text-secondary truncate mt-0.5 uppercase tracking-widest font-black opacity-60">{track.subtitle}</p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                   <ListMusic size={48} className="mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest">Queue is currently empty</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomPlayer;
