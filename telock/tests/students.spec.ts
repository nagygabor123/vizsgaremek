

import { test, expect } from '@playwright/test';

test.describe('Iskolai nyilvántartás - Tanulók', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdAd');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/school/students');
    await page.waitForSelector('table');
  });

  test('Oldal megfelelően betöltődik', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Új tanuló hozzáadás' })).toBeVisible();
    await expect(page.getByPlaceholder('Keresés név szerint...')).toBeVisible();
    await expect(page.getByPlaceholder('Keresés osztály szerint...')).toBeVisible();
  });

  test('Új tanuló hozzáadása', async ({ page }) => {

    await page.getByRole('button', { name: 'Új tanuló hozzáadás' }).click();
    await page.locator('input[name="student_id"]').fill('OM1234567');
    await page.locator('input[name="full_name"]').fill('Teszt Elek');
    await page.locator('input[name="class"]').fill('9.I');
    await page.locator('input[name="rfid_tag"]').fill('R6HF6K86');
    await page.getByRole('button', { name: 'Mentés' }).click();

    await page.getByPlaceholder('Keresés név szerint...').fill("Teszt Elek");
    
    await page.waitForResponse(response => 
      response.url().includes('/api/students') && 
      response.status() === 200
    );

    await page.waitForLoadState('networkidle');
  
    await page.getByPlaceholder('Keresés név szerint...').fill("Teszt Elek");
    await page.waitForTimeout(1000); 
  
    const studentRow = page.locator('tbody tr').filter({ hasText: "Teszt Elek"});
    
    
    await expect(studentRow).toBeVisible({ timeout: 15000 }); 
    
    
    
    //const studentRow = await page.locator('tr', { hasText: 'Teszt Elek' });

  // Ellenőrizd, hogy a sor látható-e
  await expect(studentRow).toBeVisible();

  // A gomb keresése a data-testid alapján
  const editButton = studentRow.locator('[data-testid="edit-button"]');
  await editButton.click();

  // Várj, amíg megjelenik a dialógus
  const dialogContent = page.locator('dialog[open]');
  await expect(dialogContent).toBeVisible();

  // Töltsük ki a form mezőket
  await page.fill('input[name="full_name"]', 'John Doe');
  await page.fill('input[name="class"]', '10A');
  await page.fill('input[name="rfid_tag"]', '123456789');

  // Küldjük el a formot
  await page.locator('button[type="submit"]').click();
  });
  
/*

  test('Tanuló szerkesztése', async ({ page }) => {
    // Keress egy meglévő tanulót
    await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Elek');
    
    // Nyisd meg a szerkesztési dialógust
    await page.locator('tr', { hasText: 'Teszt Elek' }).getByRole('button', { name: 'Szerkesztés' }).click();
    
    // Módosítsd az adatokat
    await page.getByLabel('Teljes név').fill('Teszt Elek Módosított');
    await page.getByLabel('Osztály és csoportok').fill('10.I');
    
    // Mentsd a változtatásokat
    await page.getByRole('button', { name: 'Mentés' }).click();
    
    // Ellenőrizd a módosításokat
    await expect(page.getByText('Teszt Elek Módosított')).toBeVisible();
    await expect(page.getByText('10.I')).toBeVisible();
  });*/

  test('Tanuló törlése', async ({ page }) => {
    // Keress egy meglévő tanulót
    await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Elek Módosított');
    
    // Kattints a törlés gombra
    await page.locator('tr', { hasText: 'Teszt Elek Módosított' }).getByRole('button', { name: 'Törlés' }).click();
    
    // Erősítsd meg a törlést
    await page.getByRole('button', { name: 'Véglegesítés' }).click();
    
    // Ellenőrizd, hogy a tanuló eltűnt a listából
    await expect(page.getByText('Teszt Elek Módosított')).not.toBeVisible();
  });

  test('Rendezés működése', async ({ page }) => {
    // Név szerinti rendezés ellenőrzése
    await page.getByRole('columnheader', { name: 'Teljes név' }).click();
    // Itt lehetne ellenőrizni a tényleges rendezést, ha ismerjük a várt sorrendet
    
    // Osztály szerinti rendezés ellenőrzése
    await page.getByRole('columnheader', { name: 'Osztály és csoportok' }).click();
  });

  test('Szűrés működése', async ({ page }) => {
    // Szűrés név szerint
    await page.getByPlaceholder('Keresés név szerint...').fill('Teszt');
    await expect(page.getByText('Teszt Elek')).toBeVisible();
    
    // Szűrés osztály szerint
    await page.getByPlaceholder('Keresés osztály szerint...').fill('9.I');
    await expect(page.getByText('9.I')).toBeVisible();
  });

  test('Lapozás működése', async ({ page }) => {
    // Ellenőrizd a lapozó gombok működését
    if (await page.getByRole('button', { name: 'Következő' }).isEnabled()) {
      await page.getByRole('button', { name: 'Következő' }).click();
      await page.getByRole('button', { name: 'Előző' }).click();
    }
  });

  test('Zárolás/feloldás gomb működése', async ({ page }) => {
    // Ellenőrizd a zárolás/feloldás gomb működését
    const lockButton = page.getByRole('button', { name: /Összes (zárolás|feloldás)/ });
    await lockButton.click();
    // Itt lehetne ellenőrizni a státusz változást
  });
});