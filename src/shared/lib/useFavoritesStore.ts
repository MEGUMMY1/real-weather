import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocationItem } from "./locationSearch";

export interface FavoriteLocation extends LocationItem {
  id: string;
  alias?: string;
}

interface FavoritesStore {
  favorites: FavoriteLocation[];
  addFavorite: (location: LocationItem, alias?: string) => boolean;
  removeFavorite: (id: string) => void;
  updateFavoriteAlias: (id: string, alias: string) => void;
  isFavorite: (location: LocationItem) => boolean;
}

const MAX_FAVORITES = 6;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (location, alias) => {
        const { favorites } = get();
        
        if (favorites.length >= MAX_FAVORITES) {
          return false;
        }

        const exists = favorites.some((fav) => fav.fullName === location.fullName);
        if (exists) {
          return false;
        }

        const newFavorite: FavoriteLocation = {
          ...location,
          id: `${location.fullName}-${Date.now()}`,
          alias,
        };

        set({ favorites: [...favorites, newFavorite] });
        return true;
      },

      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((fav) => fav.id !== id) });
      },

      updateFavoriteAlias: (id, alias) => {
        set({
          favorites: get().favorites.map((fav) =>
            fav.id === id ? { ...fav, alias } : fav
          ),
        });
      },

      isFavorite: (location) => {
        return get().favorites.some((fav) => fav.fullName === location.fullName);
      },
    }),
    {
      name: "weather_favorites",
    }
  )
);

