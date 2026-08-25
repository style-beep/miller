// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  outDir: '../dist-web',
  build: {
    format: 'file',
  },
  vite: {
    server: {
      proxy: {
        '/api': 'https://miller.jenkneo.com',
      },
    },
  },
});
