import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      languages: ['tamil', 'english', 'hindi'],
      audioQuality: '320kbps',
      
      setLanguages: (langs) => set({ languages: langs }),
      toggleLanguage: (lang) => set((state) => {
        const current = state.languages;
        if (current.includes(lang)) {
          // Keep at least one language
          if (current.length === 1) return state;
          return { languages: current.filter(l => l !== lang) };
        }
        return { languages: [...current, lang] };
      }),
      setAudioQuality: (quality) => set({ audioQuality: quality }),
    }),
    {
      name: 'aura-settings-storage',
    }
  )
);
