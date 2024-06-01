import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "creole-studios-lx",
    project: "javascript-react"
  }), sentryVitePlugin({
    org: "creole-studios-lx",
    project: "vapi-ai"
  }), sentryVitePlugin({
    org: "creole-studios-lx",
    project: "vapi-ai"
  })],

  build: {
    sourcemap: true
  }
})