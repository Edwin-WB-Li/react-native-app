import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '#/models';

interface CartState {
  items: CartItem[];
  addItem: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelect: (productId: number) => void;
  toggleSelectAll: () => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSelectedCount: () => number;
  getSelectedIds: () => number[];
  isAllSelected: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId: number, quantity: number) =>
        set(state => {
          const existingIndex = state.items.findIndex(i => i.productId === productId);
          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }
          return {
            items: [...state.items, { productId, quantity, selected: true }],
          };
        }),

      removeItem: (productId: number) =>
        set(state => ({
          items: state.items.filter(i => i.productId !== productId),
        })),

      updateQuantity: (productId: number, quantity: number) =>
        set(state => {
          if (quantity <= 0) {
            return { items: state.items.filter(i => i.productId !== productId) };
          }
          return {
            items: state.items.map(i =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          };
        }),

      toggleSelect: (productId: number) =>
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, selected: !i.selected } : i
          ),
        })),

      toggleSelectAll: () =>
        set(state => {
          const allSelected = state.items.every(i => i.selected);
          return {
            items: state.items.map(i => ({ ...i, selected: !allSelected })),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSelectedCount: () => {
        return get().items
          .filter(i => i.selected)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      getSelectedIds: () => {
        return get().items.filter(i => i.selected).map(i => i.productId);
      },

      isAllSelected: () => {
        const { items } = get();
        return items.length > 0 && items.every(i => i.selected);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
