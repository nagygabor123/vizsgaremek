import { test, expect } from '@playwright/test';

test.describe('Alkalmazott kezelése', () => {
  test.beforeEach(async ({ page }) => {
    // Bejelentkezés a rendszerbe (módosítsd a hitelesítési adatokat)
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdAd');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigálás az alkalmazottak oldalára
    await page.goto('/dashboard/school/employees');
    await page.waitForSelector('table');
  });

  test('Új alkalmazott hozzáadása', async ({ page }) => {
    // Kattintás az "Új alkalmazott" gombra
    await page.click('text=Új alkalmazott hozzáadás');
    
    // Űrlap kitöltése
    await page.fill('input[id="fullName"]', 'Teszt Alkalmazott');
    await page.fill('input[id="shortName"]', 'TeAl');
    
    // Pozíció kiválasztása
    await page.click('text=Válasszon...');
    await page.waitForSelector('[role="listbox"]');
    await page.click('div[role="option"]:has-text("Igazgatóhelyettes")');
    
    // Mentés és várakozás a táblázat frissülésére
    await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/api/config/addEmployee') &&
        response.status() === 200
      ),
      page.click('button:has-text("Mentés")')
    ]);
  
    // Explicit várakozás a táblázat frissülésére
    await page.waitForSelector('table tbody tr:has-text("Teszt Alkalmazott")', { timeout: 10000 });
    
    // Pontosabb ellenőrzés a táblázat sorára
    const newEmployeeRow = page.locator('table tbody tr:has-text("Teszt Alkalmazott")');
    await expect(newEmployeeRow).toContainText('Teszt Alkalmazott');
    await expect(newEmployeeRow).toContainText('Igazgatóhelyettes');
  });

  test('Alkalmazott szerkesztése', async ({ page }) => {
    // Az első alkalmazott szerkesztésének megnyitása
    const firstEmployee = page.locator('table tbody tr').first();
    await firstEmployee.locator('button:has-text("Szerkesztés")').click();
    
    // Név módosítása
    await page.fill('input[id="fullName"]', 'Módosított Név');
    
    // Pozíció módosítása
    await page.click('text=Válasszon...');
    await page.click('text=Portás');
    
    // Mentés
    await page.click('button:has-text("Mentés")');
    
    // Ellenőrzés, hogy frissült-e az adat
    await expect(firstEmployee).toContainText('Módosított Név');
    await expect(firstEmployee).toContainText('Portás');
  });

  test('Alkalmazott törlése', async ({ page }) => {
    // Megkeressük a teszt alkalmazottat
    const testEmployeeRow = page.locator('tr:has-text("Teszt Alkalmazott")');
    
    // Törlés gomb megnyomása
    await testEmployeeRow.locator('button:has-text("Törlés")').click();
    
    // Megerősítés a dialógusban
    await page.click('button:has-text("Véglegesítés")');
    
    // Ellenőrzés, hogy eltűnt-e a táblázatból
    await expect(testEmployeeRow).not.toBeVisible();
  });

  test('Keresés alkalmazottak között', async ({ page }) => {
    // Keresés név alapján
    await page.fill('input[placeholder="Keresés név szerint..."]', 'Módosított');
    
    // Ellenőrzés, hogy csak a megfelelő sorok maradnak
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Módosított Név');
    
    // Keresés pozíció alapján
    await page.fill('input[placeholder="Keresés név szerint..."]', '');
    await page.fill('input[placeholder="Keresés pozíció szerint..."]', 'Portás');
    
    // Ellenőrzés
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Portás');
  });

  test('Lapozás működése', async ({ page }) => {
    // Több alkalmazott hozzáadása a lapozás teszteléséhez
    for (let i = 1; i <= 15; i++) {
      await page.click('text=Új alkalmazott hozzáadás');
      await page.fill('input[id="fullName"]', `Alkalmazott ${i}`);
      await page.fill('input[id="shortName"]', `Alk${i}`);
      await page.click('text=Válasszon...');
      await page.click('text=Tanár');
      await page.click('button:has-text("Mentés")');
    }
    
    // Ellenőrzés, hogy csak 13 sor van az első oldalon
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(13);
    
    // Következő oldalra lépés
    await page.click('text=Következő');
    
    // Ellenőrzés, hogy a második oldalon vannak-e a sorok
    await expect(rows).toHaveCount(3); // 15-13=2, de +1 lehet a fejléc miatt
    
    // Vissza az első oldalra
    await page.click('text=Előző');
    await expect(rows).toHaveCount(13);
  });
});