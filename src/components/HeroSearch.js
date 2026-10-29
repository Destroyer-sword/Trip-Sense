import React, { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchLocation } from "../services/weatherApi";

const POPULAR_CITIES = [
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  {
    name: "Bali",
    country: "Indonesia",
    latitude: -8.4095,
    longitude: 115.1889,
  },
  {
    name: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
  },
  { name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964 },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
  },
];

export default function HeroSearch({ onSelectLocation, darkMode }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const lightBgImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";
  const darkBgImage =
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80";

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 1) {
      const results = await searchLocation(value);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPopularCity = (cityObj) => {
    setQuery(`${cityObj.name}, ${cityObj.country}`);
    setSuggestions([]);
    if (onSelectLocation) {
      onSelectLocation(cityObj);
    }
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Check if user entered a popular city name directly
      const matchedPopular = POPULAR_CITIES.find(
        (c) => c.name.toLowerCase() === query.trim().toLowerCase(),
      );

      if (matchedPopular) {
        onSelectLocation(matchedPopular);
      } else {
        const results = await searchLocation(query);
        if (results && results.length > 0) {
          onSelectLocation(results[0]);
        } else {
          alert(
            `No results found for "${query}". Please try another location.`,
          );
        }
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
      setSuggestions([]);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8 min-h-[340px] flex items-center transition-all duration-300">
      {/* Background Image Layer switching explicitly based on darkMode */}
      <div
        key={darkMode ? "dark-bg" : "light-bg"}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 scale-105"
        style={{
          backgroundImage: `url('${darkMode ? darkBgImage : lightBgImage}')`,
        }}
      />

      {/* Dynamic Gradient Overlay */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          darkMode
            ? "bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/50"
            : "bg-gradient-to-r from-blue-950/80 via-blue-900/60 to-transparent"
        }`}
      />

      {/* Hero Content */}
      <div className="relative p-8 md:p-12 lg:p-14 text-white max-w-2xl z-10 w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
          Plan Your Next Trip with the Perfect Weather
        </h1>
        <p className="text-slate-200 text-sm md:text-base mb-8">
          Search destinations, check real-time weather, compare places and build
          your travel itinerary.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center bg-white rounded-2xl p-2 shadow-xl border border-slate-100">
            <MapPin className="w-5 h-5 text-blue-600 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search for a city or destination..."
              className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4 hidden sm:block" />
              )}
              Search
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 text-slate-800">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectLocation(item);
                    setQuery(`${item.name}, ${item.country}`);
                    setSuggestions([]);
                  }}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-sm transition-colors border-b border-slate-50 last:border-none"
                >
                  <span className="font-semibold text-slate-800">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.country} ({item.admin1 || ""})
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-5 text-xs">
          <span className="text-slate-200 font-semibold">
            Popular destinations:
          </span>
          {POPULAR_CITIES.map((cityObj) => (
            <button
              type="button"
              key={cityObj.name}
              onClick={() => handleSelectPopularCity(cityObj)}
              className="px-3 py-1 bg-white/20 hover:bg-white/35 border border-white/30 rounded-full backdrop-blur-md text-white font-medium transition-all active:scale-95 cursor-pointer"
            >
              {cityObj.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
