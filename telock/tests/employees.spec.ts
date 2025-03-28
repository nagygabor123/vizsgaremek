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

    test('Új alkalmazott hozzáadás ', async ({ page }) => {
        //await page.goto('/dashboard/school/employees');

        await page.getByRole('button', { name: 'Új alkalmazott hozzáadás' }).click();
        await expect(page.getByRole('dialog', { name: 'Alkalmazott hozzáadása' })).toBeVisible();
        await page.getByLabel('Teljes név').fill('Teszt Alkalmazott');
        await page.getByLabel('Rövidített név (felhasználónév)').fill('TeAl');

        const positionSelect = page.getByTestId('position-select');
        await positionSelect.click();

        await page.getByRole('option', { name: 'Portás' }).click();

        await expect(positionSelect).toContainText('Portás');

        await page.getByRole('button', { name: 'Mentés' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible();
    });


    test('Keresés', async ({ page }) => {

        await page.getByPlaceholder('Keresés név szerint...').fill('teszt');
        await expect(page.getByText('Teszt Alkalmazott (TeAl)')).toBeVisible();


        await page.getByPlaceholder('Keresés pozíció szerint...').fill('Portás');
        await expect(page.getByText('Portás')).toBeVisible();
    });


    test('Alkalmazott szerkesztés', async ({ page }) => {

        await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Alkalmazott');

        const employeRow = await page.locator('tr', { hasText: 'Teszt Alkalmazott (TeAl)' });

        await expect(employeRow).toBeVisible();

        const editButton = employeRow.locator('[data-testid="edit-button"]');
        await editButton.click();

        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toBeVisible();
        await expect(dialog).toContainText('Alkalmazott szerkesztése');

        const fullNameInput = page.locator('input[name="full_name"]');

        await fullNameInput.fill(`Teszt Alkalmazott Módosított`);

        await dialog.locator('button', { hasText: 'Mentés' }).click();

        await expect(dialog).not.toBeVisible();

    });

    test('Alkalamzott törlés', async ({ page }) => {

        await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Alkalmazott Módosított');

        const employeRow = await page.locator('tr', { hasText: 'Teszt Alkalmazott Módosított' });

        const editButton = employeRow.locator('[data-testid="delete-button"]');
        await editButton.click();

        const dialogTitle = page.locator('text=Biztosan törölni szeretné az alkalmazottat?');
        await expect(dialogTitle).toBeVisible();

        const confirmButton = page.locator('button:has-text("Véglegesítés")');
        await confirmButton.click();

        //  await page.getByPlaceholder('Keresés név szerint...').fill('Teszt Elek');

        await expect(employeRow).not.toBeVisible();
    });


    test('Rendezés', async ({ page }) => {
        await page.locator('th', { hasText: 'Teljes név' }).click();

        await page.locator('th', { hasText: 'Pozíció' }).click();

        await page.locator('th', { hasText: 'Osztály' }).click();

    });

    test('Lapozás', async ({ page }) => {
        if (await page.getByRole('button', { name: 'Következő' }).isEnabled()) {
            await page.getByRole('button', { name: 'Következő' }).click();
            await page.getByRole('button', { name: 'Előző' }).click();
        }
    });


});