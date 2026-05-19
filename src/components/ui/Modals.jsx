import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Shuffle, Heart, Plus, Trash2, Edit2, Upload, LogOut, Check, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95%] md:max-w-7xl'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          className={`${sizes[size]} w-full glass rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border border-white/20 mx-auto z-10`}
        >
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10 bg-white/5 flex-shrink-0">
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter truncate mr-4 uppercase">{title}</h2>
            <button onClick={onClose} className="p-3 rounded-full bg-white/5 hover:bg-primary/20 text-text-secondary hover:text-primary transition-all flex-shrink-0 border border-white/5">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar scroll-smooth">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const AuthModal = ({ isOpen, onClose, initialType = 'login' }) => {
  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type === 'login' ? 'Welcome Back' : 'Join AuraMusic'} size="sm">
      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'signup' && (
            <div>
              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Username</label>
              <input 
                type="text" 
                required
                className="w-full glass-card border border-white/5 rounded-2xl p-5 text-text-primary placeholder:text-text-secondary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                placeholder="aura_explorer"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full glass-card border border-white/5 rounded-2xl p-5 text-text-primary placeholder:text-text-secondary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              placeholder="explorer@aura.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full glass-card border border-white/5 rounded-2xl p-5 text-text-primary placeholder:text-text-secondary/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all neon-glow uppercase tracking-widest">
            {type === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-text-secondary">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setType(type === 'login' ? 'signup' : 'login')} className="text-primary hover:underline ml-2">
            {type === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </Modal>
  );
};

export const PlaylistModal = ({ isOpen, onClose, playlist = null }) => {
  const [formData, setFormData] = useState(playlist || { name: '', description: '', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop' });
  const [selectedSongs, setSelectedSongs] = useState([]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-background flex flex-col overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 pointer-events-none cinematic-gradient opacity-30" 
        />
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-8 md:p-12 border-b border-white/10 glass">
          <div className="flex items-center gap-6">
             <button onClick={onClose} className="p-4 rounded-full glass hover:bg-white/10 transition-all">
                <X size={28} />
             </button>
             <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter uppercase">{playlist ? "Edit Playlist" : "Create New Collection"}</h1>
          </div>
          <button 
            onClick={() => { /* Save logic */ onClose(); }}
            className="px-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all neon-glow uppercase tracking-widest"
          >
            {playlist ? "SAVE CHANGES" : "CREATE NOW"}
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-8 md:p-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-16">
            {/* Left: Info */}
            <div className="space-y-12">
               <div className="relative group w-full aspect-square rounded-[3.5rem] overflow-hidden shadow-3xl border border-white/10 bg-white/5">
                  <img src={formData.image} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-md">
                    <Upload size={48} className="text-white mb-4" />
                    <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Update Cover</span>
                  </div>
               </div>

               <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4 ml-1">Playlist Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter a celestial name..."
                      className="w-full glass-card border border-white/10 rounded-[2rem] p-6 text-2xl font-black text-text-primary placeholder:text-text-secondary/20 focus:border-primary outline-none transition-all shadow-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4 ml-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What is the mood of this galaxy?"
                      className="w-full glass-card border border-white/10 rounded-[2rem] p-6 text-lg font-bold text-text-primary placeholder:text-text-secondary/20 focus:border-primary outline-none h-48 resize-none transition-all shadow-xl"
                    />
                  </div>
               </div>
            </div>

            {/* Right: Song Selection */}
            <div className="space-y-12">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-1.5 h-8 bg-secondary rounded-full" />
                     <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase">Add Cosmic Tracks</h2>
                  </div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{selectedSongs.length} Selected</span>
               </div>

               <div className="glass rounded-[3rem] p-4 border border-white/10 min-h-[500px] flex flex-col">
                  <div className="p-4 border-b border-white/5 mb-4">
                     <div className="relative">
                        <input 
                           type="text" 
                           placeholder="Search for songs to add..." 
                           className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-text-primary outline-none focus:border-primary/50 transition-all"
                        />
                        <Shuffle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                     </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40">
                     <Disc size={64} className="mb-6 animate-spin-slow" />
                     <p className="text-xl font-black uppercase tracking-widest">Search to expand your galaxy</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export const SettingsModal = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleTheme } = useUIStore();
  const { volume, setVolume } = usePlayerStore();

  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between p-6 rounded-[2rem] glass-card border border-white/5 hover:border-primary/20 transition-all group">
      <div className="flex flex-col gap-1">
        <span className="font-black text-text-primary text-sm uppercase tracking-wider group-hover:text-primary transition-colors">{label}</span>
        {description && <span className="text-[10px] text-text-secondary font-medium tracking-tight">{description}</span>}
      </div>
      <div className="ml-6 flex-shrink-0">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ active, onToggle }) => (
    <button 
      onClick={onToggle}
      className={`w-14 h-7 rounded-full transition-all relative flex items-center px-1 ${active ? 'bg-primary shadow-[0_0_20px_rgba(167,139,250,0.5)]' : 'bg-white/10'}`}
    >
      <motion.div 
        animate={{ x: active ? 28 : 0 }}
        className="w-5 h-5 rounded-full bg-white shadow-lg" 
      />
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Celestial Settings" size="lg">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6 ml-2">
               <div className="w-1 h-4 bg-primary rounded-full" />
               <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Audio & Visuals</h3>
            </div>
            <div className="space-y-4">
              <SettingRow label="Deep Space Theme" description="Toggle dark mode aesthetics">
                <Toggle active={isDarkMode} onToggle={toggleTheme} />
              </SettingRow>
              <div className="p-6 rounded-[2rem] glass-card border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-black text-text-primary text-sm uppercase tracking-wider">System Volume</span>
                  <span className="text-primary font-black text-xs">{volume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={e => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6 ml-2">
               <div className="w-1 h-4 bg-secondary rounded-full" />
               <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.3em]">Playback Engine</h3>
            </div>
            <div className="space-y-4">
              <SettingRow label="Bitrate Quality" description="Higher quality uses more data">
                <select className="bg-white/5 border border-white/10 rounded-xl text-primary font-black text-[10px] uppercase tracking-widest focus:outline-none cursor-pointer p-2 px-3">
                  <option value="High" className="bg-background">Super (320kbps)</option>
                  <option value="Normal" className="bg-background">Standard</option>
                </select>
              </SettingRow>
              <SettingRow label="Cosmic Autoplay" description="Keep the music flowing">
                <Toggle active={true} onToggle={() => {}} />
              </SettingRow>
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6 ml-2">
               <div className="w-1 h-4 bg-accent rounded-full" />
               <h3 className="text-[11px] font-black text-accent uppercase tracking-[0.3em]">Privacy & Soul</h3>
            </div>
            <div className="space-y-4">
              <SettingRow label="Ghost Session" description="Hide your listening activity">
                <Toggle active={false} onToggle={() => {}} />
              </SettingRow>
              <SettingRow label="Sync Everywhere" description="Share progress across devices">
                <Toggle active={true} onToggle={() => {}} />
              </SettingRow>
            </div>
          </section>

          <section className="pt-6">
             <button className="w-full p-6 rounded-[2rem] bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all shadow-xl border border-red-500/20 active:scale-95">
                Reset Celestial Sync
             </button>
             <p className="text-[9px] text-text-secondary text-center mt-6 font-black uppercase tracking-widest opacity-30">AuraMusic Engine v1.0.4-Beta</p>
          </section>
        </div>
      </div>
    </Modal>
  );
};
