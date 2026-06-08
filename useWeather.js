import { useState, useCallback } from "react";
import {
  fetchWeatherByCity,
  fetchWeatherByGeolocation,
} from "../services/weatherService";
import { saveRecentCity, loadRecentCities } from "../utils/utils";
import { ERRORS } from "../constants/constants";

/**
 * useWeather
 *
 * Custom React hook that encapsulates all weather state and fetch logic.
 * Keeps WeatherApp.jsx clean — it only deals with rendering.
 *
 * Returns:
 *   weather       — current weather object (OWM shape) or null
 *   forecast      — 5-day forecast object (OWM shape) or null
 *   loading       — boolean
 *   error         — string or ""
 *   recentCities  — string[]
 *   searchCity    — (cityName: string) => void
 *   searchByGeo   — () => void
 */
const useWeather = () => {
  const [weather,      setWeather]      = useState(null);
  const [forecast,     setForecast]     = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [recentCities, setRecentCities] = useState(loadRecentCities);

  // ── shared post-fetch handler ──────────────────────────────────────────────
  const handleSuccess = useCallback(({ weather: w, forecast: f }) => {
    setWeather(w);
    setForecast(f);
    setError("");
    saveRecentCity(w.name);
    setRecentCities(loadRecentCities());
  }, []);

  const handleError = useCallback((err) => {
    const msg = err?.message || ERRORS.GENERIC;
    // Map OWM "city not found" wording to our friendlier copy
    setError(
      msg.toLowerCase().includes("not found")
        ? ERRORS.CITY_NOT_FOUND
        : msg
    );
  }, []);

  // ── search by city name ───────────────────────────────────────────────────
  const searchCity = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const data = await fetchWeatherByCity(city);
      handleSuccess(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleSuccess, handleError]);

  // ── search by browser geolocation ────────────────────────────────────────
  const searchByGeo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWeatherByGeolocation();
      handleSuccess(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleSuccess, handleError]);

  return {
    weather,
    forecast,
    loading,
    error,
    recentCities,
    searchCity,
    searchByGeo,
  };
};

export default useWeather;
