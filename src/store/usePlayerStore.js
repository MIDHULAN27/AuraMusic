import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      duration: 0,
      volume: 80,
      repeatMode: 'none', // 'none', 'one', 'all'
      isShuffled: false,
      seekTo: null,
      
      setCurrentTrack: (track) => set({ currentTrack: track, progress: 0, seekTo: null }),
      setIsPlaying: (playing) => set({ isPlaying: !!playing }),
      setProgress: (progress) => set({ progress: isNaN(progress) ? 0 : progress }),
      setDuration: (duration) => set({ duration: isNaN(duration) ? 0 : duration }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, isNaN(volume) ? 80 : volume)) }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setIsShuffled: (shuffled) => set({ isShuffled: !!shuffled }),
      setSeekTo: (time) => set({ seekTo: time }),
      
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    }),
    {
      name: 'aura-player-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        repeatMode: state.repeatMode, 
        isShuffled: state.isShuffled,
        currentTrack: state.currentTrack
      }),
    }
  )
);
