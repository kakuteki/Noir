const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3456',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx serve . -l 3456 -s',
    port: 3456,
    reuseExistingServer: true,
  },
});
