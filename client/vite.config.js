import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Rollup's @rollup/plugin-commonjs converts require('@babel/runtime/helpers/X')
// to an ESM bare-specifier import but does not bundle it, causing a runtime
// "Failed to resolve module specifier" error in the browser. This plugin
// intercepts those imports and resolves them to actual file paths so Rollup
// bundles them into the output.
const resolveBabelRuntime = {
  name: 'resolve-babel-runtime',
  resolveId(id) {
    if (id.startsWith('@babel/runtime/')) {
      try {
        return { id: require.resolve(id), external: false };
      } catch {
        // helper not found — let Rollup handle it normally
      }
    }
  },
};

export default defineConfig({
  plugins: [react(), resolveBabelRuntime],
  envDir: '../',
  envPrefix: 'VITE_',
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    include: [
      'react-swipeable-views-react-18-fix',
      'react-swipeable-views-utils-react-18-fix',
      'react-responsive-carousel',
    ],
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
