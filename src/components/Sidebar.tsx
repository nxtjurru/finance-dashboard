import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  UserCircle,
  Sun,
  Moon,
  Shield,
  Eye,
  X,
  Settings,
} from "lucide-react";
import { useStore } from "../store/useStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Insight", icon: BarChart3 },
  { to: "/profile", label: "My Profile", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
          ${theme === "dark"
            ? "bg-surface-container-low border-r border-outline-variant/10"
            : "bg-white/80 backdrop-blur-xl border-r border-black/5"
          }
        `}
      >
        {/* Logo area */}
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl mesh-gradient flex items-center justify-center">
                <span className="text-black font-bold text-sm">EF</span>
              </div>
              <div>
                <h1 className={`text-sm font-bold tracking-tight ${
                  theme === "dark" ? "text-on-surface" : "text-gray-900"
                }`}>
                  Ethereal Finance
                </h1>
                <p className={`text-[10px] uppercase tracking-widest ${
                  theme === "dark" ? "text-on-surface-variant" : "text-gray-500"
                }`}>
                  Celestial Ledger
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <X size={18} className="text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className="block"
                >
                  <motion.div
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
                      transition-colors duration-200
                      ${isActive
                        ? theme === "dark"
                          ? "bg-primary-dim text-black"
                          : "bg-primary-dim text-black"
                        : theme === "dark"
                          ? "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-2xl bg-primary-dim -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom controls */}
        <div className="p-4 space-y-3">
          {/* Role Toggle */}
          <div className={`rounded-2xl p-3 ${
            theme === "dark" ? "bg-surface-container" : "bg-gray-50"
          }`}>
            <p className={`text-[10px] uppercase tracking-widest mb-2 ${
              theme === "dark" ? "text-on-surface-variant" : "text-gray-500"
            }`}>
              Role Mode
            </p>
            <div className={`flex rounded-xl p-1 ${
              theme === "dark" ? "bg-surface-container-lowest" : "bg-gray-200"
            }`}>
              <button
                onClick={() => setRole("viewer")}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold
                  transition-all duration-300
                  ${role === "viewer"
                    ? "bg-tertiary-dim text-black shadow-lg"
                    : theme === "dark"
                      ? "text-on-surface-variant hover:text-on-surface"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <Eye size={13} />
                Viewer
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold
                  transition-all duration-300
                  ${role === "admin"
                    ? "bg-primary-dim text-black shadow-lg"
                    : theme === "dark"
                      ? "text-on-surface-variant hover:text-on-surface"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <Shield size={13} />
                Admin
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm
              transition-all duration-300
              ${theme === "dark"
                ? "bg-surface-container text-on-surface-variant hover:text-on-surface"
                : "bg-gray-50 text-gray-600 hover:text-gray-900"
              }
            `}
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <div className={`w-8 h-5 rounded-full relative transition-colors ${
              theme === "light" ? "bg-primary-dim" : "bg-outline-variant"
            }`}>
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                animate={{ left: theme === "light" ? 16 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
