

import { test, expect } from '@playwright/test';

test.describe('Iskolai nyilvántartás - Tanulók', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdPg');
    await page.fill('input[name="password"]', 'AdPg123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/school/students');
    await page.waitForSelector('table');
  });

  test('Oldal betöltése és alapvető elemek megjelenítése', async ({ page }) => {
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
  

    await page.locator('tbody tr').filter({ hasText: "Teszt Elek" });
 
  });

  test('Tanuló keresése', async ({ page }) => {

    await page.getByPlaceholder('Keresés név szerint...').fill('csongrádi');
    await expect(page.getByText('Csongrádi Olivér')).toBeVisible();


    await page.getByPlaceholder('Keresés osztály szerint...').fill('9.I');
    await expect(page.getByText('9.I')).toBeVisible();
  });

  test('Tanuló nyitás engedélyezése', async ({ page }) => {
    await page.getByPlaceholder('Keresés név szerint...').fill('csongrádi');

    const studentRow = await page.locator('tr', { hasText: 'Csongrádi Olivér' });

    await expect(studentRow).toBeVisible();

    const editButton = studentRow.locator('[data-testid="unlock-button"]');

    const isDisabled = await editButton.isDisabled();
    if (!isDisabled) {
      await editButton.click();
    } else {
      test.skip();
    }
  });

  test('Tanuló szerkesztése', async ({ page }) => {

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


  test('Tanuló törlése', async ({ page }) => {

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

  test('Feloldás/korlátozás gomb', async ({ page }) => {
    const lockButton = page.getByRole('button', { name: /(Feloldás|Korlátozás)/ });
    await lockButton.click();
    await lockButton.click();
  });
});

test.describe('Osztályom - Tanulók', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'BeMo');
    await page.fill('input[name="password"]', 'BeMo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/class/students');
    await page.waitForSelector('table');
  });

  test('Oldal betöltése és alapvető elemek megjelenítése', async ({ page }) => {
    await expect(page.getByPlaceholder('Keresés név szerint...')).toBeVisible();
  });

  test('Tanuló keresése', async ({ page }) => {
    await page.getByPlaceholder('Keresés név szerint...').fill('balázs ár');
    await expect(page.getByText('Balázs Áron Botond')).toBeVisible();
  });

  test('Tanuló nyitás engedélyezése', async ({ page }) => {
    await page.getByPlaceholder('Keresés név szerint...').fill('Balázs Áron Botond');

    const studentRow = await page.locator('tr', { hasText: 'Balázs Áron Botond' });

    await expect(studentRow).toBeVisible();

    const editButton = studentRow.locator('[data-testid="unlock-button"]');

    const isDisabled = await editButton.isDisabled();
    if (!isDisabled) {
      await editButton.click();
    } else {
      test.skip();
    }
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

});