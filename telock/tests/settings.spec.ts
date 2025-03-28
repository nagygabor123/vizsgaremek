import { test, expect } from '@playwright/test';

test.describe('School Year Configuration Page', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdAd');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/school/settings');
  });




  test('should display school year start and end dates', async ({ page }) => {
    await expect(page.getByText('Tanítási év első napja')).toBeVisible();
    await expect(page.getByText('Tanítási év utolsó napja')).toBeVisible();
    
    // Check if dates are displayed in Hungarian format
    await expect(page.getByText('2024. szeptember 2.')).toBeVisible();
    await expect(page.getByText('2025. június 13.')).toBeVisible();
  });

  test('should update school year start date', async ({ page }) => {
    const startDateButton = page.locator('button').filter({ hasText: '2024. szeptember 2.' }).first();
    await startDateButton.click();
    
    // Select a date in the calendar (next day)
    await page.getByRole('gridcell', { name: '3' }).first().click();
    const editButton = page.locator('[data-testid="start-edit-button"]');
    await editButton.click();
    
    // Verify the date was updated (mock response should handle this)
    await expect(page.getByText('2024. szeptember 3.')).toBeVisible();
  });

  test('should add a non-teaching day', async ({ page }) => {
    await page.getByRole('button', { name: 'Új nap hozzáadás' }).first().click();
    
    // Select a date in the dialog
    await page.getByRole('button', { name: 'CalendarIcon' }).first().click();
    await page.getByRole('gridcell', { name: '15' }).first().click();
    await page.getByRole('button', { name: 'Mentés' }).click();
    
    // Verify the new item appears in the table
    await expect(page.getByText('2024. szeptember 15.')).toBeVisible();
  });

  test('should add a Saturday teaching day', async ({ page }) => {
    await page.getByRole('button', { name: 'Új nap hozzáadás' }).nth(1).click();
    
    // Select a date in the dialog
    await page.getByRole('button', { name: 'CalendarIcon' }).first().click();
    await page.getByRole('gridcell', { name: '20' }).first().click();
    
    // Select a weekday to replace
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Hétfő' }).click();
    
    await page.getByRole('button', { name: 'Mentés' }).click();
    
    // Verify the new item appears in the table
    await expect(page.getByText('2024. szeptember 20.')).toBeVisible();
    await expect(page.getByText('Hétfő')).toBeVisible();
  });

  test('should add a school break', async ({ page }) => {
    await page.getByRole('button', { name: 'Új szünet hozzáadás' }).click();
    
    // Fill in the break name
    await page.getByLabel('Név').fill('Téli szünet');
    
    // Select date range
    await page.getByRole('button', { name: 'CalendarIcon' }).click();
    await page.getByRole('gridcell', { name: '20' }).first().click();
    await page.getByRole('gridcell', { name: '25' }).first().click();
    
    await page.getByRole('button', { name: 'Mentés' }).click();
    
    // Verify the new break appears in the table
    await expect(page.getByText('Téli szünet')).toBeVisible();
    await expect(page.getByText('2024. december 20. - 2024. december 25.')).toBeVisible();
  });

  test('should delete items from tables', async ({ page }) => {
    // First add an item to delete (mock API will handle this)
    await page.getByRole('button', { name: 'Új nap hozzáadás' }).first().click();
    await page.getByRole('button', { name: 'CalendarIcon' }).first().click();
    await page.getByRole('gridcell', { name: '15' }).first().click();
    await page.getByRole('button', { name: 'Mentés' }).click();
    
    // Click delete button and confirm
    await page.getByRole('button', { name: 'Trash2' }).first().click();
    await page.getByRole('button', { name: 'Véglegesítés' }).click();
    
    // Verify the item was removed
    await expect(page.getByText('Nincs megjelenítendő tanítási nélküli munkanap')).toBeVisible();
  });
});