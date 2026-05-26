import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePlayerStore } from './usePlayerStore';

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
        return { queue: newQueue };
      }),
      
      setCurrentIndex: (index) => set({ currentIndex: index }),
      
      addRecentlyPlayed: (track) => set((state) => {
        const filtered = state.recentlyPlayed.filter(t => t.id !== track.id);
        return { recentlyPlayed: [track, ...filtered].slice(0, 50) };
      }),
      
      clearQueue: () => set({ queue: [], currentIndex: -1 }),

      playNext: () => {
        const { queue, currentIndex, setCurrentIndex } = get();
        if (!queue || queue.length === 0) return;
        
        const { currentTrack, repeatMode, isShuffled, setCurrentTrack, setIsPlaying } = usePlayerStore.getState();
        
        let activeIndex = currentIndex;
        if (activeIndex === -1 && currentTrack) {
          activeIndex = queue.findIndex(t => String(t.id) === String(currentTrack.id));
        }

        let nextIndex = activeIndex;
        
        if (repeatMode === 'one' && activeIndex >= 0) {
          const audio = document.querySelector('audio');
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
          }
          setIsPlaying(true);
          return;
        }
        
        if (isShuffled) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else {
          if (activeIndex < queue.length - 1) {
            nextIndex = activeIndex + 1;
          } else if (repeatMode === 'all') {
            nextIndex = 0;
          } else {
            setIsPlaying(false);
            return;
          }
        }
        
        if (nextIndex >= 0 && nextIndex < queue.length) {
          setCurrentIndex(nextIndex);
          setCurrentTrack(queue[nextIndex]);
          setIsPlaying(true);
        }
      },
      
      playPrevious: () => {
        const { queue, currentIndex, setCurrentIndex } = get();
        if (!queue || queue.length === 0) return;
        
        const { currentTrack, repeatMode, setCurrentTrack, setIsPlaying, progress, setProgress } = usePlayerStore.getState();
        
        if (progress > 3) {
          const audio = document.querySelector('audio');
          if (audio) {
            audio.currentTime = 0;
          }
          setProgress(0);
          return;
        }
        
        let activeIndex = currentIndex;
        if (activeIndex === -1 && currentTrack) {
          activeIndex = queue.findIndex(t => String(t.id) === String(currentTrack.id));
        }

        let prevIndex = activeIndex;
        
        if (activeIndex > 0) {
          prevIndex = activeIndex - 1;
        } else if (repeatMode === 'all') {
          prevIndex = queue.length - 1;
        } else {
          const audio = document.querySelector('audio');
          if (audio) {
            audio.currentTime = 0;
          }
          setProgress(0);
          return;
        }
        
        if (prevIndex >= 0 && prevIndex < queue.length) {
          setCurrentIndex(prevIndex);
          setCurrentTrack(queue[prevIndex]);
          setIsPlaying(true);
        }
      },
    }),
    {
      name: 'aura-queue-storage',
    }
  )
);
