// src/App.js
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import HeroSearch from "./components/HeroSearch";
import PopularCards from "./components/PopularCards";
import WeatherComparison from "./components/WeatherComparison";
import WeatherAlerts from "./components/WeatherAlerts";
import ItineraryPanel from "./components/ItineraryPanel";
import { getWeatherForecast } from "./services/weatherApi";
import {
  X,
  Home,
  Compass,
  BarChart2,
  Calendar,
  Plane,
  Loader2,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const [itineraries, setItineraries] = useState([
    {
      id: 1,
      city: "Bali, Indonesia",
      dates: "12 – 18 Nov 2026",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 2,
      city: "Singapore",
      dates: "25 – 28 Dec 2026",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: 3,
      city: "Tokyo, Japan",
      dates: "10 – 16 Jan 2027",
      image:
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&q=80",
    },
  ]);

  const handleSelectLocation = async (location) => {
    setSelectedLocation(location);
    setLoadingWeather(true);
    try {
      const data = await getWeatherForecast(
        location.latitude,
        location.longitude,
      );
      setWeatherData(data);
    } catch (err) {
      console.error("Failed to load weather data", err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleCreateItinerary = () => {
    const cityName = prompt("Enter destination city (e.g., Paris, France):");
    if (!cityName) return;
    const dates = prompt(
      "Enter travel dates (e.g., 5 – 10 Oct 2026):",
      "10 – 15 Dec 2026",
    );

    // Array of high-quality travel image URLs
    const travelImages = [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80", // General travel
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80", // Paris / Architecture
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80", // City night
      "https://images.unsplash.com/photo-1476514525535-ce74f45814d0?auto=format&fit=crop&w=400&q=80", // Mountain lake
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", // Beach
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=400&q=80", // Tropical island
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=80", // Italy / Coastal
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=400&q=80", // Flight / Skyline
    ];

    // Pick a random image from the array
    const randomImage =
      travelImages[Math.floor(Math.random() * travelImages.length)];

    const newEntry = {
      id: Date.now(),
      city: cityName,
      dates: dates || "Flexible dates",
      image: randomImage,
    };

    setItineraries([newEntry, ...itineraries]);
  };

  const handleDeleteItinerary = (id) => {
    setItineraries(itineraries.filter((item) => item.id !== id));
  };

  const navItems = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Compass },
    { name: "Compare", icon: BarChart2 },
    { name: "Itineraries", icon: Calendar },
  ];

  return (
    <div
      className={`min-h-screen flex ${darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"}`}
    >
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
      />

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div
            className={`relative w-64 h-full flex flex-col justify-between p-6 z-10 transition-colors ${
              darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-800"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md">
                    <Plane className="w-5 h-5 -rotate-45" />
                  </div>
                  <span className="text-lg font-bold">TripSense</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold"
                          : darkMode
                            ? "hover:bg-slate-800 text-slate-300"
                            : "hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-10 overflow-y-auto">
          {activeTab === "Home" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                {/* Hero Search with darkMode passed */}
                <HeroSearch
                  onSelectLocation={handleSelectLocation}
                  darkMode={darkMode}
                />

                {/* Selected Location Live Weather Banner */}
                {selectedLocation && (
                  <div className="p-6 bg-blue-600 text-white rounded-3xl shadow-lg flex justify-between items-center transition-all">
                    <div>
                      <h3 className="text-xl font-bold">
                        {selectedLocation.name}, {selectedLocation.country}
                      </h3>
                      {loadingWeather ? (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-100">
                          <Loader2 className="w-4 h-4 animate-spin" /> Fetching
                          live forecast...
                        </div>
                      ) : weatherData ? (
                        <p className="mt-1 text-2xl font-extrabold">
                          {weatherData.current?.temperature_2m !== undefined
                            ? `${Math.round(weatherData.current.temperature_2m)}°C`
                            : "--"}
                          <span className="text-sm font-normal text-blue-100 ml-3">
                            (Wind: {weatherData.current?.wind_speed_10m || 0}{" "}
                            km/h)
                          </span>
                        </p>
                      ) : null}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLocation(null);
                        setWeatherData(null);
                      }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                )}

                <PopularCards onSelectDestination={handleSelectLocation} />
                <WeatherComparison />
              </div>

              <div className="space-y-8">
                <ItineraryPanel
                  itineraries={itineraries}
                  onAddItinerary={handleCreateItinerary}
                  onDeleteItinerary={handleDeleteItinerary}
                />
                <WeatherAlerts />
              </div>
            </div>
          )}

          {activeTab === "Explore" && (
            <div className="max-w-6xl mx-auto space-y-8">
              <PopularCards onSelectDestination={handleSelectLocation} />
            </div>
          )}

          {activeTab === "Compare" && (
            <div className="max-w-6xl mx-auto space-y-8">
              <WeatherComparison />
            </div>
          )}

          {activeTab === "Itineraries" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <ItineraryPanel
                itineraries={itineraries}
                onAddItinerary={handleCreateItinerary}
                onDeleteItinerary={handleDeleteItinerary}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
