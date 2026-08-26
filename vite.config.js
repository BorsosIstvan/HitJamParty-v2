import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/BorsosIstvan/HitJamParty-v2', // HIDEG: Ide írd be az új repód pontos nevét két perjel közé!
})

