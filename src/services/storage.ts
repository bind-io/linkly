import { LinkFormData } from "../pages/main";

const STORAGE_KEY = "linkly_last_link";
const ERRORS_KEY = "linkly_errors";

export interface StoredLink extends LinkFormData {
  url: string;
  timestamp: number;
}

export const linkStorage = {
  save(data: LinkFormData, url: string): void {
    try {
      const stored: StoredLink = {
        ...data,
        url,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error("Failed to save link to storage:", error);
    }
  },

  get(): StoredLink | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to get link from storage:", error);
      return null;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear link from storage:", error);
    }
  },

  has(): boolean {
    return !!this.get();
  },
};

export interface ErrorLog {
  message: string;
  timestamp: number;
  context?: string;
}

export const errorStorage = {
  add(error: string, context?: string): void {
    try {
      const errors = this.getAll();
      errors.push({
        message: error,
        timestamp: Date.now(),
        context,
      });
      // Keep only last 50 errors
      const limited = errors.slice(-50);
      localStorage.setItem(ERRORS_KEY, JSON.stringify(limited));
    } catch (err) {
      console.error("Failed to save error to storage:", err);
    }
  },

  getAll(): ErrorLog[] {
    try {
      const stored = localStorage.getItem(ERRORS_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to get errors from storage:", error);
      return [];
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(ERRORS_KEY);
    } catch (error) {
      console.error("Failed to clear errors from storage:", error);
    }
  },

  count(): number {
    return this.getAll().length;
  },
};
