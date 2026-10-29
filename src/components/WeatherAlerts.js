import React from "react";
import {
  CloudRain,
  Sun,
  Snowflake,
  Compass,
  Briefcase,
  BarChart2,
} from "lucide-react";

export default function WeatherAlerts() {
  const alerts = [
    {
      title: "Heavy Rainfall",
      location: "Bali, Indonesia",
      desc: "Expect heavy rainfall in the next 24 hours. Consider indoor activities.",
      icon: CloudRain,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "High Temperature",
      location: "Dubai, UAE",
      desc: "Temperature may reach 42°C. Stay hydrated.",
      icon: Sun,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Snowfall Alert",
      location: "Zurich, Switzerland",
      desc: "Light snowfall expected this week.",
      icon: Snowflake,
      color: "bg-sky-50 text-sky-600 border-sky-100",
    },
  ];

  const tips = [
    {
      title: "Best time to visit Bali",
      desc: "Dry season: Apr – Oct. Ideal for beach activities.",
      icon: Compass,
    },
    {
      title: "Pack accordingly",
      desc: "Check weather forecast before your trip.",
      icon: Briefcase,
    },
    {
      title: "Compare destinations",
      desc: "Find the best weather for your planned activities.",
      icon: BarChart2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Weather Alerts Section */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-red-700">
            Weather Alerts !!!
          </h3>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, idx) => {
            const Icon = alert.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${alert.color} flex gap-3 items-start`}
              >
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {alert.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-700">
                    {alert.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{alert.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-amber-50 text-amber-500 rounded-lg">
            <Sun className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-amber-700">Quick Tips</h3>
        </div>

        <div className="space-y-4">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-none last:pb-0"
              >
                <div className="p-2 bg-slate-50 text-blue-600 rounded-xl shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-yellow-300">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{tip.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
