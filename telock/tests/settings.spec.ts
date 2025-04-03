import { test, expect } from '@playwright/test';

test.describe('Tanév beállításai', () => {
    test.beforeEach(async ({ page }) => {

        await page.route('**/api/config/getYearSchedule?type=kezd', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    schoolYearStart: {
                        start: '2024-09-02'
                    }
                })
            });
        });

        await page.route('**/api/config/setYearStartEnd', async (route) => {
            const requestData = await route.request().postDataJSON();
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    updatedDate: requestData.which_day
                })
            });
        });

        await page.goto('/login');
        await page.fill('input[name="short_name"]', 'AdPg');
        await page.fill('input[name="password"]', 'admin');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');

        await page.goto('/dashboard/school/settings');
    });

    test('Oldalbetöltés', async ({ page }) => {
        await expect(page.getByText('Tanítási év első napja')).toBeVisible();
        await expect(page.getByText('Tanítási év utolsó napja')).toBeVisible();

        await expect(page.getByText('2024. szeptember 2.')).toBeVisible();
        await expect(page.getByText('2025. június 13.')).toBeVisible();
    });

    test('Tanítási év első napja módosítás', async ({ page }) => {
        const startDateButton = page.locator('button').filter({ hasText: '2024. szeptember 2.' }).first();
        await startDateButton.click();

        while (true) {
            const currentMonth = await page.locator('div[role="presentation"][aria-live="polite"]').innerText();

            if (currentMonth.trim() === 'szeptember 2024') break;

            await page.locator('button[name="previous-month"]').click({ force: true });
            await page.waitForTimeout(200);
        }

        await page.getByRole('gridcell', { name: /^9$/ }).first().click();

        const editButton = page.locator('[data-testid="start-save-button"]');
        await editButton.click();

        await expect(page.getByText('2024. szeptember 9.')).toBeVisible();

    });

    test('Tanítási év utolsó napja módosítás', async ({ page }) => {
        const endDateButton = page.locator('button').filter({ hasText: '2025. június 13.' }).first();
        await endDateButton.click();

        while (true) {
            const currentMonth = await page.locator('div[role="presentation"][aria-live="polite"]').innerText();

            if (currentMonth.trim() === 'június 2025') break;

            await page.locator('button[name="next-month"]').click({ force: true });
            await page.waitForTimeout(200);
        }

        await page.getByRole('gridcell', { name: /^20$/ }).first().click();


        const editButton = page.locator('[data-testid="end-save-button"]');
        await editButton.click();

        await expect(page.getByText('2025. június 20.')).toBeVisible();

    });

    test('Tanítás nélküli munkanap hozzáadás', async ({ page }) => {
        await page.getByRole('button', { name: 'Új nap hozzáadás' }).first().click();

        await page.getByRole('button', { name: /2025\. május 20\./ }).click();
        while (true) {
            const currentMonth = await page.locator('div[role="presentation"][aria-live="polite"]').innerText();

            if (currentMonth.trim() === 'december 2024') break;

            await page.locator('button[name="previous-month"]').click({ force: true });
            await page.waitForTimeout(200);
        }

        await page.getByRole('gridcell', { name: /^13$/ }).first().click();
        await page.waitForTimeout(500);
        await page.keyboard.press('Escape');

        await page.getByRole('button', { name: 'Mentés' }).first().click();

        await expect(page.getByText(`2024. 12. 13.`)).toBeVisible();


    });

    test('Szombati tanítási nap hozzáadás', async ({ page }) => {
        await page.getByRole('button', { name: 'Új nap hozzáadás' }).nth(1).click();

        await page.getByRole('button', { name: /2025\. április 14\./ }).click();
        while (true) {
            const currentMonth = await page.locator('div[role="presentation"][aria-live="polite"]').innerText();

            if (currentMonth.trim() === 'február 2025') break;

            await page.locator('button[name="previous-month"]').click({ force: true });
            await page.waitForTimeout(200);
        }

        await page.getByRole('gridcell', { name: /^8$/ }).first().click();
        await page.waitForTimeout(500);
        await page.keyboard.press('Escape');


        const positionSelect = page.getByTestId('position-select');
        await positionSelect.click();

        await page.getByRole('option', { name: 'Hétfő' }).click();

        await expect(positionSelect).toContainText('Hétfő');

        await page.getByRole('button', { name: 'Mentés' }).first().click();

        await expect(page.getByText(`2025. 02. 08.`)).toBeVisible();

    });

    test('Tanítási szünet hozzáadás', async ({ page }) => {
        await page.getByRole('button', { name: 'Új szünet hozzáadás' }).first().click();

        await page.getByPlaceholder('Tavaszi szünet').fill("Teszt szünet");

        await page.getByRole('button', { name: /2025\. április 14\. - 2025\. május 20\./ }).click();

        let foundDecember = false;
        let attempts = 0;
        const maxAttempts = 12;

        while (!foundDecember && attempts < maxAttempts) {
            const monthTexts = await page.locator('div[role="presentation"][aria-live="polite"]').allTextContents();

            for (const monthText of monthTexts) {
                if (monthText.trim().toLowerCase().includes('december 2024')) {
                    foundDecember = true;
                    break;
                }
            }

            if (!foundDecember) {
                await page.locator('button[name="previous-month"]').first().click();
                await page.waitForTimeout(200);
                attempts++;
            }
        }

        await page.getByRole('gridcell', { name: /^20$/ }).first().click();

        const endDateCells = await page.getByRole('gridcell', { name: /^7$/ }).all();
        if (endDateCells.length > 1) {
            await endDateCells[1].click();
        } else if (endDateCells.length === 1) {
            await endDateCells[0].click();
        } 

        try {
            await page.keyboard.press('Escape');
        } catch {
        }
        await page.getByRole('button', { name: 'Mentés' }).first().click();

        await expect(page.getByText(`2024. 12. 20. - 2025. 01. 07.`)).toBeVisible();
    });

    test('Tanítás nélküli munkanap törlés', async ({ page }) => {
    
        const studentRow = await page.locator('tr', { hasText: '2024. 12. 13.' });
    
        const editButton = studentRow.locator('[data-testid="delete-button"]');
        await editButton.click();
    
        const dialogTitle = page.locator('text=Biztosan törölni szeretné ezt a napot?');
        await expect(dialogTitle).toBeVisible();
    
        const confirmButton = page.locator('button:has-text("Véglegesítés")');
        await confirmButton.click();
    
        await expect(studentRow).not.toBeVisible();
      });

      test('Szombati tanítási nap törlés', async ({ page }) => {
    
        const studentRow = await page.locator('tr', { hasText: '2025. 02. 08.' });
    
        const editButton = studentRow.locator('[data-testid="delete-button"]');
        await editButton.click();
    
        const dialogTitle = page.locator('text=Biztosan törölni szeretné ezt a napot?');
        await expect(dialogTitle).toBeVisible();
    
        const confirmButton = page.locator('button:has-text("Véglegesítés")');
        await confirmButton.click();
    
        await expect(studentRow).not.toBeVisible();
      });

      test('Tanítási szünet törlés', async ({ page }) => {
    
        const studentRow = await page.locator('tr', { hasText: '2024. 12. 20. - 2025. 01. 07.' });
    
        const editButton = studentRow.locator('[data-testid="delete-button"]');
        await editButton.click();
    
        const dialogTitle = page.locator('text=Biztosan törölni szeretné ezt a szünetet?');
        await expect(dialogTitle).toBeVisible();
    
        const confirmButton = page.locator('button:has-text("Véglegesítés")');
        await confirmButton.click();
    
        await expect(studentRow).not.toBeVisible();
      });
  
});