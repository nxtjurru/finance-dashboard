import { useState, memo } from "react";
import { motion } from "framer-motion";
import {
  Globe, DollarSign, Bell, Shield, LogOut, User,
  ChevronRight, Check, Palette,
} from "lucide-react";
import { useStore } from "../store/useStore";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

const LANGUAGES = [
  { code: "en-IN", label: "English (India)" },
  { code: "en-US", label: "English (US)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "es-ES", label: "Spanish" },
];

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Germany",
  "France", "Japan", "UAE", "Canada", "Australia", "Singapore",
];

const DATE_FORMATS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

// Module-level components — stable references, not recreated on every Settings render

const Section = memo(function Section({ icon: Icon, title, color = "text-primary-dim", children, theme }: {
  icon: React.ElementType; title: string; color?: string; children: React.ReactNode; theme: "dark" | "light";
}) {
  const cardBg = theme === "dark" ? "bg-surface-container-low" : "bg-white shadow-sm";
  const textPrimary = theme === "dark" ? "text-on-surface" : "text-gray-900";
  return (
    <motion.div variants={item} className={`${cardBg} rounded-3xl p-6`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          theme === "dark" ? "bg-surface-container-high" : "bg-gray-100"
        }`}>
          <Icon size={18} className={color} />
        </div>
        <h2 className={`text-base font-bold ${textPrimary}`}>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
});

const Field = memo(function Field({ label, children, divider, textSecondary }: {
  label: string; children: React.ReactNode; divider: string; textSecondary: string;
}) {
  return (
    <div className={`py-3 border-b ${divider} last:border-0`}>
      <label className={`block text-xs uppercase tracking-widest font-semibold mb-2 ${textSecondary}`}>
        {label}
      </label>
      {children}
    </div>
  );
});

const SelectField = memo(function SelectField({ value, onChange, options, inputBg }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  inputBg: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
});

export default function Settings() {
  const theme = useStore((s) => s.theme);
  const role = useStore((s) => s.role);
  const appSettings = useStore((s) => s.appSettings);
  const updateAppSettings = useStore((s) => s.updateAppSettings);
  const setRole = useStore((s) => s.setRole);

  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState(appSettings);

  const textPrimary = theme === "dark" ? "text-on-surface" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-on-surface-variant" : "text-gray-500";
  const inputBg = theme === "dark"
    ? "bg-surface-container-highest text-on-surface border-outline-variant/30 focus:border-primary-dim"
    : "bg-gray-50 text-gray-900 border-gray-200 focus:border-primary-dim";
  const divider = theme === "dark" ? "border-outline-variant/10" : "border-gray-100";

  const handleSave = () => {
    updateAppSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[860px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight ${textPrimary}`}>
            Settings
          </h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            Manage your preferences, account details, and app configuration.
          </p>
        </div>
        <motion.button
          onClick={handleSave}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            saved
              ? "bg-primary-dim/20 text-primary-dim"
              : "bg-primary-dim text-black hover:brightness-110"
          }`}
        >
          {saved ? <Check size={15} /> : null}
          {saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </motion.div>

      {/* Account */}
      <Section icon={User} title="Account" color="text-secondary-dim" theme={theme}>
        <Field label="Name" divider={divider} textSecondary={textSecondary}>
          <input
            type="text"
            value={localSettings.userName}
            onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
            className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" divider={divider} textSecondary={textSecondary}>
          <input
            type="email"
            value={localSettings.userEmail}
            onChange={(e) => setLocalSettings({ ...localSettings, userEmail: e.target.value })}
            className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inputBg}`}
            placeholder="your@email.com"
          />
        </Field>
      </Section>

      {/* Regional Settings */}
      <Section icon={Globe} title="Regional" color="text-tertiary-dim" theme={theme}>
        <Field label="Currency" divider={divider} textSecondary={textSecondary}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setLocalSettings({ ...localSettings, currencySymbol: c.symbol, currencyCode: c.code })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  localSettings.currencyCode === c.code
                    ? "border-primary-dim bg-primary-dim/10 text-primary-dim"
                    : theme === "dark"
                      ? "border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-base font-bold w-6 text-center">{c.symbol}</span>
                <span className="text-xs">{c.code}</span>
                {localSettings.currencyCode === c.code && (
                  <Check size={12} className="ml-auto text-primary-dim" />
                )}
              </button>
            ))}
          </div>
          <p className={`text-xs mt-2 ${textSecondary}`}>
            Selected: {CURRENCIES.find(c => c.code === localSettings.currencyCode)?.name}
          </p>
        </Field>

        <Field label="Language" divider={divider} textSecondary={textSecondary}>
          <SelectField
            value={localSettings.language}
            onChange={(v) => setLocalSettings({ ...localSettings, language: v })}
            options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
            inputBg={inputBg}
          />
        </Field>

        <Field label="Country" divider={divider} textSecondary={textSecondary}>
          <SelectField
            value={localSettings.country}
            onChange={(v) => setLocalSettings({ ...localSettings, country: v })}
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            inputBg={inputBg}
          />
        </Field>

        <Field label="Date Format" divider={divider} textSecondary={textSecondary}>
          <SelectField
            value={localSettings.dateFormat}
            onChange={(v) => setLocalSettings({ ...localSettings, dateFormat: v })}
            options={DATE_FORMATS}
            inputBg={inputBg}
          />
        </Field>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance" color="text-primary-dim" theme={theme}>
        <div className={`py-3 border-b ${divider}`}>
          <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${textSecondary}`}>
            Theme
          </label>
          <div className="flex gap-3">
            {(["dark", "light"] as const).map((t) => (
              <div
                key={t}
                className={`flex-1 rounded-2xl border-2 p-4 text-center text-sm font-medium cursor-default transition-all ${
                  theme === t
                    ? "border-primary-dim"
                    : theme === "dark"
                      ? "border-outline-variant/20"
                      : "border-gray-200"
                }`}
                style={{
                  background: t === "dark" ? "#0e0e13" : "#f9fafb",
                  color: t === "dark" ? "#e6e4f1" : "#111827",
                }}
              >
                {t === "dark" ? "🌙 Dark" : "☀️ Light"}
                {theme === t && (
                  <span className="ml-2 text-xs text-primary-dim font-semibold">(Active)</span>
                )}
              </div>
            ))}
          </div>
          <p className={`text-xs mt-2 ${textSecondary}`}>
            Toggle theme using the switch in the sidebar.
          </p>
        </div>
      </Section>

      {/* Role & Permissions */}
      <Section icon={Shield} title="Role & Permissions" color="text-primary-dim" theme={theme}>
        <div className={`py-3 border-b ${divider}`}>
          <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${textSecondary}`}>
            Current Role
          </label>
          <div className="flex gap-3">
            {(["viewer", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  role === r
                    ? "bg-primary-dim text-black"
                    : theme === "dark"
                      ? "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                      : "bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <p className={`text-xs mt-2 ${textSecondary}`}>
            Admin role enables editing data, managing transactions, and modifying charts.
          </p>
        </div>
      </Section>

      {/* Notifications (static UI) */}
      <Section icon={Bell} title="Notifications" color="text-secondary-dim" theme={theme}>
        {[
          { label: "Budget alerts", description: "Get notified when you exceed category budgets", enabled: true },
          { label: "Monthly summary", description: "Receive a monthly report of your finances", enabled: true },
          { label: "Savings milestones", description: "Celebrate when you hit savings goals", enabled: false },
          { label: "Large transactions", description: "Alert for transactions above ₹10,000", enabled: false },
        ].map((notif, i) => (
          <div key={i} className={`flex items-center justify-between py-3 border-b ${divider} last:border-0`}>
            <div>
              <p className={`text-sm font-medium ${textPrimary}`}>{notif.label}</p>
              <p className={`text-xs ${textSecondary} mt-0.5`}>{notif.description}</p>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors cursor-default ${
              notif.enabled ? "bg-primary-dim" : theme === "dark" ? "bg-outline-variant" : "bg-gray-300"
            }`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                notif.enabled ? "left-5" : "left-1"
              }`} />
            </div>
          </div>
        ))}
      </Section>

      {/* Data & Privacy */}
      <Section icon={DollarSign} title="Data & Privacy" color="text-error" theme={theme}>
        {[
          { label: "Export data", description: "Download all your transaction data as CSV" },
          { label: "Clear all data", description: "Reset the app to factory defaults" },
          { label: "Privacy policy", description: "View how your data is handled" },
        ].map((action, i) => (
          <button
            key={i}
            className={`w-full flex items-center justify-between py-3 border-b ${divider} last:border-0 text-left group`}
          >
            <div>
              <p className={`text-sm font-medium ${textPrimary} group-hover:text-primary-dim transition-colors`}>
                {action.label}
              </p>
              <p className={`text-xs ${textSecondary} mt-0.5`}>{action.description}</p>
            </div>
            <ChevronRight size={16} className={`${textSecondary} group-hover:text-primary-dim transition-colors`} />
          </button>
        ))}
      </Section>

      {/* Sign Out */}
      <motion.div variants={item}>
        <button
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-3xl border-2 text-sm font-semibold transition-all ${
            theme === "dark"
              ? "border-error/30 text-error hover:bg-error/10"
              : "border-red-200 text-red-500 hover:bg-red-50"
          }`}
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <p className={`text-center text-xs mt-3 ${textSecondary}`}>
          Ethereal Finance v1.0 · Celestial Ledger
        </p>
      </motion.div>
    </motion.div>
  );
}
