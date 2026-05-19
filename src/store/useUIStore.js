import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      isDarkMode: true,
      sidebarCollapsed: false,
      
      toggleTheme: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newMode };
      }),
      
      setDarkMode: (isDark) => set(() => {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: isDark };
      }),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      showSettings: false,
      setShowSettings: (val) => set({ showSettings: val }),
      
      showAuth: false,
      setShowAuth: (val) => set({ showAuth: val }),
      
      showPlaylist: false,
      setShowPlaylist: (val) => set({ showPlaylist: val }),
    }),
    {
      name: 'aura-ui-storage',
    }
  )
);
