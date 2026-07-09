import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const STORAGE_KEYS = {
  transactions: "tasktracker.transactions",
  summary: "tasktracker.summary",
  preferences: "tasktracker.preferences",
};

const memoryStore = {};

const readRawValue = async (key) => {
  try {
    if (Platform.OS === "web") {
      const value = globalThis.localStorage?.getItem(key);
      return value ?? null;
    }

    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn("Storage read failed, using memory fallback", error);
    return memoryStore[key] ?? null;
  }
};

const writeRawValue = async (key, value) => {
  try {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn("Storage write failed, using memory fallback", error);
    memoryStore[key] = value;
  }
};

const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const storageService = {
  async getTransactions() {
    try {
      const raw = await readRawValue(STORAGE_KEYS.transactions);
      return parseJson(raw, []);
    } catch (error) {
      console.warn("Failed to read cached transactions", error);
      return [];
    }
  },

  async saveTransactions(transactions) {
    try {
      await writeRawValue(
        STORAGE_KEYS.transactions,
        JSON.stringify(transactions),
      );
    } catch (error) {
      console.warn("Failed to cache transactions", error);
    }
  },

  async getSummary() {
    try {
      const raw = await readRawValue(STORAGE_KEYS.summary);
      return parseJson(raw, { balance: 0, income: 0, expenses: 0 });
    } catch (error) {
      console.warn("Failed to read cached summary", error);
      return { balance: 0, income: 0, expenses: 0 };
    }
  },

  async saveSummary(summary) {
    try {
      await writeRawValue(STORAGE_KEYS.summary, JSON.stringify(summary));
    } catch (error) {
      console.warn("Failed to cache summary", error);
    }
  },

  async getPreference(key, fallback = null) {
    try {
      const raw = await readRawValue(STORAGE_KEYS.preferences);
      const preferences = parseJson(raw, {});
      return preferences[key] ?? fallback;
    } catch (error) {
      console.warn("Failed to read preferences", error);
      return fallback;
    }
  },

  async setPreference(key, value) {
    try {
      const raw = await readRawValue(STORAGE_KEYS.preferences);
      const preferences = parseJson(raw, {});
      preferences[key] = value;
      await writeRawValue(
        STORAGE_KEYS.preferences,
        JSON.stringify(preferences),
      );
    } catch (error) {
      console.warn("Failed to save preferences", error);
    }
  },
};
