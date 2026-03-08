import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', gzipSize: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: { usePolling: true },
    hmr: { host: 'localhost', port: 5173, protocol: 'ws' },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
