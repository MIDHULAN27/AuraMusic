import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomPlayer from '../player/BottomPlayer';
import AudioEngine from '../player/AudioEngine';
import { useUIStore } from '../../store/useUIStore';
import { SettingsModal, AuthModal, PlaylistModal } from '../ui/Modals';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { 
    isDarkMode, 
    showSettings, 
    setShowSettings, 
    showAuth, 
    setShowAuth, 
    showPlaylist, 
    setShowPlaylist,
    isSidebarOpen,
    setSidebarOpen
  } = useUIStore();

  return (
    <div className={`flex h-[100dvh] w-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-background text-text-primary' : 'bg-slate-50 text-slate-900'}`}>
      {/* Dynamic ambient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none cinematic-gradient opacity-50 mix-blend-screen" />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile/Tablet Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 h-full z-50 lg:hidden"
            >
              <Sidebar isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 pb-36 scroll-smooth no-scrollbar">
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
