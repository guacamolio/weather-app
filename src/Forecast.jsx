import { useEffect, useState } from "react";

const dateOf = (timestamp, timezone) =>
  new Date((timestamp + timezone) * 1000).toISOString().slice(0, 10);

export default function Forecast({ city }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    setError("");
    fetch(`/api/forecast?city=${encodeURIComponent(city)}`)
      .then((response) => response.json())
      .then((forecast) =>
        forecast.list ? setData(forecast) : setError(forecast.message)
      )
      .catch(() => setError("Neizdevās ielādēt prognozi"));
  }, [city]);

  if (error) return <p className="status error">{error}</p>;
  if (!data) return <p className="status">Ielādē prognozi…</p>;

  const timezone = data.city.timezone;
  const today = dateOf(Date.now() / 1000, timezone);

  const days = {};
  for (const entry of data.list) {
    const date = dateOf(entry.dt, timezone);
    if (date === today) continue;
    if (!days[date] || entry.main.temp > days[date].main.temp) {
      days[date] = entry;
    }
  }

  return (
    <ul className="forecast">
      {Object.entries(days).map(([date, highest]) => (
        <li key={date}>
          <span className="fday">
            {new Date(date).toLocaleDateString("lv-LV", {
              weekday: "long",
              timeZone: "UTC",
            })}
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${highest.weather[0].icon}.png`}
            alt={highest.weather[0].description}
            width="44"
            height="44"
          />
          <span className="ftemp">{Math.round(highest.main.temp)}°</span>
        </li>
      ))}
    </ul>
  );
}