import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  /** Global loading overlay flag */
  isGlobalLoading: boolean;
  setGlobalLoading: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isGlobalLoading: false,
      setGlobalLoading: (value) => set({ isGlobalLoading: value }),
    }),
    { name: 'AppStore' },
  ),
);
