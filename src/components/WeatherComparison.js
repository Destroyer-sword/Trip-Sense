import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart2, Loader2, Check } from "lucide-react";

// Available cities list
const AVAILABLE_CITIES = [
  {
    name: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    color: "#3b82f6",
  },
  {
    name: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    color: "#ef4444",
  },
  {
    name: "Bali",
    country: "Indonesia",
    latitude: -8.4095,
    longitude: 115.1889,
    color: "#10b981",
  },
  {
    name: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
    color: "#f59e0b",
  },
  {
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
    color: "#8b5cf6",
  },
  {
    name: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    color: "#ec4899",
  },
  {
    name: "Rome",
    country: "Italy",
    latitude: 41.9028,
    longitude: 12.4964,
    color: "#06b6d4",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    color: "#f97316",
  },
];

const METRICS = [
  {
    id: "temperature",
    label: "Temperature",
    unit: "°C",
    key: "temperature_2m_max",
  },
  { id: "rainfall", label: "Rainfall", unit: "mm", key: "precipitation_sum" },
  { id: "wind", label: "Wind", unit: "km/h", key: "wind_speed_10m_max" },
  {
    id: "humidity",
    label: "Humidity",
    unit: "%",
    key: "relative_humidity_2m_mean",
  },
];

export default function WeatherComparison() {
  const [selectedCityNames, setSelectedCityNames] = useState([
    "Paris",
    "Tokyo",
    "Bali",
    "New York",
  ]);
  const [activeMetric, setActiveMetric] = useState(METRICS[0]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle city selection
  const handleToggleCity = (cityName) => {
    if (selectedCityNames.includes(cityName)) {
      if (selectedCityNames.length === 1) {
        alert("At least one city must be selected for comparison.");
        return;
      }
      setSelectedCityNames(
        selectedCityNames.filter((name) => name !== cityName),
      );
    } else {
      if (selectedCityNames.length >= 5) {
        alert("You can compare up to 5 cities at a time.");
        return;
      }
      setSelectedCityNames([...selectedCityNames, cityName]);
    }
  };

  useEffect(() => {
    async function fetchComparisonData() {
      setLoading(true);
      try {
        const selectedCitiesObj = AVAILABLE_CITIES.filter((city) =>
          selectedCityNames.includes(city.name),
        );

        // Fetch forecast data for all selected cities
        const requests = selectedCitiesObj.map(async (city) => {
          const params = new URLSearchParams({
            latitude: city.latitude,
            longitude: city.longitude,
            daily:
              "temperature_2m_max,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean",
            timezone: "auto",
          });
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          );
          const data = await res.json();
          return { cityName: city.name, daily: data.daily };
        });

        const results = await Promise.all(requests);

        if (results.length > 0 && results[0].daily && results[0].daily.time) {
          const days = results[0].daily.time; // Dates array (e.g., ["2026-10-28", ...])

          // Transform API output into Recharts format
          const formattedChartData = days.map((dateStr, index) => {
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            const dataPoint = { day: formattedDate };

            results.forEach((res) => {
              const metricKey = activeMetric.key;
              const value =
                res.daily && res.daily[metricKey]
                  ? res.daily[metricKey][index]
                  : 0;
              dataPoint[res.cityName] = value !== null ? Math.round(value) : 0;
            });

            return dataPoint;
          });

          setChartData(formattedChartData);
        }
      } catch (error) {
        console.error("Error fetching comparison weather metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComparisonData();
  }, [selectedCityNames, activeMetric]);

  const activeCitiesObj = AVAILABLE_CITIES.filter((c) =>
    selectedCityNames.includes(c.name),
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      {/* Header & Metric Switcher Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Weather Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Compare live 7-day weather metrics
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
          {METRICS.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric.id === metric.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* City Selector Pills */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-500 block mb-2">
          Select Cities to Compare (1 - 5 cities):
        </span>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_CITIES.map((city) => {
            const isSelected = selectedCityNames.includes(city.name);
            return (
              <button
                key={city.name}
                onClick={() => handleToggleCity(city.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-2xs"
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: city.color }}
                />
                {city.name}
                {isSelected && <Check className="w-3 h-3 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Section */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs font-medium">
            Loading {activeMetric.label} comparison data...
          </span>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} unit={activeMetric.unit} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "12px",
                  color: "#fff",
                  border: "none",
                  fontSize: "12px",
                }}
              />
              {activeCitiesObj.map((city) => (
                <Line
                  key={city.name}
                  type="monotone"
                  dataKey={city.name}
                  stroke={city.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-600">
        {activeCitiesObj.map((city) => (
          <span key={city.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: city.color }}
            />
            {city.name}
          </span>
        ))}
      </div>
    </div>
  );
}
