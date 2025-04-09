import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/index.html"),
        background: path.resolve(__dirname, "src/background.ts"),
        content: path.resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    emptyOutDir: true,
    target: "esnext",
    minify: false,
  },
});
