import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useStore } from "../store/useStore";

export default function Layout() {
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const theme = useStore((s) => s.theme);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className={`lg:hidden flex items-center justify-between p-4 sticky top-0 z-30 backdrop-blur-xl ${
          theme === "dark" ? "bg-bg/80" : "bg-light-bg/80"
        }`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-xl ${
              theme === "dark" ? "hover:bg-surface-container-high" : "hover:bg-gray-100"
            }`}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg mesh-gradient flex items-center justify-center">
              <span className="text-black font-bold text-[10px]">EF</span>
            </div>
            <span className={`text-sm font-bold ${
              theme === "dark" ? "text-on-surface" : "text-gray-900"
            }`}>
              Ethereal Finance
            </span>
          </div>
          <div className="w-9" />
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
