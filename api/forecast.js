export default async function handler(req, res) {
  const city = String(req.query.city || "").trim();
  if (!city || city.length > 100) {
    return res.status(400).json({ message: "Missing or invalid city" });
  }

  const key = (process.env.WEATHER_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!key) {
    return res.status(500).json({ message: "Server is missing the API key" });
  }

  const url =
    `https://api.openweathermap.org/data/2.5/forecast` +
    `?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ message: data.message || "API error" });
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ message: "Could not reach weather service" });
  }
}