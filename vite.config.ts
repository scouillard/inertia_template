import inertia from '@inertiajs/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    inertia(),
    react(),
    tailwindcss(),
    RubyPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app/frontend'),
    },
  },
})
