import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchHistoryItem } from '#/models';

const MAX_HISTORY = 20;

interface SearchHistoryState {
  items: SearchHistoryItem[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    set => ({
      items: [],

      addKeyword: (keyword: string) =>
        set(state => {
          const trimmed = keyword.trim();
          if (!trimmed) return state;
          const filtered = state.items.filter(i => i.keyword !== trimmed);
          const newItem: SearchHistoryItem = {
            keyword: trimmed,
            timestamp: Date.now(),
          };
          return {
            items: [newItem, ...filtered].slice(0, MAX_HISTORY),
          };
        }),

      removeKeyword: (keyword: string) =>
        set(state => ({
          items: state.items.filter(i => i.keyword !== keyword),
        })),

      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'search-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
