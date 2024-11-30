import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003, // Replace with your desired port number
  },
  resolve: {
    alias: {
      Components: "/src/Components",
    },
  },
});
