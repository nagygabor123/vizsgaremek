import { test, expect } from '@playwright/test';

test.describe('Alkalmazott hozzáadása dialógus', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="short_name"]', 'AdAd');
        await page.fill('input[name="password"]', 'admin');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');

    });

  test('Dialógus megnyitása és alapvető ellenőrzések', async ({ page }) => {
    
    
    await page.goto('dashboard/school/employees');
    
    // 2. Lépés: Új alkalmazott gomb megkeresése és kattintás
    const newEmployeeButton = page.getByRole('button', { name: 'Új alkalmazott hozzáadás' });
    await expect(newEmployeeButton).toBeVisible();
    await newEmployeeButton.click();

    // 3. Lépés: Dialógus megjelenésének ellenőrzése
    const dialog = page.getByRole('dialog', { name: 'Alkalmazott hozzáadása' });
    await expect(dialog).toBeVisible();

    // 4. Lépés: Mezők ellenőrzése
    await expect(page.getByLabel('Teljes név')).toBeVisible();
    await expect(page.getByLabel('Rövidített név (felhasználónév)')).toBeVisible();
    await expect(page.getByLabel('Ideiglenes jelszó')).toBeVisible();
    await expect(page.getByLabel('Pozíció')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mentés' })).toBeVisible();
  });

  test('Alkalmazott hozzáadása - pozíció választó működése', async ({ page }) => {
    // 1. Lépés: Dialógus megnyitása
    await page.getByRole('button', { name: 'Új alkalmazott hozzáadás' }).click();

    // 2. Lépés: Kitöltjük a kötelező mezőket
    await page.getByLabel('Teljes név').fill('Teszt Elek');
    await page.getByLabel('Rövidített név (felhasználónév)').fill('TeEl');

    // 3. Lépés: Pozíció választó kinyitása
    const positionSelect = page.getByLabel('Pozíció');
    await positionSelect.click();

    // 4. Lépés: Ellenőrizzük, hogy vannak-e lehetőségek
    const positionOptions = page.locator('.select-content .select-item');
    await expect(positionOptions).not.toHaveCount(0);

    // 5. Lépés: Válasszunk egy pozíciót (az elsőt)
    const firstOption = positionOptions.first();
    const selectedPosition = await firstOption.textContent();
    await firstOption.click();

    // 6. Lépés: Ellenőrizzük, hogy a kiválasztott érték megjelenik
    await expect(positionSelect).toContainText(selectedPosition!);

    // 7. Lépés: Mentés gomb megnyomása
    await page.getByRole('button', { name: 'Mentés' }).click();

    // 8. Lépés: Ellenőrizzük, hogy a dialógus bezárult
    await expect(page.getByRole('dialog', { name: 'Alkalmazott hozzáadása' })).not.toBeVisible();
  });

  test('Rövid név alapján automatikus jelszó generálás', async ({ page }) => {
    // 1. Lépés: Dialógus megnyitása
    await page.getByRole('button', { name: 'Új alkalmazott hozzáadás' }).click();

    // 2. Lépés: Rövid név megadása
    const shortName = 'TeEl';
    await page.getByLabel('Rövidített név (felhasználónév)').fill(shortName);

    // 3. Lépés: Jelszó mező placeholder ellenőrzése
    const passwordField = page.getByLabel('Ideiglenes jelszó');
    await expect(passwordField).toHaveAttribute('placeholder', `${shortName}123`);
  });

  test('Kötelező mezők validációja', async ({ page }) => {
    // 1. Lépés: Dialógus megnyitása
    await page.getByRole('button', { name: 'Új alkalmazott hozzáadás' }).click();

    // 2. Lépés: Mentés gomb megnyomása üres formmal
    await page.getByRole('button', { name: 'Mentés' }).click();

    // 3. Lépés: Hibák megjelenésének ellenőrzése
    // (Itt feltételezem, hogy a form hibákat jelenít meg, ha nincs kitöltve)
    await expect(page.getByText('A teljes név megadása kötelező')).toBeVisible();
    await expect(page.getByText('A rövid név megadása kötelező')).toBeVisible();
    await expect(page.getByText('A pozíció kiválasztása kötelező')).toBeVisible();
  });
});