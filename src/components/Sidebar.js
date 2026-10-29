import React from "react";
import { Home, Compass, BarChart2, Calendar, Plane } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, darkMode }) {
  const navItems = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Compass },
    { name: "Compare", icon: BarChart2 },
    { name: "Itineraries", icon: Calendar },
  ];

  return (
    <aside
      className={`w-64 border-r flex flex-col justify-between hidden lg:flex h-screen sticky top-0 transition-colors duration-200 ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      <div>
        {/* Logo */}
        <div
          className="flex items-center gap-2 px-6 py-6 cursor-pointer"
          onClick={() => setActiveTab("Home")}
        >
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md">
            <Plane className="w-6 h-6 -rotate-45" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TripSense
          </span>
        </div>

        {/* Nav Links */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  isActive
                    ? darkMode
                      ? "bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30"
                      : "bg-blue-50 text-blue-600 font-semibold"
                    : darkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
