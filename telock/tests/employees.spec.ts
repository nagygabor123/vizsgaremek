

import { test, expect } from '@playwright/test';

test.describe('Iskolai nyilvántartás - Munkatársak', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdAd');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/school/employees');
    await page.waitForSelector('table');
  });

  test('Oldalbetöltés', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Új alkalmazott hozzáadás' })).toBeVisible();
    await expect(page.getByPlaceholder('Keresés név szerint...')).toBeVisible();
    await expect(page.getByPlaceholder('Keresés pozíció szerint...')).toBeVisible();
    await expect(page.locator('#searchOsztalyfonok')).toBeVisible();

  });
  


  test('Új alkalmazott hozzáadás', async ({ page }) => {

    await page.getByRole('button', { name: 'Új alkalmazott hozzáadás' }).click();
    await page.locator('input[name="full_name"]').fill('Teszt Elek');
    await page.locator('input[name="short_name"]').fill('TeEl');

    const selectTrigger = page.locator('button[role="combobox"]'); // Vagy válaszd ki más módon a Select mezőt
    await selectTrigger.click();
  
    // Válaszd ki a portás értéket a listából
    const selectItem = page.locator('li[role="option"]:has-text("Portás")');
    await selectItem.click();
  
    // Ellenőrizd, hogy a helyes érték lett kiválasztva
    const selectedValue = await page.locator('input[name="position"]').inputValue();
    expect(selectedValue).toBe('portas');

    await page.getByRole('button', { name: 'Mentés' }).click();

    await page.getByPlaceholder('Keresés név szerint...').fill("Teszt Elek");

    await page.waitForResponse(response =>
      response.url().includes('/api/config/getEmployees') &&
      response.status() === 200
    );

    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('Keresés név szerint...').fill("Teszt Elek");
    // await page.waitForTimeout(1000); 

    const studentRow = page.locator('tbody tr').filter({ hasText: "Teszt Elek" });
    //await expect(studentRow).toBeVisible({ timeout: 15000 }); 
    await expect(studentRow).toContainText("Portás");
  });
/*
  test('Keresés', async ({ page }) => {
  
    await page.getByPlaceholder('Keresés név szerint...').fill('teszt');
    await expect(page.getByText('Teszt Elek')).toBeVisible();


    await page.getByPlaceholder('Keresés osztály szerint...').fill('9.I');
    await expect(page.getByText('9.I')).toBeVisible();
  });

  test('Tanuló szerkesztés', async ({ page }) => {

    await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Elek');

    const studentRow = await page.locator('tr', { hasText: 'Teszt Elek' });

    await expect(studentRow).toBeVisible();

    const editButton = studentRow.locator('[data-testid="edit-button"]');
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Tanuló szerkesztése');

    const fullNameInput = page.locator('input[name="full_name"]');

    await fullNameInput.fill(`Teszt Elek Módosított`);

    await dialog.locator('button', { hasText: 'Mentés' }).click();

    await expect(dialog).not.toBeVisible();

  });


  test('Tanuló törlés', async ({ page }) => {

    await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Elek Módosított');

    const studentRow = await page.locator('tr', { hasText: 'Teszt Elek Módosított' });

    const editButton = studentRow.locator('[data-testid="delete-button"]');
    await editButton.click();

    const dialogTitle = page.locator('text=Biztosan törölni szeretné a tanulót?');
    await expect(dialogTitle).toBeVisible();

    const confirmButton = page.locator('button:has-text("Véglegesítés")');
    await confirmButton.click();

    //  await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Elek');

    await expect(studentRow).not.toBeVisible();
  });

  test('Rendezés', async ({ page }) => {
    await page.locator('th', { hasText: 'Teljes név' }).click();

    await page.locator('th', { hasText: 'Osztály és csoportok' }).click();

  });

  test('Lapozás', async ({ page }) => {
    if (await page.getByRole('button', { name: 'Következő' }).isEnabled()) {
      await page.getByRole('button', { name: 'Következő' }).click();
      await page.getByRole('button', { name: 'Előző' }).click();
    }
  });

  test('Zárolás/feloldás gomb', async ({ page }) => {
    const lockButton = page.getByRole('button', { name: /Összes (zárolás|feloldás)/ });
    await lockButton.click();
    
  });*/


});