/**
 * Mock API layer — simulates network latency for a realistic loading experience.
 * All functions return the same static data that lives in /data, but after a
 * randomised delay so the app can show proper loading states.
 */

import { mockTransactions, type Transaction } from "../data/transactions";
import type { UserProfile, AppSettings } from "../store/useStore";

const delay = (min: number, max: number) =>
  new Promise<void>((res) => setTimeout(res, min + Math.random() * (max - min)));

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
}

/** Fetch all transactions (simulates a paginated list endpoint). */
export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(600, 1000);
  return [...mockTransactions];
}

/** Fetch dashboard summary stats (simulates a dedicated stats endpoint). */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(400, 700);
  const currentMonth = "2026-03";
  let income = 0;
  let expense = 0;
  mockTransactions.forEach((t) => {
    if (t.date.startsWith(currentMonth)) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
  });
  const totalIncome = mockTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = mockTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return {
    totalBalance: totalIncome - totalExpense,
    monthlyIncome: income,
    monthlyExpense: expense,
    savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
  };
}

/** Fetch user profile (simulates a /me endpoint). */
export async function fetchUserProfile(): Promise<Partial<UserProfile>> {
  await delay(300, 600);
  return {
    monthlyIncome: 80000,
    savingsGoal: 30000,
    savedThisMonth: 18000,
    savingsAllocationPct: 60,
  };
}

/** Fetch app settings (simulates a /settings endpoint). */
export async function fetchAppSettings(): Promise<Partial<AppSettings>> {
  await delay(200, 400);
  return {
    currencySymbol: "₹",
    currencyCode: "INR",
    language: "en-IN",
    country: "India",
  };
}
