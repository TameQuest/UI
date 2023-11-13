import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    tsconfigPaths(),
    nodePolyfills({
      globals: {
        Buffer: true
      }
    })
  ],
  root: './',
  build: {
    outDir: 'dist'
  },
  publicDir: 'src/public'
})
