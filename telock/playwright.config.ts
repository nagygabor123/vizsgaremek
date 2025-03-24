import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://vizsgaremek-mocha.vercel.app', // Vercel URL
    browserName: 'chromium', // vagy 'firefox', 'webkit'
    headless: true, // Beállíthatod `false`-ra, ha látni akarod a tesztet
  },
  testDir: './tests',
  reporter: [['html', { outputFolder: 'playwright-report' }]], // HTML jelentés
});
