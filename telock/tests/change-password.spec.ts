import { test, expect } from '@playwright/test';

test.describe('Jelszó módosítás', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="short_name"]', 'AdPg');
        await page.fill('input[name="password"]', 'admin');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');

    });

    test('Oldalbetöltés', async ({ page }) => {

        await page.goto('/change-password');
        await expect(page.getByRole('button', { name: 'Jelszó módosítása' })).toBeVisible();

        const oldPassword = page.locator('input[name="old_password"]');
        await expect(oldPassword).toBeVisible();
        await expect(oldPassword).toHaveAttribute('type', 'password');

        const newPassword = page.locator('input[name="new_password"]');
        await expect(newPassword).toBeVisible();
        await expect(newPassword).toHaveAttribute('type', 'password');
    });


    test('Sikeres jelszóváltoztatás', async ({ page }) => {

        await page.goto('/change-password');

        await page.fill('input[name="old_password"]', "admin");
        await page.fill('input[name="new_password"]', "admin");
        await page.click('button[type="submit"]');
    
        const successAlert = page.locator('div[role="alert"]:has-text("Sikeres jelszóváltoztatás")');
        await expect(successAlert).toBeVisible();
    });

    test('Sikeretlen jelszóváltoztatás', async ({ page }) => {
       
        await page.goto('/change-password');

        await page.fill('input[name="old_password"]', "rossz_jelszo");
        await page.fill('input[name="new_password"]', "admin123");
        await page.click('button[type="submit"]');
    
        const errorAlert = page.locator('div[role="alert"]:has-text("Sikeretlen jelszóváltoztatás")');
        await expect(errorAlert).toBeVisible();

    });
});
