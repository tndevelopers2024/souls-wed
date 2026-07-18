import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string | number;
  name: string;
  location: string;
  price: string | number;
  unit: string;
  rating: number;
  reviewCount?: number;
  image: string;
  category?: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string | number) => void;
  hasItem: (id: string | number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        // Prevent duplicates
        if (state.items.some((i) => i.id === item.id)) {
          return state;
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      hasItem: (id) => get().items.some((i) => i.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'sw-wishlist-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
