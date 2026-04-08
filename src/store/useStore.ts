import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions, type Transaction, type Category, type TransactionType } from "../data/transactions";

export type Role = "viewer" | "admin";
export type Theme = "dark" | "light";
export type PetId = "cat" | "dog" | "bird" | "fish";
export type SortField = "date" | "amount" | "category";
export type SortOrder = "asc" | "desc";

interface Filters {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  dateRange: { from: string; to: string };
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface UserProfile {
  monthlyIncome: number;
  savingsGoal: number;
  savedThisMonth: number;
  salaryBonus: number;
  salaryHike: number;
  savingsAllocationPct: number; // % of monthly savings that goes to savings account (0-100)
}

export interface DailySpendingEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string; // string to support custom categories beyond the Category union
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
}

export interface DataAdjustments {
  netWorthAdjustment: number;
  incomeAdjustment: number;
  expenseAdjustment: number;
  categoryAdjustments: Record<string, number>;
}

export interface AppSettings {
  currencySymbol: string;
  currencyCode: string;
  language: string;
  country: string;
  dateFormat: string;
  userName: string;
  userEmail: string;
  selectedPet: PetId;
}

interface AppState {
  // Data
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Role
  role: Role;
  setRole: (role: Role) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Filters
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // User Profile
  userProfile: UserProfile;
  setUserProfile: (updates: Partial<UserProfile>) => void;

  // Daily Spending
  dailySpending: DailySpendingEntry[];
  addDailySpending: (entry: Omit<DailySpendingEntry, "id">) => void;
  deleteDailySpending: (id: string) => void;

  // Custom Categories
  customCategories: CustomCategory[];
  addCustomCategory: (cat: Omit<CustomCategory, "id">) => void;
  removeCustomCategory: (id: string) => void;

  // App Settings
  appSettings: AppSettings;
  updateAppSettings: (updates: Partial<AppSettings>) => void;

  // Data Adjustments (admin live-edit controls)
  dataAdjustments: DataAdjustments;
  setDataAdjustments: (updates: Partial<DataAdjustments>) => void;
  adjustCategory: (category: string, delta: number) => void;
}

const defaultFilters: Filters = {
  search: "",
  category: "all",
  type: "all",
  dateRange: { from: "", to: "" },
  sortField: "date",
  sortOrder: "desc",
};

const defaultAppSettings: AppSettings = {
  currencySymbol: "₹",
  currencyCode: "INR",
  language: "en-IN",
  country: "India",
  dateFormat: "DD/MM/YYYY",
  userName: "Admin User",
  userEmail: "admin@etherealfinance.in",
  selectedPet: "cat",
};

const defaultUserProfile: UserProfile = {
  monthlyIncome: 80000,
  savingsGoal: 30000,
  savedThisMonth: 18000, // 60% of avg ₹30,000 monthly savings → savings account
  salaryBonus: 0,
  salaryHike: 0,
  savingsAllocationPct: 60,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Data
      transactions: mockTransactions,
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: `t${Date.now()}` },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Role
      role: "admin",
      setRole: (role) => set({ role }),

      // Theme
      theme: "dark",
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark";
          if (next === "light") {
            document.body.classList.add("light");
          } else {
            document.body.classList.remove("light");
          }
          return { theme: next };
        }),

      // Filters
      filters: defaultFilters,
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: defaultFilters }),

      // Sidebar
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // User Profile
      userProfile: defaultUserProfile,
      setUserProfile: (updates) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates },
        })),

      // Daily Spending
      dailySpending: [],
      addDailySpending: (entry) =>
        set((state) => ({
          dailySpending: [
            { ...entry, id: `ds${Date.now()}` },
            ...state.dailySpending,
          ],
        })),
      deleteDailySpending: (id) =>
        set((state) => ({
          dailySpending: state.dailySpending.filter((e) => e.id !== id),
        })),

      // Custom Categories
      customCategories: [],
      addCustomCategory: (cat) =>
        set((state) => ({
          customCategories: [
            ...state.customCategories,
            { ...cat, id: `cc${Date.now()}` },
          ],
        })),
      removeCustomCategory: (id) =>
        set((state) => ({
          customCategories: state.customCategories.filter((c) => c.id !== id),
        })),

      // App Settings
      appSettings: defaultAppSettings,
      updateAppSettings: (updates) =>
        set((state) => ({
          appSettings: { ...state.appSettings, ...updates },
        })),

      // Data Adjustments
      dataAdjustments: {
        netWorthAdjustment: 0,
        incomeAdjustment: 0,
        expenseAdjustment: 0,
        categoryAdjustments: {},
      },
      setDataAdjustments: (updates) =>
        set((state) => ({
          dataAdjustments: { ...state.dataAdjustments, ...updates },
        })),
      adjustCategory: (category, delta) =>
        set((state) => {
          const current = state.dataAdjustments.categoryAdjustments[category] || 0;
          return {
            dataAdjustments: {
              ...state.dataAdjustments,
              categoryAdjustments: {
                ...state.dataAdjustments.categoryAdjustments,
                [category]: Math.max(0, current + delta),
              },
            },
          };
        }),

    }),
    {
      name: "ethereal-finance-storage-v2",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
        userProfile: state.userProfile,
        dailySpending: state.dailySpending,
        customCategories: state.customCategories,
        appSettings: state.appSettings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === "light") {
          document.body.classList.add("light");
        }
      },
    }
  )
);
