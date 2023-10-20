import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    externalizeDeps({
      devDeps: true,
    }),
    dts({
      include: 'src/Gauge.tsx',
      rollupTypes: true,
    }),
  ],
  build: {
    outDir: 'lib',
    lib: {
      entry: 'src/Gauge.tsx',
      formats: ['es'],
      fileName: 'main',
    },
  },
})
