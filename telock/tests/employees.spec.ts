import { test, expect } from '@playwright/test';

test('Új alkalmazott hozzáadása pozíció választással', async ({ page }) => {
  // 1. Navigálás az alkalmazottak oldalra
  await page.goto('/dashboard/school/employees');
  
  // 2. Dialógus megnyitása
  await page.getByRole('button', { name: 'Új alkalmazott hozzáadás' }).click();
  
  // 3. Várunk a dialógus megjelenésére
  const dialog = page.getByRole('dialog', { name: 'Alkalmazott hozzáadása' });
  await expect(dialog).toBeVisible();

  // 4. Űrlap kitöltése
  const fullName = 'Teszt Alkalmazott';
  const shortName = 'TesztAl';
  
  await page.getByLabel('Teljes név').fill(fullName);
  await page.getByLabel('Rövidített név (felhasználónév)').fill(shortName);
  
  // 5. POZÍCIÓ KIVÁLASZTÁSA - JAVÍTOTT VERZIÓ
  // A data-testid most a SelectTrigger-en van
  const positionTrigger = page.locator('[data-testid="position-select"]');
  await expect(positionTrigger).toBeVisible();
  await positionTrigger.click();
  
  // Várunk az opciók megjelenésére
  await expect(page.locator('.select-content')).toBeVisible();
  
  // Válasszuk ki a "Tanár" pozíciót
  await page.getByRole('option', { name: 'Tanár' }).click();
  
  // Ellenőrizzük a kiválasztott értéket
  await expect(positionTrigger).toContainText('Tanár');
  
  // 6. Mentés
  await page.getByRole('button', { name: 'Mentés' }).click();
  
  // 7. Dialógus bezárulásának ellenőrzése
  await expect(dialog).not.toBeVisible();
});