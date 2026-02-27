import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1, name: 'ERP Demo' })).toBeVisible();
	await expect(page.getByRole('link', { name: '进入 ERP 工作台' })).toBeVisible();
});
