import { create } from "zustand";
import { storageService } from "../services/storageService";

export const useAppStore = create((set, get) => ({
  transactions: [],
  summary: { balance: 0, income: 0, expenses: 0 },
  isHydrated: false,
  hasBiometrics: false,
  remindersEnabled: true,
  setTransactions: (transactions) => set({ transactions }),
  setSummary: (summary) => set({ summary }),
  hydrateFromStorage: async () => {
    const [transactions, summary, remindersEnabled] = await Promise.all([
      storageService.getTransactions(),
      storageService.getSummary(),
      storageService.getPreference("remindersEnabled", true),
    ]);

    set({
      transactions,
      summary,
      remindersEnabled,
      isHydrated: true,
    });
  },
  updateReminders: async (value) => {
    await storageService.setPreference("remindersEnabled", value);
    set({ remindersEnabled: value });
  },
  setHasBiometrics: (value) => set({ hasBiometrics: value }),
  syncTransactions: async (transactions, summary) => {
    await Promise.all([
      storageService.saveTransactions(transactions),
      storageService.saveSummary(summary),
    ]);
    set({ transactions, summary });
  },
}));
