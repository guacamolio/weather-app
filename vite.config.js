   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import { VitePWA } from "vite-plugin-pwa";

   export default defineConfig({
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
   });