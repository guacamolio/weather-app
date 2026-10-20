import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Laikapstākļi",
          short_name: "Laikapstākļi",
          display: "standalone",
          theme_color: "#1b66c9",
          background_color: "#1b66c9",
          icons: [
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          ],
        },
      }),
    ],

    server: {
      proxy: {
        "/api/weather": {
          target: "https://api.openweathermap.org",
          changeOrigin: true,
          rewrite: (path) => {
            const city = new URL(path, "http://x").searchParams.get("city") ?? "";
            return `/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=la&appid=${env.WEATHER_KEY}`;
          },
        },
      },
    },
  };
});