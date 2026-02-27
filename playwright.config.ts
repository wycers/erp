import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	use: {
		baseURL: 'http://127.0.0.1:4173'
	},
	webServer: {
		command:
			'DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/erp ORIGIN=http://127.0.0.1:4173 BETTER_AUTH_SECRET=playwright-test-secret npm run build && DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/erp ORIGIN=http://127.0.0.1:4173 BETTER_AUTH_SECRET=playwright-test-secret npm run preview -- --host 127.0.0.1 --port 4173',
		port: 4173,
		timeout: 120000
	}
});
