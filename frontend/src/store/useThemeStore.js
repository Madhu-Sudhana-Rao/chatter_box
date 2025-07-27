import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Chatter_Box-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Chatter_Box-theme", theme);
    set({ theme });
  },
}));
