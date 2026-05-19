import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleFavorite: (track) => set((state) => {
        const isFav = state.favorites.some((f) => f.id === track.id);
        if (isFav) {
          return { favorites: state.favorites.filter((f) => f.id !== track.id) };
        } else {
          return { favorites: [...state.favorites, track] };
        }
      }),
      
      isFavorite: (trackId) => get().favorites.some((f) => f.id === trackId),
    }),
    {
      name: 'aura-favorites-storage',
    }
  )
);
