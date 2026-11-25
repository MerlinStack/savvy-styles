"use client";

import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  searchOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  openCart: () => set({ cartOpen: true, searchOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true, cartOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
}));
