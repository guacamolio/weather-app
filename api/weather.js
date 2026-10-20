export default async function handler(req, res) {
  const city = String(req.query.city || "").trim();

  if (!city || city.length > 100) {
    return res.status(400).json({ message: "Missing or invalid city" });
  }

  const key = (process.env.WEATHER_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!key) {
    return res.status(500).json({ message: "Server API key is not configured" });
  }

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?q=${encodeURIComponent(city)}&units=metric&lang=la&appid=${key}`;

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ message: "Could not reach the weather service" });
  }
}