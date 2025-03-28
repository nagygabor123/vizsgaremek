import { test, expect } from '@playwright/test';

test.describe('Konfiguráció', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdAd');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
   
    await page.goto('/dashboard/school/employees'); 
  });

  test('Felületbetöltés', async ({ page }) => {
    await page.goto('/dashboard/school/employees');
    const configureButton = await page.locator('[data-testid="configure-button"]');
    await expect(configureButton).toBeVisible();
    await configureButton.click();

    const sheetTitle = await page.locator('text=Beállítási folyamat');
    await expect(sheetTitle).toBeVisible();
  });

  test('Sikeretlen feltöltés, nincs kiválaszott fájls', async ({ page }) => {
    await page.locator('[data-testid="configure-button"]').click(); 

    const nextButton = page.locator('button:has-text("Mentés & Tovább")');
    await nextButton.click(); 

    const errorMessage = await page.locator('text=Nincs fájl kiválasztva');
    await expect(errorMessage).toBeVisible();
  });

  test('Sikeres XML és CSV fájl feltöltés', async ({ page }) => {
    await page.locator('[data-testid="configure-button"]').click();

    const fileInput = await page.locator('[data-testid="file-input"]');
    const filePath = 'test-data/orarend.xml'; 
    await fileInput.setInputFiles(filePath);
    const fileName = await page.locator('text=orarend.xml'); 
    await expect(fileName).toBeVisible();
    const nextButton = page.locator('button:has-text("Mentés & Tovább")');
    await nextButton.click();

    const csvFileInput = await page.locator('[data-testid="csv-input"]');
    const csvFilePath = 'test-data/tanulok.csv'; 
    await csvFileInput.setInputFiles(csvFilePath);
    // const fileName2 = await page.locator('text=tanulok.csv');
    // await expect(fileName2).toBeVisible();

    const confirmButton = page.locator('button:has-text("Mentés & Megerősítés")');
    await confirmButton.click(); 
  });

  test('Feltöltött XML fájl adataink ellenőrzése', async ({ page }) => {
    await page.goto('/dashboard/school/employees');
    await page.waitForSelector('table');

    await page.getByPlaceholder('Keresés név szerint...').fill('Kiss G');
    await expect(page.getByText('Kiss Gábor István (KiGI)')).toBeVisible();


  });

  test('Feltöltött CSV fájl adataink ellenőrzése', async ({ page }) => {
   

    await page.goto('/dashboard/school/students');
    await page.waitForSelector('table');

    await page.getByPlaceholder('Keresés osztály szerint...').fill('10.I'); 
    await page.getByPlaceholder('Keresés név szerint...').fill('Nagy');
  

    await expect(page.getByText('Nagy Bence')).toBeVisible();

  });



});
