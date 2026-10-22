import { useEffect, useState } from "react";
import { fetchWeather } from "./api/weather";
import "./App.css";
import Forecast from "./Forecast";

const DEFAULT_CITY = "Riga,LV";

function themeFor(main, icon) {
  if (icon?.endsWith("n") && (main === "Clear" || main === "Clouds")) return "night"; //formātu nosaka OpenWeatherMap API ikonas kods kas beidzas ar "d" (diena) vai "n" (nakts)
  switch (main) {
    case "Clear": return "clear";
    case "Clouds": return "clouds";
    case "Rain":
    case "Drizzle": return "rain";
    case "Snow": return "snow";
    case "Thunderstorm": return "storm";
    default: return "mist"; 
  }
}

function compass(deg) {
  const dirs = ["Z", "ZA", "A", "DA", "D", "DR", "R", "ZR"];
  return dirs[Math.round(deg / 45) % 8];
}

const round = (number) => Math.round(number);

function visibilityText(meters) {
  if (meters == null) return "–";
  if (meters >= 10000) return "10+ km";
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


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

  function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim();
    if (value) setCity(value);
  }

  const condition = data?.weather?.[0];
  const theme = condition ? themeFor(condition.main, condition.icon) : "clouds";

  return (
    <div className="app" data-theme={theme}>
      <main className="shell">
        <form className="search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
                <div>
                  <span className="temp">{round(data.main.temp)}°</span>
                  <p className="hl">
                    <span>H:{round(data.main.temp_max)}</span>
                    <span>L:{round(data.main.temp_min)}</span>
                  </p>
                </div>
                <img
                  className="icon"
                  src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
                  alt={condition.description}
                />
              </div>
              <p className="desc">{condition.description}</p>
            </section>
            <div>
              <Forecast city={city} /> 
            </div>
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
                  <dd>{visibilityText(data.visibility)}</dd>
                </div>
                <div>
                  <dt>Vējš</dt>
                  <dd>
                    {round(data.wind.speed * 3.6)} km/h {compass(data.wind.deg ?? 0)}
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