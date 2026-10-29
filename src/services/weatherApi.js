const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Search for a location using Open-Meteo Geocoding API
 */
export async function searchLocation(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching location:", error);
    return [];
  }
}

/**
 * Fetch forecast data for given coordinates
 */
export async function getWeatherForecast(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum",
      hourly:
        "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code",
      timezone: "auto",
    });

    const response = await fetch(`${WEATHER_URL}?${params.toString()}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
}
