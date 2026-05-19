import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomPlayer from '../player/BottomPlayer';
import AudioEngine from '../player/AudioEngine';
import { useUIStore } from '../../store/useUIStore';
import { SettingsModal, AuthModal, PlaylistModal } from '../ui/Modals';

const Layout = () => {
  const { isDarkMode, showSettings, setShowSettings, showAuth, setShowAuth, showPlaylist, setShowPlaylist } = useUIStore();

  return (
    <div className={`flex h-[100dvh] w-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-background text-text-primary' : 'bg-slate-50 text-slate-900'}`}>
      {/* Dynamic ambient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none cinematic-gradient opacity-50 mix-blend-screen" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 pb-36 scroll-smooth no-scrollbar">
          <Outlet />
        </main>
      </div>
      
      <BottomPlayer />
      <AudioEngine />

      {/* Global Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      <PlaylistModal isOpen={showPlaylist} onClose={() => setShowPlaylist(false)} />
    </div>
  );
};

export default Layout;
