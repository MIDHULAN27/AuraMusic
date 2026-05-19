import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Sparkles, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { useLyrics } from '../../context/LyricsContext';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useUIStore } from '../../store/useUIStore';

const LyricsModal = ({ isOpen, onClose, track }) => {
  const { lyrics, parsedLyrics, activeLine, isFetching } = useLyrics();
  const { isPlaying, setSeekTo } = usePlayerStore();
  const { isDarkMode } = useUIStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef(null);
  const lineRefs = useRef([]);

  // Auto-scroll logic
  useEffect(() => {
    if (activeLine !== -1 && lineRefs.current[activeLine] && scrollRef.current) {
      lineRefs.current[activeLine].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLine]);

  const copyToClipboard = () => {
    if (!lyrics?.text) return;
    navigator.clipboard.writeText(lyrics.text.replace(/\[.*\]/g, ''));
    alert('Lyrics copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className={`fixed inset-0 z-[100] flex flex-col overflow-hidden transition-colors duration-500 ${isFullscreen ? 'p-0' : ''} ${isDarkMode ? 'bg-[#070414]' : 'bg-[#F8FAFC]'}`}
      >
        {/* Background Visualizer Effect */}
        <div className="absolute inset-0 z-0">
           <img src={track?.image} className="w-full h-full object-cover blur-[150px] opacity-30 scale-150" alt="" />
           <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? 'from-[#070414]/80 via-[#070414]/40 to-[#070414]' : 'from-[#F8FAFC]/80 via-[#F8FAFC]/40 to-[#F8FAFC]'}`} />
        </div>
        
        <div className="relative z-10 flex justify-between items-center p-8 lg:p-16">
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-16 h-16 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <img src={track?.image} alt="Art" className="w-full h-full object-cover" />
            </motion.div>
            <div className="space-y-1">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl lg:text-5xl font-black text-text-primary tracking-tighter text-glow truncate max-w-xs md:max-w-md"
              >
                {track?.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-lg text-primary font-black uppercase tracking-widest opacity-80"
              >
                {track?.subtitle}
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-3 md:p-4 glass hover:bg-white/10 rounded-full border border-white/10 transition-all text-text-secondary hover:text-text-primary"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
            </button>
            <button 
              onClick={copyToClipboard}
              className="p-3 md:p-4 glass hover:bg-white/10 rounded-full border border-white/10 transition-all text-text-secondary hover:text-text-primary"
              title="Copy Lyrics"
            >
              <Copy size={24} />
            </button>
            <button 
              onClick={onClose}
              className="p-3 md:p-4 glass hover:bg-white/10 rounded-full border border-white/10 transition-all text-text-secondary hover:text-text-primary"
              title="Close"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="relative z-10 flex-1 overflow-y-auto px-8 lg:px-40 pb-60 no-scrollbar scroll-smooth"
        >
          <div className="max-w-6xl py-20">
            {isFetching ? (
              <div className="flex flex-col items-center gap-10 py-40">
                <div className="flex gap-2">
                   {[0, 1, 2, 3].map(i => (
                     <motion.div 
                        key={i}
                        animate={{ height: [20, 60, 20] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="w-2 bg-primary rounded-full shadow-[0_0_20px_rgba(167,139,250,0.8)]"
                     />
                   ))}
                </div>
                <p className="text-2xl font-black text-text-secondary/20 tracking-[0.5em] uppercase">Unfolding Words</p>
              </div>
            ) : parsedLyrics.length > 0 ? (
              <div className="space-y-10 lg:space-y-16">
                {parsedLyrics.map((line, i) => (
                  <motion.p 
                    key={i}
                    ref={el => lineRefs.current[i] = el}
                    initial={{ opacity: 0.1, y: 20 }}
                    animate={{ 
                      opacity: activeLine === i ? 1 : 0.15,
                      scale: activeLine === i ? 1.05 : 0.95,
                      x: activeLine === i ? 0 : -20
                    }}
                    transition={{ duration: 0.5 }}
                    className={`text-3xl md:text-5xl lg:text-8xl font-black transition-all cursor-pointer origin-left leading-[1.1] md:leading-[0.95] tracking-tighter ${activeLine === i ? 'text-text-primary text-glow translate-x-4 md:translate-x-8' : 'text-text-primary hover:opacity-50'}`}
                    onClick={() => setSeekTo(line.time)}
                  >
                    {line.text}
                  </motion.p>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8 py-40 text-center">
                <Music size={80} className="text-primary/20" />
                <h3 className="text-5xl font-black text-text-primary/10 uppercase tracking-tighter">Pure Harmony</h3>
                <p className="text-xl text-text-secondary font-black max-w-xl mx-auto tracking-tight">The cosmos is silent here. Let the vibration be your guide.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Shadow Overlays */}
        <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${isDarkMode ? 'from-[#070414]' : 'from-[#F8FAFC]'} to-transparent z-10 pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t ${isDarkMode ? 'from-[#070414] via-[#070414]/90' : 'from-[#F8FAFC] via-[#F8FAFC]/90'} to-transparent z-10 pointer-events-none`} />
      </motion.div>
    </AnimatePresence>
  );
};

export default LyricsModal;
