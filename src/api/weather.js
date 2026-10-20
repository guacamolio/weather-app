export async function fetchWeather(city, signal) {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, { signal });

  if (res.status === 404) throw new Error("Pilsēta nav atrasta. Pārbaudi nosaukumu.");
  if (res.status === 401) throw new Error("API atslēga nav derīga vai vēl nav aktivizēta.");
  if (!res.ok) throw new Error("Neizdevās ielādēt laikapstākļus. Mēģini vēlreiz.");

  return res.json();
}