import { create } from "zustand";

type AlertState = {
  visible: boolean;
  title: string;
  message: string | null;
  show: (title: string, message?: string) => void;
  hide: () => void;
};

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  title: "",
  message: null,
  show: (title, message) => set({ visible: true, title, message: message ?? null }),
  hide: () => set({ visible: false }),
}));
