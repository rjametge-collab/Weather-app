import { useState } from "react";
import useWeather from "./services/useWeather";
import {
  formatTemp,
  msToKmh,
  degreesToCompass,
  metresToKm,
  toTimeString,
  toDayName,
  todayString,
  groupForecastByDay,
  getHourlyForDay,
  resolveWeatherIcon,
} from "./utils/utils";
import styles from "./styles/app.css";   


export default function WeatherApp() {
  const {
    weather,
    forecast,
    loading,
    error,
    recentCities,
    searchCity,
    searchByGeo,
  } = useWeather();

  const [query,   setQuery]   = useState("");
  const [unit,    setUnit]    = useState("C");   // "C" | "F"
  const [selDay,  setSelDay]  = useState(0);
  const [showSug, setShowSug] = useState(false);

 
  const T = (c) => formatTemp(c, unit);

  const handleSubmit = (e) => {
    e?.preventDefault();
    searchCity(query);
    setShowSug(false);
    setSelDay(0);
  };

  const handleSuggestionClick = (city) => {
    setQuery(city);
    searchCity(city);
    setShowSug(false);
    setSelDay(0);
  };

  const handleGeoClick = () => {
    searchByGeo();
    setSelDay(0);
  };

  const dailyForecast  = forecast ? groupForecastByDay(forecast.list) : [];
  const hourlyForecast = forecast && dailyForecast.length
    ? getHourlyForDay(forecast.list, dailyForecast[selDay].dt)
    : [];

  const filteredSuggestions = recentCities.filter(
    (r) => !query || r.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-stars" />

      <div className="app">

        {/* ── Header ── */}
        <header className="header">
          <div className="logo">SKYPULSE <span>/ weather</span></div>
          <div className="unit-pill">
            <button
              className={`unit-btn${unit === "C" ? " active" : ""}`}
              onClick={() => setUnit("C")}
            >°C</button>
            <button
              className={`unit-btn${unit === "F" ? " active" : ""}`}
              onClick={() => setUnit("F")}
            >°F</button>
          </div>
        </header>

        {/* ── Search ── */}
        <div className="search-wrap">
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            <div className="search-row">
              <input
                className="search-input"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSug(true); }}
                onFocus={() => setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 150)}
                placeholder="Search city or location…"
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary">Search</button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleGeoClick}
                title="Use my location"
              >📍</button>
            </div>
          </form>

          {showSug && filteredSuggestions.length > 0 && (
            <div className="suggestions">
              {filteredSuggestions.map((r) => (
                <div
                  key={r}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(r)}
                >
                  🕑 {r}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="error-card">⚠️ <span>{error}</span></div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="loader">
            <div className="spinner" />
            <span>Fetching weather data…</span>
          </div>
        )}

        {/* ── Weather content ── */}
        {!loading && weather && (
          <>
            {/* Current weather */}
            <div className="current-card">
              <div className="city-row">
                <div className="city-name">{weather.name}</div>
                <span className="country-badge">{weather.sys.country}</span>
              </div>
              <div className="date-str">{todayString()}</div>

              <div className="temp-row">
                <div className="temp-main">{T(weather.main.temp)}</div>
                <div className="temp-side">
                  <span className="wx-icon">
                    {resolveWeatherIcon(weather.weather[0].icon)[0]}
                  </span>
                  <span className="wx-desc">
                    {weather.weather[0].description}
                  </span>
                </div>
              </div>

              <div className="feels-like">
                Feels like <span>{T(weather.main.feels_like)}</span>
                &nbsp;·&nbsp;
                H:{T(weather.main.temp_max)} / L:{T(weather.main.temp_min)}
              </div>

              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">Humidity</div>
                  <div className="stat-value">{weather.main.humidity}%</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Wind</div>
                  <div className="stat-value">{msToKmh(weather.wind.speed)} km/h</div>
                  <div className="stat-sub">{degreesToCompass(weather.wind.deg)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Pressure</div>
                  <div className="stat-value">{weather.main.pressure}</div>
                  <div className="stat-sub">hPa</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Visibility</div>
                  <div className="stat-value">{metresToKm(weather.visibility)} km</div>
                </div>
              </div>
            </div>

            {/* Sunrise / Sunset */}
            <div className="sun-row">
              <div className="sun-card">
                <span className="sun-emoji">🌅</span>
                <div>
                  <div className="sun-label">Sunrise</div>
                  <div className="sun-time">{toTimeString(weather.sys.sunrise)}</div>
                </div>
              </div>
              <div className="sun-card">
                <span className="sun-emoji">🌇</span>
                <div>
                  <div className="sun-label">Sunset</div>
                  <div className="sun-time">{toTimeString(weather.sys.sunset)}</div>
                </div>
              </div>
            </div>

            {/* 5-day forecast */}
            {dailyForecast.length > 0 && (
              <>
                <div className="section-title">5-Day Forecast</div>
                <div className="forecast-grid">
                  {dailyForecast.map((day, i) => (
                    <div
                      key={day.dt}
                      className={`forecast-card${selDay === i ? " selected" : ""}`}
                      onClick={() => setSelDay(i)}
                    >
                      <div className="fc-day">{i === 0 ? "Today" : toDayName(day.dt)}</div>
                      <span className="fc-icon">{resolveWeatherIcon(day.icon)[0]}</span>
                      <span className="fc-high">{T(day.high)}</span>
                      <span className="fc-low">{T(day.low)}</span>
                      {day.pop > 0.05 && (
                        <div className="fc-label">💧{Math.round(day.pop * 100)}%</div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Hourly forecast */}
            {hourlyForecast.length > 0 && (
              <>
                <div className="section-title">
                  Hourly — {selDay === 0 ? "Today" : toDayName(dailyForecast[selDay].dt)}
                </div>
                <div className="hourly-scroll">
                  {hourlyForecast.map((h) => (
                    <div key={h.dt} className="hourly-card">
                      <div className="hc-time">{toTimeString(h.dt)}</div>
                      <span className="hc-icon">{resolveWeatherIcon(h.weather[0].icon)[0]}</span>
                      <span className="hc-temp">{T(h.main.temp)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !weather && !error && (
          <div className="empty-state">
            <span className="big">🌤️</span>
            <h2>Check the weather anywhere</h2>
            <p>Type a city name in the search bar or tap 📍 to use your current location.</p>
          </div>
        )}

      </div>
    </>
  );
}
