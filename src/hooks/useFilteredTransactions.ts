import { useMemo } from "react";
import { useStore } from "../store/useStore";

export function useFilteredTransactions() {
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);

  return useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    // Type filter
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    // Date range
    if (filters.dateRange.from) {
      result = result.filter((t) => t.date >= filters.dateRange.from);
    }
    if (filters.dateRange.to) {
      result = result.filter((t) => t.date <= filters.dateRange.to);
    }

    // Sort
    result.sort((a, b) => {
      const dir = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortField === "date") {
        return (a.date > b.date ? 1 : -1) * dir;
      }
      if (filters.sortField === "amount") {
        return (a.amount - b.amount) * dir;
      }
      return a.category.localeCompare(b.category) * dir;
    });

    return result;
  }, [transactions, filters]);
}
