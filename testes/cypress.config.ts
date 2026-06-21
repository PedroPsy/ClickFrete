import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3333',
    specPattern: 'testes/e2e/**/*.cy.ts',
    supportFile: 'testes/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
  },
});
