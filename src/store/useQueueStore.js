import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQueueStore = create(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      recentlyPlayed: [],
      
      setQueue: (tracks, index = 0) => set({ 
        queue: tracks, 
        currentIndex: index 
      }),
      
      addToQueue: (track) => set((state) => {
        if (state.queue.some(t => t.id === track.id)) return state;
        return { queue: [...state.queue, track] };
      }),
      
      playNextInQueue: (track) => set((state) => {
        const newQueue = [...state.queue];
        const nextIndex = state.currentIndex + 1;
        newQueue.splice(nextIndex, 0, track);
        return { queue: newQueue };
      }),
      
      removeFromQueue: (trackId) => set((state) => {
        const newQueue = state.queue.filter(t => t.id !== trackId);
        let newIndex = state.currentIndex;
        if (state.queue[state.currentIndex]?.id === trackId) {
          // If removing currently playing, handle index
        }
        return { queue: newQueue };
      }),
      
      setCurrentIndex: (index) => set({ currentIndex: index }),
      
      addRecentlyPlayed: (track) => set((state) => {
        const filtered = state.recentlyPlayed.filter(t => t.id !== track.id);
        return { recentlyPlayed: [track, ...filtered].slice(0, 50) };
      }),
      
      clearQueue: () => set({ queue: [], currentIndex: -1 }),
    }),
    {
      name: 'aura-queue-storage',
    }
  )
);
