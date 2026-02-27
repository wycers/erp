import { expect, test } from '@playwright/test';

test.describe('ERP anonymous access', () => {
	test('redirects /erp to login page', async ({ page }) => {
		await page.goto('/erp');
		await expect(page).toHaveURL(/\/demo\/better-auth\/login$/);
		await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
	});

	test('redirects protected ERP subpages to login page', async ({ page }) => {
		await page.goto('/erp/materials');
		await expect(page).toHaveURL(/\/demo\/better-auth\/login$/);

		await page.goto('/erp/inventory');
		await expect(page).toHaveURL(/\/demo\/better-auth\/login$/);
	});
});
