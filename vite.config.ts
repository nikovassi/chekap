import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// BASE_PATH lets the same build run on GitHub Pages (/chekap/) or a custom domain (/).
const base = process.env.BASE_PATH ?? '/chekap/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
  },
})
