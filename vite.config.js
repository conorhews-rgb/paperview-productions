import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base: the same build works at a GitHub Pages project subpath
  // (https://<user>.github.io/paperview-productions/) and at the custom
  // domain root (https://paperviewproductions.com/) with no rebuild.
  base: './',
  plugins: [react()],
})
