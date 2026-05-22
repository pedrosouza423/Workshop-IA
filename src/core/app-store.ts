import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppState = {
  mockApi: boolean;
  setMockApi: (value: boolean) => void;
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mockApi: true,
      setMockApi: (mockApi) => set({ mockApi }),
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ mockApi: s.mockApi, theme: s.theme }),
    }
  )
);
