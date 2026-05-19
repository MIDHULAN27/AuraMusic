import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { useQueueStore } from '../store/useQueueStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { User, Mail, Music, Heart, Play, Clock, TrendingUp, Edit3, Camera, LogOut, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUIStore();
  const { favorites } = useFavoritesStore();
  const { recentlyPlayed } = useQueueStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [imagePreview, setImagePreview] = useState(null);

  const stats = [
    { label: 'Total Listening Time', value: '124h', icon: Clock, color: 'text-primary' },
    { label: 'Favorite Genre', value: 'Phonk', icon: Music, color: 'text-secondary' },
    { label: 'Top Artist', value: 'Moonlight', icon: TrendingUp, color: 'text-accent' },
    { label: 'Liked Songs', value: favorites.length, icon: Heart, color: 'text-red-500' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 pb-32 max-w-7xl mx-auto space-y-12">
      <section className="relative group">
        <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-50 rounded-[3rem]" />
        <div className="relative glass rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-white/10">
          <div className="relative group/avatar">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-2xl relative overflow-hidden">
              <img src={imagePreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"} alt="" className="w-full h-full object-cover rounded-full" />
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera size={32} className="text-white mb-2" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-text-primary mb-2 uppercase">Cosmic Explorer</h1>
              <p className="text-xl text-text-secondary font-medium flex items-center justify-center md:justify-start gap-2">
                <Mail size={18} /> explorer@auramusic.io
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
              <button onClick={() => setIsEditing(!isEditing)} className="px-8 py-3 glass text-text-primary font-black rounded-full border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
                <Edit3 size={18} /> {isEditing ? 'SAVE PROFILE' : 'EDIT PROFILE'}
              </button>
              <button onClick={() => toast.success('Logged out successfully')} className="px-8 py-3 bg-red-500/10 text-red-500 font-black rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                <LogOut size={18} /> LOGOUT
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] border border-white/5 group hover:border-primary/30 transition-all"
          >
            <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <p className="text-text-secondary text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-text-primary tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase">Recently Explored</h2>
          <div className="space-y-4">
            {recentlyPlayed.slice(0, 5).map((track, idx) => (
              <div key={track.id + idx} className="group flex items-center gap-4 p-4 glass rounded-3xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                  <img src={track.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={20} className="text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-text-primary font-bold truncate group-hover:text-primary transition-colors">{track.title}</h4>
                  <p className="text-text-secondary text-sm truncate">{track.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
           <h2 className="text-3xl font-black text-text-primary tracking-tight uppercase">Preferences</h2>
           <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <div 
                onClick={() => navigate('/settings')}
                className="flex items-center justify-between p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
              >
                 <div className="flex items-center gap-4">
                    <Settings className="text-primary group-hover:rotate-90 transition-transform" />
                    <div>
                       <p className="text-text-primary font-bold">App Settings</p>
                       <p className="text-text-secondary text-xs">Audio quality, appearance, etc.</p>
                    </div>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-white/5">
                 <button className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-500/10 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg">
                    <Trash2 size={20} /> DELETE ACCOUNT
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
