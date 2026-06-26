import { useState, useCallback } from "react";
import {
  fetchWeatherByCity,
  fetchWeatherByGeolocation,
} from "../services/weatherService";
import { saveRecentCity, loadRecentCities } from "../utils/utils";
import { ERRORS } from "../constants/constants";


const useWeather = () => {
  const [weather,      setWeather]      = useState(null);
  const [forecast,     setForecast]     = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [recentCities, setRecentCities] = useState(loadRecentCities);

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
