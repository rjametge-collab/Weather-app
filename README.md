# 🌤️ SKYPULSE — Weather Forecasting App

A dynamic, visually striking weather app built with **React** and the **OpenWeatherMap API**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 City Search | Search any city worldwide with autocomplete from recent history |
| 📍 Geolocation | Detect your current location automatically |
| 🌡️ Current Weather | Temp, feels-like, humidity, wind, pressure, visibility |
| 📅 5-Day Forecast | Daily high/low, conditions, precipitation probability |
| ⏱️ Hourly Forecast | 3-hour intervals for any selected day |
| 🌅 Sun Times | Sunrise and sunset for the current location |
| °C / °F Toggle | Switch units instantly, all values update |
| 🕑 Recent Cities | Last 5 searched cities saved in localStorage |
| 📱 Responsive | Fully adapted for mobile and desktop |
| ⚠️ Error Handling | Clear messages for invalid city, network errors, denied location |

---

## 🚀 Setup & Installation

### 1. Clone or scaffold

```bash
npx create-react-app skypulse
cd skypulse
```

### 2. Copy the component

Replace `src/App.js` content (or create `src/WeatherApp.jsx`) with the provided component file.

Update `src/index.js` to import your component:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import WeatherApp from './WeatherApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WeatherApp />);
```

### 3. Get your API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to **API Keys** in your dashboard
4. Copy your key

### 4. Add the API Key

At the top of `WeatherApp.jsx`, replace the placeholder:

```js
const API_KEY = "REPLACE_WITH_YOUR_OPENWEATHERMAP_API_KEY";
```

with your actual key.

> **Security note:** For production apps, move your API key to an environment variable:
> ```js
> const API_KEY = process.env.REACT_APP_OWM_KEY;
> ```
> Then create a `.env` file:
> ```
> REACT_APP_OWM_KEY=your_actual_key_here
> ```

### 5. Install & Run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `react-scripts` (CRA) | Build tooling |
| Google Fonts (CDN) | `Outfit` + `Space Mono` typography |
| OpenWeatherMap API | Weather data (free tier) |

No additional npm packages are required — the app uses only React hooks and native browser APIs.

---

## 🗂️ Code Organisation

```
src/
├── WeatherApp.jsx        # Single-file component (all-in-one)
│   ├── CONFIG            # API key and base URL
│   ├── HELPERS           # Unit conversion, formatting utilities
│   ├── WX map            # Icon code → emoji + label
│   ├── css (string)      # All styles (injected via <style>)
│   ├── RECENT CITIES     # localStorage helpers
│   └── WeatherApp()      # Main React component
│       ├── State         # query, weather, forecast, loading, error, unit, selDay, recents
│       ├── fetchWeather  # Parallel fetch: /weather + /forecast
│       ├── handleGeo     # Geolocation → coordinates fetch
│       ├── dailyForecast # Derived: group 3h slots into 5 days
│       ├── hourlyForecast# Derived: filter slots for selected day
│       └── JSX           # Header, Search, Error, Loader, Current, Forecast, Hourly
```

---

## 🔌 API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `GET /weather?q={city}` | Current weather by city name |
| `GET /weather?lat={lat}&lon={lon}` | Current weather by coordinates |
| `GET /forecast?q={city}` | 5-day / 3-hour forecast by city |
| `GET /forecast?lat={lat}&lon={lon}` | 5-day / 3-hour forecast by coordinates |

All requests use `units=metric` (Celsius); Fahrenheit conversion is handled client-side.

---

## 🎨 Design Notes

- **Aesthetic:** Dark atmospheric navy with electric cyan accents — inspired by late-night sky and weather radar UIs
- **Typography:** `Space Mono` for numerical data (creates visual rhythm), `Outfit` for UI text (modern readability)
- **Animations:** CSS-only `fadeIn` / `slideUp` keyframes for smooth state transitions
- **Background:** Layered CSS radial-gradients simulating aurora mesh + star field
- **Glass cards:** `backdrop-filter: blur` + semi-transparent surfaces

---

## 📝 Notes

- The free OpenWeatherMap tier allows **60 calls/minute** — more than sufficient for this app
- `localStorage` stores up to 5 recent cities (no backend required)
- All data is fetched fresh on every search; no caching layer is implemented
