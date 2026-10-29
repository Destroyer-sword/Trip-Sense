import React, { useState, useEffect } from "react";
import { getWeatherForecast } from "../services/weatherApi";
import {
  Sun,
  CloudRain,
  Cloud,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Expanded list of popular world destinations
const ALL_DESTINATIONS = [
  {
    name: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bali",
    country: "Indonesia",
    latitude: -8.4095,
    longitude: 115.1889,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rome",
    country: "Italy",
    latitude: 41.9028,
    longitude: 12.4964,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
  },
];

/**
 * Maps WMO Weather Codes from Open-Meteo to UI text & icons
 */
function getWeatherCondition(code) {
  if (code === 0) return { text: "Clear / Sunny", icon: Sun };
  if (code >= 1 && code <= 3) return { text: "Partly Cloudy", icon: Cloud };
  if (code >= 51 || code <= 67 || code >= 80)
    return { text: "Rainy / Showers", icon: CloudRain };
  return { text: "Cloudy", icon: Cloud };
}

export default function PopularCards({ onSelectDestination }) {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchDynamicWeatherData() {
      setLoading(true);
      try {
        // Fetch weather for all cities in parallel via Open-Meteo API
        const promises = ALL_DESTINATIONS.map(async (city) => {
          const weather = await getWeatherForecast(
            city.latitude,
            city.longitude,
          );
          const current = weather.current || {};
          const condition = getWeatherCondition(current.weather_code || 0);

          return {
            ...city,
            temp:
              current.temperature_2m !== undefined
                ? `${Math.round(current.temperature_2m)}°C`
                : "--°C",
            wind: current.wind_speed_10m
              ? `${current.wind_speed_10m} km/h`
              : "--",
            humidity: current.relative_humidity_2m
              ? `${current.relative_humidity_2m}%`
              : "--",
            conditionText: condition.text,
            Icon: condition.icon,
            image: city.image,
          };
        });

        const results = await Promise.all(promises);
        setCardsData(results);
      } catch (err) {
        console.error("Error fetching dynamic weather cards:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicWeatherData();
  }, []);

  const displayedCards = showAll ? cardsData : cardsData.slice(0, 4);

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-200 shadow-sm transition-all">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Popular Destinations</h3>
          <p className="text-xs text-white">
            Showing {displayedCards.length} of {cardsData.length} destinations
          </p>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer transition-all"
        >
          {showAll ? (
            <>
              View Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              View All ({cardsData.length}) <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-200 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs font-medium">
            Fetching dynamic destination forecasts...
          </span>
        </div>
      ) : (
        <>
          {/* Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedCards.map((dest) => {
              const IconComponent = dest.Icon;
              return (
                <div
                  key={dest.name}
                  className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <h4 className="font-bold text-sm">
                        {dest.name},{" "}
                        <span className="font-normal text-xs text-slate-200">
                          {dest.country}
                        </span>
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-slate-800">
                          {dest.temp}
                        </span>
                        <p className="text-xs text-slate-900">
                          {dest.conditionText}
                        </p>
                      </div>
                      <IconComponent className="w-6 h-6 text-blue-500" />
                    </div>

                    {/* Wind & Humidity Details */}
                    <div className="flex items-center justify-between text-[11px] text-white border-t border-slate-100 pt-2">
                      <span>
                        Wind:{" "}
                        <strong className="text-slate-800">{dest.wind}</strong>
                      </span>
                      <span>
                        Humidity:{" "}
                        <strong className="text-slate-800">
                          {dest.humidity}
                        </strong>
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        onSelectDestination && onSelectDestination(dest)
                      }
                      className="w-full py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-semibold rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom View More Button Bar */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-2xl transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {showAll ? (
                <>
                  Show Fewer Destinations <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Explore More Destinations ({cardsData.length - 4} more){" "}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
