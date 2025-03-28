import { test, expect } from '@playwright/test';

test.describe("Bejelentkezés", () => {

  test('Oldal betöltés', async ({ page }) => {
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

    await page.fill('input[name="short_name"]', "AdAd"); 
    await page.fill('input[name="password"]', "admin");
    await page.click('button[type="submit"]');

    const successAlert = page.locator('div[role="alert"]:has-text("Sikeres bejelentkezés")');
    await expect(successAlert).toBeVisible();
  });

  test("Sikeretlen bejelentkezés", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="short_name"]', "admin");
    await page.fill('input[name="password"]', "rossz_jelszó");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Hibás felhasználónév vagy jelszó!")).toBeVisible();
  });
});
