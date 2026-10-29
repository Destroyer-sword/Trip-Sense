import React, { useState } from "react";

import {
  Calendar as CalendarIcon,
  Edit3,
  Trash2,
  Plus,
  MapPin,
} from "lucide-react";

export default function ItineraryPanel({
  itineraries = [],

  onAddItinerary,

  onDeleteItinerary,

  onSelectItinerary,
}) {
  // State to track whether the panel is expanded to view all itineraries

  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which itineraries to show based on expansion state

  const displayedItineraries = isExpanded
    ? itineraries
    : itineraries.slice(0, 2);

  return (
    <div className="rounded-3xl border border-slate-200 p-6 bg-slate-900 shadow-sm">
      {/* Panel Header */}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-white">My Itinerary</h3>

          <p className="text-xs text-slate-400 font-medium">
            {itineraries.length} trip{itineraries.length !== 1 ? "s" : ""}{" "}
            planned
          </p>
        </div>

        {itineraries.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer transition-all"
          >
            {isExpanded ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {/* Itineraries List */}

      <div
        className={`space-y-3 mb-6 transition-all duration-300 ${isExpanded ? "max-h-80 overflow-y-auto pr-1" : ""}`}
      >
        {itineraries.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />

            <p className="text-xs font-medium text-slate-500">
              No itineraries created yet.
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5">
              Start by creating your first travel plan!
            </p>
          </div>
        ) : (
          displayedItineraries.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all flex items-center justify-between gap-3 group"
            >
              {/* Destination Image Thumbnail */}

              <img
                src={item.image}
                alt={item.city}
                className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs"
              />

              {/* Information */}

              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onSelectItinerary && onSelectItinerary(item)}
              >
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500 shrink-0" />

                  {item.city}
                </h4>

                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3 text-slate-400 shrink-0" />

                  {item.dates}
                </p>
              </div>

              {/* Actions */}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const newDates = prompt("Update travel dates:", item.dates);

                    if (newDates && onAddItinerary) {
                      // Trigger update logic
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                  title="Edit Itinerary"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() =>
                    onDeleteItinerary && onDeleteItinerary(item.id)
                  }
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Itinerary"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onAddItinerary}
        className="w-full py-3 bg-blue-400 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Create New Itinerary
      </button>
    </div>
  );
}
