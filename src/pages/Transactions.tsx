import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, ArrowUpDown, Plus, Pencil, Trash2, X,
  Download, ChevronDown, ArrowUp, ArrowDown, FileJson, FileText,
} from "lucide-react";
import { fetchTransactions } from "../api/mockApi";
import { useStore, type SortField } from "../store/useStore";
import { useFilteredTransactions } from "../hooks/useFilteredTransactions";
import { allCategories, categoryColors, type Category, type Transaction, type TransactionType } from "../data/transactions";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Module-level sort icon — stable reference, not recreated on every Transactions render
const SortIcon = memo(function SortIcon({
  field, sortField, sortOrder,
}: { field: SortField; sortField: SortField; sortOrder: "asc" | "desc" }) {
  if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30" />;
  return sortOrder === "asc"
    ? <ArrowUp   size={12} className="text-primary-dim" />
    : <ArrowDown size={12} className="text-primary-dim" />;
});

// Add/Edit modal — memo prevents re-render when parent Transactions state changes
const TransactionModal = memo(function TransactionModal({
  transaction,
  onClose,
  onSave,
}: {
  transaction?: Transaction;
  onClose: () => void;
  onSave: (data: Omit<Transaction, "id">) => void;
}) {
  const theme = useStore((s) => s.theme);
  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().split("T")[0],
    description: transaction?.description || "",
    amount: transaction?.amount?.toString() || "",
    type: (transaction?.type || "expense") as TransactionType,
    category: (transaction?.category || "Dining") as Category,
    counterparty: transaction?.counterparty || "",
    status: transaction?.status || "completed" as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      amount: parseFloat(form.amount) || 0,
    });
    onClose();
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors ${
    theme === "dark"
      ? "bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary-dim/50"
      : "bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary-dim/50"
  }`;

  const labelCls = `text-xs font-medium mb-1 block ${
    theme === "dark" ? "text-on-surface-variant" : "text-gray-500"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl p-6 ${
          theme === "dark" ? "bg-surface-container-high" : "bg-white shadow-2xl"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${
            theme === "dark" ? "text-on-surface" : "text-gray-900"
          }`}>
            {transaction ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container-highest transition-colors">
            <X size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <div className={`flex rounded-xl p-1 ${
                theme === "dark" ? "bg-surface-container-lowest" : "bg-gray-200"
              }`}>
                {(["income", "expense"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                      form.type === t
                        ? t === "income"
                          ? "bg-primary-dim text-black"
                          : "bg-error text-white"
                        : theme === "dark" ? "text-on-surface-variant" : "text-gray-500"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <input
              type="text"
              placeholder="e.g., Coffee at Blue Bottle"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className={inputCls}
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Counterparty</label>
            <input
              type="text"
              placeholder="e.g., Blue Bottle Coffee"
              value={form.counterparty}
              onChange={(e) => setForm({ ...form, counterparty: e.target.value })}
              className={inputCls}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-primary-dim text-black font-semibold text-sm hover:bg-primary-fixed transition-colors"
          >
            {transaction ? "Save Changes" : "Add Transaction"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
});

export default function Transactions() {
  const theme = useStore((s) => s.theme);
  const role = useStore((s) => s.role);
  const { currencySymbol } = useStore((s) => s.appSettings);
  const filters = useStore((s) => s.filters);
  const setFilter = useStore((s) => s.setFilter);
  const addTransaction = useStore((s) => s.addTransaction);
  const updateTransaction = useStore((s) => s.updateTransaction);
  const deleteTransaction = useStore((s) => s.deleteTransaction);

  const filteredTransactions = useFilteredTransactions();

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [apiLoading, setApiLoading] = useState(() => !sessionStorage.getItem("tx-loaded"));

  useEffect(() => {
    if (!apiLoading) return;
    fetchTransactions().then(() => {
      sessionStorage.setItem("tx-loaded", "1");
      setApiLoading(false);
    });
  }, [apiLoading]);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search — avoids filtering on every keystroke
  const [localSearch, setLocalSearch] = useState(filters.search);
  useEffect(() => {
    const timer = setTimeout(() => setFilter("search", localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, setFilter]);

  const handleSort = useCallback((field: SortField) => {
    if (filters.sortField === field) {
      setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setFilter("sortField", field);
      setFilter("sortOrder", "desc");
    }
  }, [filters.sortField, filters.sortOrder, setFilter]);

  // Group filtered transactions by month (preserves existing sort order within each group)
  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, { label: string; txs: Transaction[]; income: number; expense: number }>();
    filteredTransactions.forEach((tx) => {
      const key = tx.date.slice(0, 7);
      if (!groups.has(key)) {
        const label = new Date(key + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" });
        groups.set(key, { label, txs: [], income: 0, expense: 0 });
      }
      const g = groups.get(key)!;
      g.txs.push(tx);
      if (tx.type === "income") g.income += tx.amount; else g.expense += tx.amount;
    });
    return Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([, g]) => g);
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Amount", "Type", "Category", "Counterparty", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.date, t.description, t.amount, t.type, t.category, t.counterparty, t.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredTransactions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const cardBg = theme === "dark" ? "bg-surface-container-low" : "bg-white shadow-sm";
  const textPrimary = theme === "dark" ? "text-on-surface" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-on-surface-variant" : "text-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight ${textPrimary}`}>
            Financial Records
          </h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Monitoring {filteredTransactions.length} transactions
          </p>
        </div>
        <div className="flex gap-2">
          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExportMenu((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              <Download size={16} />
              Export
              <ChevronDown size={14} className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-xl z-20 overflow-hidden ${
                    theme === "dark" ? "bg-surface-container-high border border-outline-variant/20" : "bg-white border border-gray-200"
                  }`}
                >
                  <button
                    onClick={handleExportCSV}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      theme === "dark" ? "text-on-surface hover:bg-surface-container-highest" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={15} className="text-primary-dim" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      theme === "dark" ? "text-on-surface hover:bg-surface-container-highest" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FileJson size={15} className="text-tertiary-dim" />
                    Export JSON
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {role === "admin" && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => { setEditTx(undefined); setShowModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-dim text-black text-sm font-semibold hover:bg-primary-fixed transition-colors"
              >
                <Plus size={16} />
                New Transaction
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search + Filters Bar */}
      <div className={`${cardBg} rounded-3xl p-4`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-colors ${
                theme === "dark"
                  ? "bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary-dim/50"
                  : "bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary-dim/50"
              }`}
            />
          </div>

          {/* Filter toggles */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-primary-dim/20 text-primary-dim"
                  : theme === "dark"
                    ? "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <Filter size={14} />
              Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Quick type filter pills */}
            {(["all", "income", "expense"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter("type", t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                  filters.type === t
                    ? t === "income"
                      ? "bg-primary-dim/20 text-primary-dim"
                      : t === "expense"
                        ? "bg-error/20 text-error"
                        : theme === "dark"
                          ? "bg-surface-container-highest text-on-surface"
                          : "bg-gray-200 text-gray-800"
                    : theme === "dark"
                      ? "bg-surface-container-highest/50 text-on-surface-variant hover:text-on-surface"
                      : "bg-gray-50 text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-outline-variant/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilter("category", e.target.value as Category | "all")}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${
                      theme === "dark"
                        ? "bg-surface-container-highest text-on-surface"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <option value="all">All Categories</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>From</label>
                  <input
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) => setFilter("dateRange", { ...filters.dateRange, from: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${
                      theme === "dark"
                        ? "bg-surface-container-highest text-on-surface"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>To</label>
                  <input
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) => setFilter("dateRange", { ...filters.dateRange, to: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${
                      theme === "dark"
                        ? "bg-surface-container-highest text-on-surface"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transactions Table */}
      <div className={`${cardBg} rounded-3xl overflow-hidden`}>
        {/* Desktop table header */}
        <div className={`hidden lg:grid ${role === "admin" ? "grid-cols-12" : "grid-cols-10"} gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider ${
          theme === "dark" ? "text-on-surface-variant bg-surface-container" : "text-gray-500 bg-gray-50"
        }`}>
          <button
            onClick={() => handleSort("date")}
            className="col-span-2 flex items-center gap-1 hover:text-on-surface transition-colors"
          >
            Date <SortIcon field="date" sortField={filters.sortField} sortOrder={filters.sortOrder} />
          </button>
          <div className="col-span-3">Description</div>
          <div className="col-span-2">Category</div>
          <button
            onClick={() => handleSort("amount")}
            className="col-span-2 flex items-center gap-1 hover:text-on-surface transition-colors text-right justify-end"
          >
            Amount <SortIcon field="amount" sortField={filters.sortField} sortOrder={filters.sortOrder} />
          </button>
          <div className="col-span-1 text-center">Status</div>
          {role === "admin" && <div className="col-span-2 text-right">Actions</div>}
        </div>

        {/* Mobile sort controls */}
        <div className={`lg:hidden flex items-center gap-2 px-4 py-3 text-xs ${
          theme === "dark" ? "text-on-surface-variant bg-surface-container" : "text-gray-500 bg-gray-50"
        }`}>
          <span className="font-semibold uppercase tracking-wider">Sort:</span>
          {(["date", "amount", "category"] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleSort(f)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg capitalize transition-colors ${
                filters.sortField === f
                  ? "bg-primary-dim/20 text-primary-dim font-semibold"
                  : theme === "dark" ? "hover:bg-surface-container-high" : "hover:bg-gray-100"
              }`}
            >
              {f} <SortIcon field={f} sortField={filters.sortField} sortOrder={filters.sortOrder} />
            </button>
          ))}
        </div>

        {/* Table body / Card list */}
        {apiLoading ? (
          <div className="divide-y divide-outline-variant/10">
            {/* Skeleton group header */}
            <div className={`flex items-center justify-between px-6 py-2.5 ${
              theme === "dark" ? "bg-surface-container" : "bg-gray-50"
            }`}>
              <div className={`h-3 w-28 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} />
              <div className={`h-3 w-40 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="hidden lg:grid grid-cols-10 gap-2 px-6 py-4 items-center">
                <div className={`col-span-2 h-3 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} style={{ animationDelay: `${i * 80}ms` }} />
                <div className="col-span-3 space-y-2">
                  <div className={`h-3 w-3/4 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} style={{ animationDelay: `${i * 80 + 40}ms` }} />
                  <div className={`h-2 w-1/2 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-high" : "bg-gray-100"}`} style={{ animationDelay: `${i * 80 + 80}ms` }} />
                </div>
                <div className={`col-span-2 h-6 w-20 rounded-lg animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} style={{ animationDelay: `${i * 80}ms` }} />
                <div className={`col-span-2 h-3 w-16 ml-auto rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} style={{ animationDelay: `${i * 80 + 40}ms` }} />
                <div className="col-span-1 flex justify-center">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} />
                </div>
              </div>
            ))}
            {/* Mobile skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`m-${i}`} className="lg:hidden flex items-center gap-3 px-4 py-3">
                <div className={`w-10 h-10 rounded-xl shrink-0 animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} style={{ animationDelay: `${i * 80}ms` }} />
                <div className="flex-1 space-y-2">
                  <div className={`h-3 w-3/4 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} />
                  <div className={`h-2 w-1/2 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-high" : "bg-gray-100"}`} />
                </div>
                <div className={`h-3 w-16 rounded-full animate-pulse ${theme === "dark" ? "bg-surface-container-highest" : "bg-gray-200"}`} />
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-3xl mesh-gradient-subtle flex items-center justify-center mb-4">
              <Search size={24} className={textSecondary} />
            </div>
            <p className={`font-medium ${textPrimary}`}>No transactions found</p>
            <p className={`text-sm mt-1 ${textSecondary}`}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            {groupedTransactions.map((group) => (
              <div key={group.label}>
                {/* Group header */}
                <motion.div
                  variants={item}
                  className={`flex items-center justify-between px-6 py-2.5 ${
                    theme === "dark"
                      ? "bg-surface-container border-y border-outline-variant/10"
                      : "bg-gray-50 border-y border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-widest ${textPrimary}`}>
                      {group.label}
                    </span>
                    <span className={`text-xs ${textSecondary}`}>
                      {group.txs.length} transaction{group.txs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-primary-dim">+{currencySymbol}{group.income.toLocaleString()}</span>
                    <span className="text-error">−{currencySymbol}{group.expense.toLocaleString()}</span>
                    <span className={`${(group.income - group.expense) >= 0 ? "text-primary-dim" : "text-error"}`}>
                      net {(group.income - group.expense) >= 0 ? "+" : "−"}{currencySymbol}{Math.abs(group.income - group.expense).toLocaleString()}
                    </span>
                  </div>
                </motion.div>

                {/* Rows for this group */}
                {group.txs.map((tx) => (
                  <motion.div
                    key={tx.id}
                    variants={item}
                    className={`transition-colors ${
                      theme === "dark" ? "hover:bg-surface-container/50" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Desktop row */}
                    <div className={`hidden lg:grid ${role === "admin" ? "grid-cols-12" : "grid-cols-10"} gap-2 px-6 py-4 items-center`}>
                      <div className={`col-span-2 text-sm ${textSecondary}`}>
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="col-span-3">
                        <p className={`text-sm font-medium ${textPrimary}`}>{tx.counterparty}</p>
                        <p className={`text-xs ${textSecondary}`}>{tx.description}</p>
                      </div>
                      <div className="col-span-2">
                        <span
                          className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide"
                          style={{
                            backgroundColor: (categoryColors[tx.category] || "#757480") + "20",
                            color: categoryColors[tx.category] || "#757480",
                          }}
                        >
                          {tx.category}
                        </span>
                      </div>
                      <div className={`col-span-2 text-right text-sm font-semibold ${
                        tx.type === "income" ? "text-primary-dim" : "text-error"
                      }`}>
                        {tx.type === "income" ? "+" : "-"}{currencySymbol}{tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="col-span-1 text-center">
                        <span className={`inline-flex w-2 h-2 rounded-full ${
                          tx.status === "completed"
                            ? "bg-primary-dim"
                            : tx.status === "pending"
                              ? "bg-yellow-400"
                              : "bg-error"
                        }`} />
                      </div>
                      {role === "admin" && (
                        <div className="col-span-2 flex justify-end gap-1">
                          <button
                            onClick={() => { setEditTx(tx); setShowModal(true); }}
                            className={`p-2 rounded-xl transition-colors ${
                              theme === "dark"
                                ? "hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                                : "hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                            }`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className={`p-2 rounded-xl transition-colors ${
                              theme === "dark"
                                ? "hover:bg-error-container text-on-surface-variant hover:text-error"
                                : "hover:bg-red-50 text-gray-400 hover:text-red-500"
                            }`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile card */}
                    <div className="lg:hidden flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: (categoryColors[tx.category] || "#757480") + "20",
                            color: categoryColors[tx.category] || "#757480",
                          }}
                        >
                          {tx.counterparty.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${textPrimary}`}>{tx.counterparty}</p>
                          <p className={`text-xs ${textSecondary}`}>
                            {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            {" · "}
                            {tx.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-semibold ${
                          tx.type === "income" ? "text-primary-dim" : "text-error"
                        }`}>
                          {tx.type === "income" ? "+" : "-"}{currencySymbol}{tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        {role === "admin" && (
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => { setEditTx(tx); setShowModal(true); }}
                              className={`p-1.5 rounded-lg ${
                                theme === "dark"
                                  ? "text-on-surface-variant hover:text-on-surface"
                                  : "text-gray-400 hover:text-gray-700"
                              }`}
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className={`p-1.5 rounded-lg ${
                                theme === "dark"
                                  ? "text-on-surface-variant hover:text-error"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Transaction Modal */}
      <AnimatePresence>
        {showModal && (
          <TransactionModal
            transaction={editTx}
            onClose={() => { setShowModal(false); setEditTx(undefined); }}
            onSave={(data) => {
              if (editTx) {
                updateTransaction(editTx.id, data);
              } else {
                addTransaction(data);
              }
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
