import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"


export default defineConfig({
  plugins: [react(), tailwindcss()],
   build: {
    rollupOptions: {
      input: {
        popup: "index.html",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
