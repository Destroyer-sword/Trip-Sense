import React from "react";
import { Sun, Moon, Bell, Search, Menu } from "lucide-react";

export default function Header({
  activeTab = "Dashboard",
  darkMode,
  setDarkMode,
  onMenuToggle,
}) {
  return (
    <header
      className={`h-20 border-b px-6 md:px-10 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
            darkMode
              ? "hover:bg-blue-800 text-slate-300"
              : "hover:bg-sky-300 text-slate-600"
          }`}
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold">{activeTab} Overview</h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            Hi User, Welcome! Check travel forecasts.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            darkMode
              ? "bg-amber-600 text-orange-100 hover:bg-orange-600"
              : "bg-slate-600 text-white hover:bg-indigo-600"
          }`}
          title="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
