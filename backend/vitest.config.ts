import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Disable CSS/PostCSS processing — backend has no styles, and without this
  // Vite walks up the tree and tries to load the frontend's postcss.config.js
  // (which depends on tailwindcss, not installed in backend).
  css: { postcss: { plugins: [] } },
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    css: false,
    pool: 'forks',
  },
});
