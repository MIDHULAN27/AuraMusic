import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Heart, Music, Disc, Plus, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import Logo from '../ui/Logo';

const Sidebar = () => {
  const location = useLocation();
  const { setShowPlaylist } = useUIStore();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const collectionLinks = [
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Albums', path: '/albums', icon: Disc },
    { name: 'Artists', path: '/artists', icon: Music },
  ];

  return (
    <aside className="w-72 flex-shrink-0 h-full flex flex-col glass z-20 relative shadow-2xl border-r border-white/5 overflow-hidden">
      <div className="p-10">
        <Logo />
      </div>

      <nav className="flex-1 px-6 py-2 space-y-10 overflow-y-auto no-scrollbar">
        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-black uppercase tracking-widest text-text-secondary mb-4 opacity-70">
            Menu
          </h3>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'text-text-primary font-bold bg-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <Icon size={22} className={`relative z-10 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="relative z-10 text-[15px]">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-black uppercase tracking-widest text-text-secondary mb-4 opacity-70">
            Collection
          </h3>
          {collectionLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'text-text-primary font-bold bg-secondary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <Icon size={22} className={`relative z-10 transition-colors ${isActive ? 'text-secondary' : 'group-hover:text-secondary'}`} />
                <span className="relative z-10 text-[15px]">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <button 
          onClick={() => setShowPlaylist(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black text-[15px] flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-300 neon-glow hover:neon-glow-active shadow-xl"
        >
          <Plus size={20} />
          <span>Create Playlist</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
