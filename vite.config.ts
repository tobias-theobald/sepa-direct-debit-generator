import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateCspPlugin } from "vite-plugin-node-csp";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), generateCspPlugin()],
  base: './',
})