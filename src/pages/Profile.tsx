import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Plus, Trash2, Check, DollarSign, Target,
  PiggyBank, TrendingUp, Award, X, Tag, Palette, User, Landmark,
} from "lucide-react";
import { useStore } from "../store/useStore";
import type { PetId } from "../store/useStore";
import { allCategories, categoryColors, type Category } from "../data/transactions";
import { PETS } from "../data/pets";
import PetWidget from "../components/PetWidget";
import AnimatedNumber from "../components/AnimatedNumber";

const CUSTOM_COLORS = [
  "#f97316", "#ec4899", "#8b5cf6", "#06b6d4",
  "#10b981", "#f59e0b", "#ef4444", "#6366f1",
  "#84cc16", "#14b8a6", "#e879f9", "#fb923c",
];

// Module-level constant — no reason to recreate this Set on every render
const INCOME_CATS = new Set(["Salary", "Freelance", "Investments", "Crypto", "Transfer"]);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Profile() {
  const theme = useStore((s) => s.theme);
  const role = useStore((s) => s.role);
  const userProfile = useStore((s) => s.userProfile);
  const setUserProfile = useStore((s) => s.setUserProfile);
  const appSettings = useStore((s) => s.appSettings);
  const updateAppSettings = useStore((s) => s.updateAppSettings);
  const dailySpending = useStore((s) => s.dailySpending);
  const addDailySpending = useStore((s) => s.addDailySpending);
  const deleteDailySpending = useStore((s) => s.deleteDailySpending);
  const customCategories = useStore((s) => s.customCategories);
  const addCustomCategory = useStore((s) => s.addCustomCategory);
  const removeCustomCategory = useStore((s) => s.removeCustomCategory);
  const { currencySymbol } = useStore((s) => s.appSettings);

  // Memoized — only rebuilds when customCategories changes
  const expenseCategories = useMemo(() => [
    ...allCategories.filter((c) => !INCOME_CATS.has(c)),
    ...customCategories.map((c) => c.name),
  ], [customCategories]);

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...userProfile });

  // Identity (name + pet) — separate save from financial profile
  const [identitySaved, setIdentitySaved] = useState(false);
  const [localName, setLocalName] = useState(appSettings.userName);
  const [localPet, setLocalPet] = useState<PetId>(appSettings.selectedPet);


  const handleSaveIdentity = () => {
    updateAppSettings({ userName: localName.trim() || appSettings.userName, selectedPet: localPet });
    setIdentitySaved(true);
    setTimeout(() => setIdentitySaved(false), 2000);
  };
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showCatManager, setShowCatManager] = useState(false);
  // category grid: { [categoryName]: amountString }
  const [catAmounts, setCatAmounts] = useState<Record<string, string>>({});
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState(CUSTOM_COLORS[0]);

  const handleSaveProfile = () => {
    setUserProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleLogCategories = () => {
    const entries = Object.entries(catAmounts).filter(
      ([, v]) => parseFloat(v) > 0
    );
    if (!entries.length) return;
    entries.forEach(([category, amount]) => {
      addDailySpending({
        description: category,
        amount: parseFloat(amount),
        category,
        date: today,
      });
    });
    setCatAmounts({});
  };

  const totalToLog = Object.values(catAmounts).reduce(
    (sum, v) => sum + (parseFloat(v) || 0),
    0
  );

  const handleAddCustomCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (expenseCategories.includes(trimmed)) return; // no duplicates
    addCustomCategory({ name: trimmed, color: newCatColor });
    setNewCatName("");
    setNewCatColor(CUSTOM_COLORS[0]);
  };

  const getCategoryColor = (name: string) =>
    categoryColors[name as Category] ??
    customCategories.find((c) => c.name === name)?.color ??
    "#757480";

  const cardBg = theme === "dark" ? "bg-surface-container-low" : "bg-white shadow-sm";
  const textPrimary = theme === "dark" ? "text-on-surface" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-on-surface-variant" : "text-gray-500";
  const inputCls = `w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors ${
    theme === "dark"
      ? "bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary-dim/50"
      : "bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary-dim/50"
  }`;
  const labelCls = `text-xs font-semibold uppercase tracking-wider mb-2 block ${textSecondary}`;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntries = useMemo(
    () => dailySpending.filter((e) => e.date === todayStr),
    [dailySpending, todayStr]
  );
  const todayTotal = useMemo(
    () => todayEntries.reduce((sum, e) => sum + e.amount, 0),
    [todayEntries]
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight ${textPrimary}`}>
          My Profile
        </h1>
        <p className={`text-sm mt-1 ${textSecondary}`}>
          Configure your financial goals and track daily spending
        </p>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: "Monthly Income", value: userProfile.monthlyIncome, icon: DollarSign, color: "text-primary-dim" },
          { label: "Savings Goal", value: userProfile.savingsGoal, icon: Target, color: "text-tertiary-dim" },
          { label: "Saved This Month", value: userProfile.savedThisMonth, icon: PiggyBank, color: "text-primary-dim" },
          { label: "Today's Spending", value: todayTotal, icon: TrendingUp, color: "text-error" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className={`${cardBg} rounded-2xl p-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] uppercase tracking-widest ${textSecondary}`}>
                {stat.label}
              </p>
              <stat.icon size={14} className={stat.color} />
            </div>
            <AnimatedNumber
              value={stat.value}
              prefix={currencySymbol}
              decimals={0}
              className={`text-xl font-bold ${textPrimary}`}
            />
          </motion.div>
        ))}
      </div>

      {/* Identity Card — name + pet companion */}
      <motion.div variants={item} className={`${cardBg} rounded-3xl p-6`}>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-dim/20 flex items-center justify-center">
              <User size={18} className="text-secondary-dim" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${textPrimary}`}>Identity &amp; Companion</h2>
              <p className={`text-xs ${textSecondary}`}>
                {role === "admin"
                  ? "Set your display name and dashboard companion"
                  : "View-only — switch to Admin to edit"}
              </p>
            </div>
          </div>
          {role !== "admin" && (
            <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold uppercase tracking-wider ${
              theme === "dark" ? "bg-surface-container text-on-surface-variant" : "bg-gray-100 text-gray-500"
            }`}>Read Only</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Display Name */}
          <div>
            <label className={labelCls}>Display Name</label>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              disabled={role !== "admin"}
              className={inputCls}
              placeholder="Your name"
            />
            <p className={`text-xs mt-1.5 ${textSecondary}`}>
              First name is shown in the Dashboard greeting.
            </p>
          </div>

          {/* Pet Selector */}
          <div>
            <label className={labelCls}>Dashboard Companion</label>
            <div className="grid grid-cols-4 gap-2">
              {PETS.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => { if (role === "admin") setLocalPet(pet.id); }}
                  title={pet.name}
                  className={`flex flex-col items-center gap-1 pb-2 rounded-2xl border-2 text-xs font-semibold transition-all ${
                    role !== "admin" ? "cursor-default" : "cursor-pointer"
                  } ${
                    localPet === pet.id
                      ? "border-primary-dim bg-primary-dim/10 text-primary-dim"
                      : theme === "dark"
                        ? "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {/* PetWidget handles its own idle timer + click animation */}
                  <PetWidget
                    petId={pet.id}
                    size={56}
                    clickable={true}
                    idleMin={6000}
                    idleMax={9000}
                  />
                  <span>{pet.name}</span>
                </button>
              ))}
            </div>
            <p className={`text-xs mt-1.5 ${textSecondary}`}>
              Greets you on the Dashboard with a little animation.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-5">
          <button
            onClick={handleSaveIdentity}
            disabled={role !== "admin"}
            className={`w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
              identitySaved
                ? "bg-primary-dim text-black"
                : "bg-primary-dim text-black hover:bg-primary-fixed"
            }`}
          >
            <AnimatePresence mode="wait">
              {identitySaved ? (
                <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="flex items-center gap-2">
                  <Check size={16} /> Saved!
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="flex items-center gap-2">
                  <Save size={16} /> Save Identity
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Financial Profile Form */}
        <motion.div variants={item} className={`${cardBg} rounded-3xl p-6`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-dim/20 flex items-center justify-center">
                <DollarSign size={18} className="text-primary-dim" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${textPrimary}`}>Financial Profile</h2>
                <p className={`text-xs ${textSecondary}`}>
                  {role === "admin" ? "Edit your income and savings targets" : "View-only — switch to Admin to edit"}
                </p>
              </div>
            </div>
            {role !== "admin" && (
              <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold uppercase tracking-wider ${
                theme === "dark" ? "bg-surface-container text-on-surface-variant" : "bg-gray-100 text-gray-500"
              }`}>Read Only</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Monthly Income ({currencySymbol})</label>
                <input
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(e) => setForm({ ...form, monthlyIncome: parseFloat(e.target.value) || 0 })}
                  className={inputCls}
                  placeholder="8500"
                  disabled={role !== "admin"}
                />
              </div>
              <div>
                <label className={labelCls}>Savings Goal ({currencySymbol})</label>
                <input
                  type="number"
                  value={form.savingsGoal}
                  onChange={(e) => setForm({ ...form, savingsGoal: parseFloat(e.target.value) || 0 })}
                  className={inputCls}
                  placeholder="5000"
                  disabled={role !== "admin"}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Saved This Month ({currencySymbol})</label>
              <input
                type="number"
                value={form.savedThisMonth}
                onChange={(e) => setForm({ ...form, savedThisMonth: parseFloat(e.target.value) || 0 })}
                className={inputCls}
                placeholder="3200"
                disabled={role !== "admin"}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Salary Bonus ({currencySymbol})</label>
                <input
                  type="number"
                  value={form.salaryBonus}
                  onChange={(e) => setForm({ ...form, salaryBonus: parseFloat(e.target.value) || 0 })}
                  className={inputCls}
                  placeholder="0"
                  disabled={role !== "admin"}
                />
              </div>
              <div>
                <label className={labelCls}>Salary Hike (%)</label>
                <input
                  type="number"
                  value={form.salaryHike}
                  onChange={(e) => setForm({ ...form, salaryHike: parseFloat(e.target.value) || 0 })}
                  className={inputCls}
                  placeholder="0"
                  disabled={role !== "admin"}
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={role !== "admin"}
              className={`w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                saved
                  ? "bg-primary-dim text-black"
                  : "bg-primary-dim text-black hover:bg-primary-fixed"
              }`}
            >
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.span
                    key="saved"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    Saved!
                  </motion.span>
                ) : (
                  <motion.span
                    key="save"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Bonus / Hike info */}
          {(userProfile.salaryBonus > 0 || userProfile.salaryHike > 0) && (
            <div className={`mt-4 p-3 rounded-xl ${
              theme === "dark" ? "bg-surface-container" : "bg-gray-50"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Award size={14} className="text-secondary-dim" />
                <span className={`text-xs font-semibold ${textPrimary}`}>Active Bonuses</span>
              </div>
              {userProfile.salaryBonus > 0 && (
                <p className={`text-xs ${textSecondary}`}>
                  Bonus: +{currencySymbol}{userProfile.salaryBonus.toLocaleString()}
                </p>
              )}
              {userProfile.salaryHike > 0 && (
                <p className={`text-xs ${textSecondary}`}>
                  Salary Hike: +{userProfile.salaryHike}%
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Today Spent */}
        <motion.div variants={item} className={`${cardBg} rounded-3xl p-6 flex flex-col gap-5`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-error/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-error" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${textPrimary}`}>Today Spent</h2>
                <p className={`text-xs ${textSecondary}`}>
                  Entries reflect instantly in Dashboard spending breakdown
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCatManager(!showCatManager)}
              title="Manage spending categories"
              className={`p-2.5 rounded-xl transition-colors ${
                showCatManager
                  ? "bg-secondary-dim/20 text-secondary-dim"
                  : theme === "dark"
                    ? "bg-surface-container text-on-surface-variant hover:text-on-surface"
                    : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              <Tag size={16} />
            </button>
          </div>

          {/* Category spending grid — always visible */}
          <div className={`rounded-2xl p-4 ${
              theme === "dark" ? "bg-surface-container" : "bg-gray-50"
            }`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${textSecondary}`}>
                How much did you spend today?
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[340px] overflow-y-auto pr-1">
                {expenseCategories.map((cat) => {
                  const color = getCategoryColor(cat);
                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <label className={`text-xs font-medium w-24 shrink-0 truncate ${textPrimary}`}>
                        {cat}
                      </label>
                      <div className="flex items-center flex-1 min-w-0">
                        <span className={`text-xs mr-1 ${textSecondary}`}>{currencySymbol}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={catAmounts[cat] ?? ""}
                          onChange={(e) =>
                            setCatAmounts((prev) => ({ ...prev, [cat]: e.target.value }))
                          }
                          className={`w-full px-2 py-1.5 rounded-lg text-xs outline-none transition-colors ${
                            theme === "dark"
                              ? "bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary-dim/50"
                              : "bg-white text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary-dim/50"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleLogCategories}
                disabled={totalToLog === 0 || role !== "admin"}
                className="mt-4 w-full py-2.5 rounded-xl bg-primary-dim text-black text-sm font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={15} />
                Log {currencySymbol}{totalToLog > 0 ? totalToLog.toFixed(2) : "0.00"} Spent Today
              </button>
            </div>

          {/* Category Manager (collapsible) */}
          <AnimatePresence>
            {showCatManager && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`rounded-2xl p-4 space-y-4 ${
                  theme === "dark" ? "bg-surface-container" : "bg-gray-50"
                }`}>
                  <div className="flex items-center gap-2">
                    <Palette size={14} className="text-secondary-dim" />
                    <p className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>
                      Spending Categories
                    </p>
                  </div>

                  {/* Built-in categories (read-only) */}
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{
                          backgroundColor: (categoryColors[c] || "#757480") + "22",
                          color: categoryColors[c] || "#757480",
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: categoryColors[c] || "#757480" }}
                        />
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Custom categories */}
                  {customCategories.length > 0 && (
                    <div>
                      <p className={`text-[10px] uppercase tracking-widest mb-2 ${textSecondary}`}>
                        Custom
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {customCategories.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ backgroundColor: c.color + "22", color: c.color }}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                            {c.name}
                            <button
                              onClick={() => removeCustomCategory(c.id)}
                              className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                              title={`Remove ${c.name}`}
                            >
                              <X size={11} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add new custom category */}
                  <div className="space-y-2">
                    <p className={`text-[10px] uppercase tracking-widest ${textSecondary}`}>
                      Add custom category
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomCategory())}
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCategory}
                        disabled={!newCatName.trim()}
                        className="px-3 py-2 rounded-xl bg-primary-dim text-black text-xs font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-40"
                      >
                        Add
                      </button>
                    </div>
                    {/* Color swatches */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {CUSTOM_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setNewCatColor(col)}
                          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                            newCatColor === col ? "ring-2 ring-offset-2 ring-white scale-110" : ""
                          }`}
                          style={{ backgroundColor: col }}
                          title={col}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries List */}
          {(() => {
            const displayEntries = showAllEntries ? dailySpending : todayEntries;
            const listEmpty = displayEntries.length === 0;
            return (
              <>
                {/* Today / All toggle */}
                {dailySpending.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAllEntries(false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        !showAllEntries
                          ? "bg-primary-dim text-black"
                          : theme === "dark"
                            ? "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                            : "bg-gray-200 text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Today ({todayEntries.length})
                    </button>
                    <button
                      onClick={() => setShowAllEntries(true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        showAllEntries
                          ? "bg-primary-dim text-black"
                          : theme === "dark"
                            ? "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
                            : "bg-gray-200 text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      All Entries ({dailySpending.length})
                    </button>
                  </div>
                )}

                {listEmpty ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 rounded-2xl mesh-gradient-subtle flex items-center justify-center mb-3">
                      <PiggyBank size={20} className={textSecondary} />
                    </div>
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      {showAllEntries ? "No entries yet" : "Nothing logged today"}
                    </p>
                    <p className={`text-xs mt-1 ${textSecondary}`}>
                      {role === "admin" ? "Use the form above to log a purchase" : "Switch to Admin to add entries"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[340px] overflow-y-auto">
                    {displayEntries.map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                          theme === "dark" ? "hover:bg-surface-container" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              backgroundColor: getCategoryColor(entry.category) + "22",
                              color: getCategoryColor(entry.category),
                            }}
                          >
                            {entry.description.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${textPrimary}`}>{entry.description}</p>
                            <p className={`text-xs ${textSecondary}`}>
                              {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              {" · "}
                              {entry.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-error">
                            -{currencySymbol}{entry.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          {role === "admin" && (
                            <button
                              onClick={() => deleteDailySpending(entry.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                theme === "dark"
                                  ? "text-on-surface-variant hover:text-error hover:bg-error-container"
                                  : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!listEmpty && (
                  <div className={`pt-3 flex items-center justify-between ${
                    theme === "dark" ? "border-t border-outline-variant/10" : "border-t border-gray-100"
                  }`}>
                    <span className={`text-sm font-medium ${textSecondary}`}>
                      {showAllEntries ? "All Entries Total" : "Today's Total"}
                    </span>
                    <span className="text-lg font-bold text-error">
                      -{currencySymbol}{displayEntries.reduce((s, e) => s + e.amount, 0)
                        .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </>
            );
          })()}
        </motion.div>
      </div>

      {/* Savings Allocation Card */}
      <motion.div variants={item} className={`${cardBg} rounded-3xl p-6`}>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-dim/20 flex items-center justify-center">
              <Landmark size={18} className="text-primary-dim" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${textPrimary}`}>Savings Allocation</h2>
              <p className={`text-xs ${textSecondary}`}>
                {role === "admin"
                  ? "Set how your monthly savings split between accounts"
                  : "View-only — switch to Admin to edit"}
              </p>
            </div>
          </div>
          {role !== "admin" && (
            <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold uppercase tracking-wider ${
              theme === "dark" ? "bg-surface-container text-on-surface-variant" : "bg-gray-100 text-gray-500"
            }`}>Read Only</span>
          )}
        </div>

        <div className="space-y-5">
          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls}>Savings Account %</label>
              <span className={`text-sm font-bold tabular-nums ${textPrimary}`}>
                {form.savingsAllocationPct ?? 60}% · {100 - (form.savingsAllocationPct ?? 60)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.savingsAllocationPct ?? 60}
              onChange={(e) => setForm({ ...form, savingsAllocationPct: parseInt(e.target.value) })}
              disabled={role !== "admin"}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#a6ef27] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className={`flex justify-between text-[10px] mt-1 ${textSecondary}`}>
              <span>Savings Account</span>
              <span>Current Account</span>
            </div>
          </div>

          {/* Split bar */}
          <div className="w-full h-3 rounded-full flex overflow-hidden">
            <motion.div
              className="h-full bg-primary-dim"
              animate={{ width: `${form.savingsAllocationPct ?? 60}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
            <motion.div
              className="h-full bg-tertiary-dim"
              animate={{ width: `${100 - (form.savingsAllocationPct ?? 60)}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>

          {/* Live amount preview */}
          <div className={`grid grid-cols-2 gap-3`}>
            <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-surface-container" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-dim" />
                <p className={`text-[10px] uppercase tracking-widest font-semibold ${textSecondary}`}>
                  Savings Account
                </p>
              </div>
              <AnimatedNumber
                value={Math.round(userProfile.savedThisMonth * (form.savingsAllocationPct ?? 60) / 100)}
                prefix={currencySymbol}
                decimals={0}
                className={`text-2xl font-bold ${textPrimary}`}
              />
              <p className={`text-xs mt-0.5 ${textSecondary}`}>{form.savingsAllocationPct ?? 60}% of saved</p>
            </div>
            <div className={`rounded-2xl p-4 ${theme === "dark" ? "bg-surface-container" : "bg-gray-50"}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary-dim" />
                <p className={`text-[10px] uppercase tracking-widest font-semibold ${textSecondary}`}>
                  Current Account
                </p>
              </div>
              <AnimatedNumber
                value={Math.round(userProfile.savedThisMonth * (100 - (form.savingsAllocationPct ?? 60)) / 100)}
                prefix={currencySymbol}
                decimals={0}
                className={`text-2xl font-bold ${textPrimary}`}
              />
              <p className={`text-xs mt-0.5 ${textSecondary}`}>{100 - (form.savingsAllocationPct ?? 60)}% of saved</p>
            </div>
          </div>

          <p className={`text-xs ${textSecondary}`}>
            Based on {currencySymbol}{userProfile.savedThisMonth.toLocaleString()} saved this month.
            Adjust <span className={`font-medium ${textPrimary}`}>Saved This Month</span> in Financial Profile to update amounts.
          </p>

          {/* Save via Financial Profile button */}
          <button
            onClick={handleSaveProfile}
            disabled={role !== "admin"}
            className={`w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
              saved ? "bg-primary-dim text-black" : "bg-primary-dim text-black hover:bg-primary-fixed"
            }`}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="flex items-center gap-2">
                  <Check size={16} /> Saved!
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="flex items-center gap-2">
                  <Save size={16} /> Save Allocation
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
