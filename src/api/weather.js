const KEY = import.meta.env.VITE_WEATHER_KEY;
const BASE = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeather(city, signal) {
  const url = `${BASE}?q=${encodeURIComponent(city)}&units=metric&lang=lv&appid=${KEY}`;
  const res = await fetch(url, { signal });

  if (res.status === 404) throw new Error("Pilsēta nav atrasta. Pārbaudi nosaukumu.");
  if (res.status === 401) throw new Error("API atslēga nav derīga vai vēl nav aktivizēta.");
  if (!res.ok) throw new Error("Neizdevās ielādēt laikapstākļus. Mēģini vēlreiz.");

  return res.json();
}