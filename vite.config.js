import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Honor a PORT assigned by the environment (e.g. the preview harness);
    // fall back to Vite's default otherwise.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    base: '/customs-editor/'
  },
})
