import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  reporter: [['list'], ['json', { outputFile: 'artifacts/browser-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    reducedMotion: 'reduce',
    launchOptions: { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
  },
  webServer: {
    command: 'npm.cmd run preview -- --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
