import { useEffect, useState } from "react";
import { fetchWeather } from "./api/weather";
import "./App.css";

const DEFAULT_CITY = "Riga,LV";

// Pick a colour theme from the condition + day/night (icon ends with "d" or "n")
function themeFor(main, icon) {
  if (icon?.endsWith("n") && (main === "Clear" || main === "Clouds")) return "night";
  switch (main) {
    case "Clear": return "clear";
    case "Clouds": return "clouds";
    case "Rain":
    case "Drizzle": return "rain";
    case "Snow": return "snow";
    case "Thunderstorm": return "storm";
    default: return "mist"; // Mist, Fog, Haze, Smoke...
  }
}

function compass(deg) {
  const dirs = ["Z", "ZA", "A", "DA", "D", "DR", "R", "ZR"];
  return dirs[Math.round(deg / 45) % 8];
}

const round = (n) => Math.round(n);

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs on first render = every time the page is loaded or refreshed,
  // and again whenever `city` changes (after a search).
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetchWeather(city, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [city]);

  function handleSubmit(e) {
    e.preventDefault();
    const value = query.trim();
    if (value) setCity(value);
  }

  const w = data?.weather?.[0];
  const theme = w ? themeFor(w.main, w.icon) : "clouds";

  return (
    <div className="app" data-theme={theme}>
      <main className="shell">
        <form className="search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Meklēt pilsētu"
            aria-label="Pilsētas nosaukums"
          />
          <button type="submit">Meklēt</button>
        </form>

        {loading && <p className="status">Ielādē laikapstākļus…</p>}
        {error && !loading && <p className="status error">{error}</p>}

        {data && !loading && !error && (
          <>
            <section className="hero">
              <h1 className="city">
                {data.name}, {data.sys.country}
              </h1>
              <div className="now">
                <span className="temp">{round(data.main.temp)}°</span>
                <img
                  className="icon"
                  src={`https://openweathermap.org/img/wn/${w.icon}@4x.png`}
                  alt={w.description}
                />
              </div>
              <p className="desc">{w.description}</p>
            </section>

            <section className="details">
              <dl>
                <div>
                  <dt>Sajūta kā</dt>
                  <dd>{round(data.main.feels_like)}°C</dd>
                </div>
                <div>
                  <dt>Spiediens</dt>
                  <dd>{data.main.pressure} hPa</dd>
                </div>
                <div>
                  <dt>Gaisa mitrums</dt>
                  <dd>{data.main.humidity}%</dd>
                </div>
                <div>
                  <dt>Redzamība</dt>
                  <dd>{(data.visibility / 1000).toFixed(1)} km</dd>
                </div>
                <div>
                  <dt>Vējš</dt>
                  <dd>
                    {data.wind.speed.toFixed(1)} m/s {compass(data.wind.deg ?? 0)}
                  </dd>
                </div>
              </dl>
            </section>
          </>
        )}
      </main>
    </div>
  );
}