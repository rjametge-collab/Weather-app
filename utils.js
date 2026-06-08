import { WEATHER_ICONS, WEATHER_ICON_FALLBACK, COMPASS_DIRS } from "../constants/constants";



/**

 * @param {number} celsius
 * @returns {number}
 */
export const celsiusToFahrenheit = (celsius) => Math.round(celsius * 9 / 5 + 32);

/**
 
 * @param {number} value
 * @returns {number}
 */
export const roundTemp = (value) => Math.round(value);

/**
 * Format a temperature with its unit label
 * @param {number} celsius - temperature in Celsius
 * @param {"C"|"F"} unit  - desired output unit
 * @returns {string}       e.g. "22°C" or "72°F"
 */
export const formatTemp = (celsius, unit) => {
  const value = unit === "C" ? roundTemp(celsius) : celsiusToFahrenheit(celsius);
  return `${value}°${unit}`;
};



/**
 * Convert wind speed from m/s to km/h
 * @param {number} ms - speed in metres per second
 * @returns {number}
 */
export const msToKmh = (ms) => Math.round(ms * 3.6);

/**
 * Convert a wind bearing in degrees to a compass label
 * @param {number} degrees - 0–360
 * @returns {string}        e.g. "NW"
 */
export const degreesToCompass = (degrees) => {
  const index = Math.round((degrees || 0) / 45) % 8;
  return COMPASS_DIRS[index];
};

// ─── VISIBILITY ───────────────────────────────────────────────────────────────

/**
 * Convert visibility from metres to kilometres (1 decimal place)
 * @param {number} metres
 * @returns {string}  e.g. "9.5"
 */
export const metresToKm = (metres) => ((metres || 10000) / 1000).toFixed(1);

// ─── DATE & TIME ─────────────────────────────────────────────────────────────

/**
 * Format a Unix timestamp as a short weekday name
 * @param {number} unixTs - Unix timestamp (seconds)
 * @returns {string}        e.g. "Mon"
 */
export const toDayName = (unixTs) =>
  new Date(unixTs * 1000).toLocaleDateString("en-US", { weekday: "short" });

/**
 * Format a Unix timestamp as a 12-hour time string
 * @param {number} unixTs - Unix timestamp (seconds)
 * @returns {string}        e.g. "06:32 AM"
 */
export const toTimeString = (unixTs) =>
  new Date(unixTs * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Format today's date as a human-readable string
 * @returns {string}  e.g. "Thursday, May 14, 2026"
 */
export const todayString = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// ─── WEATHER ICONS ───────────────────────────────────────────────────────────

/**
 * Resolve an OWM icon code to an [emoji, label] pair
 * @param {string} iconCode - e.g. "02d"
 * @returns {[string, string]}
 */
export const resolveWeatherIcon = (iconCode) =>
  WEATHER_ICONS[iconCode] || WEATHER_ICON_FALLBACK;

// ─── FORECAST PROCESSING ─────────────────────────────────────────────────────

/**

 * @param {Array}  forecastList - items from OWM /forecast response
 * @param {number} maxDays      - how many days to return (default 5)
 * @returns {Array<{dt, high, low, icon, desc, pop}>}
 */
export const groupForecastByDay = (forecastList, maxDays = 5) => {
  const days = {};

  forecastList.forEach((item) => {
    const key = new Date(item.dt * 1000).toDateString();
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });

  return Object.entries(days)
    .slice(0, maxDays)
    .map(([, items]) => {
      const mid = items[Math.floor(items.length / 2)];
      return {
        dt:   mid.dt,
        high: Math.max(...items.map((i) => i.main.temp_max)),
        low:  Math.min(...items.map((i) => i.main.temp_min)),
        icon: mid.weather[0].icon,
        desc: mid.weather[0].description,
        pop:  Math.max(...items.map((i) => i.pop || 0)),
      };
    });
};

/**
 
 * @param {Array}  forecastList - items from OWM /forecast response
 * @param {number} dayUnixTs    - Unix timestamp of the target day
 * @returns {Array}
 */
export const getHourlyForDay = (forecastList, dayUnixTs) => {
  const targetDate = new Date(dayUnixTs * 1000).toDateString();
  return forecastList.filter(
    (item) => new Date(item.dt * 1000).toDateString() === targetDate
  );
};



const RECENTS_KEY = "wx_recents";
const MAX_RECENTS = 5;

/**
 
 * @returns {string[]}
 */
export const loadRecentCities = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]");
  } catch {
    return [];
  }
};

/**
 
 * @param {string} cityName
 */
export const saveRecentCity = (cityName) => {
  const updated = [
    cityName,
    ...loadRecentCities().filter(
      (c) => c.toLowerCase() !== cityName.toLowerCase()
    ),
  ].slice(0, MAX_RECENTS);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
};
