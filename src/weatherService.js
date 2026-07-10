import config from "./config.json";

const { baseUrl, units } = config.api;

const API_KEY = process.env.REACT_APP_OWM_KEY;


/**
 
 * @param {string} url
 * @returns {Promise<object>}
 */
const apiFetch = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.json();
};



const buildCityParams  = (city) =>
  `q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`;

const buildCoordsParams = (lat, lon) =>
  `lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

/**
 
 * @param {string} city
 * @returns {Promise<{ weather: object, forecast: object }>}
 */
export const fetchWeatherByCity = async (city) => {
  const params = buildCityParams(city);
  const [weather, forecast] = await Promise.all([
    apiFetch(`${baseUrl}/weather?${params}`),
    apiFetch(`${baseUrl}/forecast?${params}`),
  ]);
  return { weather, forecast };
};

/**
 
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{ weather: object, forecast: object }>}
 */
export const fetchWeatherByCoords = async (lat, lon) => {
  const params = buildCoordsParams(lat, lon);
  const [weather, forecast] = await Promise.all([
    apiFetch(`${baseUrl}/weather?${params}`),
    apiFetch(`${baseUrl}/forecast?${params}`),
  ]);
  return { weather, forecast };
};

/**
 
 * @returns {Promise<{ weather: object, forecast: object }>}
 */
export const fetchWeatherByGeolocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await fetchWeatherByCoords(coords.latitude, coords.longitude);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      () => reject(new Error("Location access was denied. Please search manually."))
    );
  });
