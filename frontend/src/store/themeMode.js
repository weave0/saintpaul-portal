import { create } from 'zustand';

const initial = localStorage.getItem('saintpaul-theme-mode') === 'dark' ? 'dark' : 'light';

export const useThemeMode = create((set) => ({
  mode: initial,
  toggleMode: () => set((s) => {
    const next = s.mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('saintpaul-theme-mode', next);
    return { mode: next };
  })
}));