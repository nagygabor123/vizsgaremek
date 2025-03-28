import { test, expect } from '@playwright/test';



test.describe('Jelszó módosítás', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="short_name"]', 'AdAd');
        await page.fill('input[name="password"]', 'admin');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
    
        await page.goto('/dashboard/school/students');
        await page.waitForSelector('table');
      });



  test('Sikeres jelszóváltoztatás', async ({ page }) => {
    // Lépj be a megfelelő oldalra
    await page.goto('/change-password');

    // Adja meg a régi és új jelszót
    const oldPasswordInput = page.locator('input[name="old_password"]');
    const newPasswordInput = page.locator('input[name="new_password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await oldPasswordInput.fill('currentPassword123');
    await newPasswordInput.fill('newPassword123');
    
    // Kattints a jelszó módosítása gombra
    await submitButton.click();

    // Ellenőrizd, hogy a sikeres üzenet megjelenik
    const successAlert = page.locator('text=Sikeres jelszóváltoztatás');
    await expect(successAlert).toBeVisible();
  });

  test('Hibás jelszóval történő próbálkozás', async ({ page }) => {
    // Lépj be a megfelelő oldalra
    await page.goto('/change-password');

    // Adjon meg egy hibás régi jelszót
    const oldPasswordInput = page.locator('input[name="old_password"]');
    const newPasswordInput = page.locator('input[name="new_password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await oldPasswordInput.fill('wrongPassword');
    await newPasswordInput.fill('newPassword123');
    
    // Kattints a jelszó módosítása gombra
    await submitButton.click();

    // Ellenőrizd, hogy a hibaüzenet megjelenik
    const errorAlert = page.locator('text=Sikeretlen jelszóváltoztatás');
    await expect(errorAlert).toBeVisible();
  });
});
