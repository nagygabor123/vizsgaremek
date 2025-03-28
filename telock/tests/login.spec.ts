import { test, expect } from '@playwright/test';

test.describe("Bejelentkezés", () => {

  test('Oldal megfelelően betöltődik', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Bejelentkezés' })).toBeVisible();
    await expect(page.getByPlaceholder('Felhasználónév')).toBeVisible();
    await expect(page.getByPlaceholder('Jelszó')).toBeVisible();
  });

  test("Sikeres bejelentkezés", async ({ page }) => {
    await page.goto("/login");

    // Adatok kitöltése
    await page.fill('input[name="short_name"]', "AdAd"); // Használj valós felhasználót
    await page.fill('input[name="password"]', "admin");
    await page.click('button[type="submit"]');

    // Várakozás, hogy a sikeres bejelentkezés üzenet megjelenjen
    const successAlert = page.locator('div[role="alert"]:has-text("Sikeres bejelentkezés")');

    // Ellenőrizd, hogy az üzenet látható
    await expect(successAlert).toBeVisible();
  });

  test("Sikeretlen bejelentkezés", async ({ page }) => {
    await page.goto("/login");

    // Hibás adatokat adunk meg
    await page.fill('input[name="short_name"]', "admin");
    await page.fill('input[name="password"]', "rossz_jelszó");
    await page.click('button[type="submit"]');

    // Ellenőrizd, hogy megjelenik a hibaüzenet
    await expect(page.locator("text=Hibás felhasználónév vagy jelszó!")).toBeVisible();
  });
});
