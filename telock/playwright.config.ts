import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://telock.vercel.app', //
    browserName: 'chromium', 
    headless: true, 
  },
  testDir: './tests',
  reporter: [['list'], ['json', { outputFile: 'report.json' }], ['html']],
});
