import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // In client/vite.config.js - The NEW code
  server: {
    // This setting allows ngrok to connect to your Vite dev server
    allowedHosts: [".ngrok-free.app"],
  },
});
