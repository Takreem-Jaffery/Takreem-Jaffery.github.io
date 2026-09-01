import { defineConfig } from 'vite';
import { resolve } from 'path'
// base: './' makes the build use relative asset paths, so it works whether
// you deploy to a GitHub Pages *project* site (username.github.io/repo-name)
// or a *user/org* site (username.github.io) without editing this file.
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html')
      }
    }
  },
});
