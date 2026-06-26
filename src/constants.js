// ─── WEATHER ICONS ──────────────────────────────────────────────────────────
export const WEATHER_ICONS = {
  "01d": ["☀️", "Clear"],
  "01n": ["🌙", "Clear"],
  "02d": ["⛅", "Partly Cloudy"],
  "02n": ["☁️", "Partly Cloudy"],
  "03d": ["☁️", "Cloudy"],
  "03n": ["☁️", "Cloudy"],
  "04d": ["☁️", "Overcast"],
  "04n": ["☁️", "Overcast"],
  "09d": ["🌧️", "Showers"],
  "09n": ["🌧️", "Showers"],
  "10d": ["🌦️", "Rain"],
  "10n": ["🌧️", "Rain"],
  "11d": ["⛈️", "Thunderstorm"],
  "11n": ["⛈️", "Thunderstorm"],
  "13d": ["❄️", "Snow"],
  "13n": ["❄️", "Snow"],
  "50d": ["🌫️", "Fog"],
  "50n": ["🌫️", "Fog"],
};

export const WEATHER_ICON_FALLBACK = ["🌡️", "Unknown"];


export const COMPASS_DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];


export const UNIT_LABELS = {
  C: "°C",
  F: "°F",
};


export const STAT_CONFIG = [
  { key: "humidity",   label: "Humidity",   unit: "%",    path: "main.humidity" },
  { key: "wind",       label: "Wind",       unit: "km/h", path: "wind.speed"    },
  { key: "pressure",   label: "Pressure",   unit: "hPa",  path: "main.pressure" },
  { key: "visibility", label: "Visibility", unit: "km",   path: "visibility"    },
];

// ─── ERROR MESSAGES ──────────────────────────────────────────────────────────
export const ERRORS = {
  CITY_NOT_FOUND:    "City not found. Please check the spelling and try again.",
  NETWORK_ERROR:     "Network error. Please check your connection.",
  LOCATION_DENIED:   "Location access was denied. Please search manually.",
  LOCATION_UNSUPPORTED: "Geolocation is not supported by your browser.",
  GENERIC:           "Something went wrong. Please try again.",
};
