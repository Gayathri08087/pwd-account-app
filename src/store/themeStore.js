import { create } from 'zustand';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('app-theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (newTheme) => {
    localStorage.setItem('app-theme', newTheme);
    set({ theme: newTheme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('app-theme', newTheme);
    return { theme: newTheme };
  }),
}));
