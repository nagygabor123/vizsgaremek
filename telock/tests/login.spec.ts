import { test, expect } from '@playwright/test';

test.describe("Bejelentkezés", () => {

  test('Oldal betöltése és alapvető elemek megjelenítése', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Bejelentkezés' })).toBeVisible();

    const shortNameInput = page.locator('input[name="short_name"]');
    await expect(shortNameInput).toBeVisible();
    await expect(shortNameInput).toHaveAttribute('type', 'text');

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test("Sikeres bejelentkezés", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="short_name"]', "AdPg");
    await page.fill('input[name="password"]', "AdPg123");
    await page.click('button[type="submit"]');

    const successAlert = page.locator('div[role="alert"]:has-text("Sikeres bejelentkezés")');
    await expect(successAlert).toBeVisible();
  });

  test("Sikeretlen bejelentkezés", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="short_name"]', "admin");
    await page.fill('input[name="password"]', "rossz_jelszo");
    await page.click('button[type="submit"]');

    const errorAlert = page.locator('div[role="alert"]:has-text("Sikeretlen bejelentkezés")');
    await expect(errorAlert).toBeVisible();
  });
});
