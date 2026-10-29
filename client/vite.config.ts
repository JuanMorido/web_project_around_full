import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/web_project_around_full/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      'next/dynamic': path.resolve(root, 'src/shims/next-dynamic.tsx'),
    },
  },
  server: {
    port: 3000,
  },
})
