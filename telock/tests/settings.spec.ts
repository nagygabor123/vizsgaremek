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
    await page.fill('input[name="short_name"]', 'AdAd');
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
    // Open add dialog
    await page.getByRole('button', { name: 'Új nap hozzáadás' }).first().click();
    
    // Select date
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
    // Save
    await page.getByRole('button', { name: 'Mentés' }).first().click();
    
    // Verify added date in table
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(`2024. 12. 13.`)).toBeVisible();
    
   
  });


  test('Szombati tanítási nap hozzáadás', async ({ page }) => {
    // Open add dialog
    await page.getByRole('button', { name: 'Új nap hozzáadás' }).nth(1).click();
    
    // Select date
    await page.getByRole('button', { name: /2025\. április 14\./ }).click();
    while (true) {
        const currentMonth = await page.locator('div[role="presentation"][aria-live="polite"]').innerText();
        
        if (currentMonth.trim() === 'feburár 2025') break;
      
        await page.locator('button[name="next-month"]').click({ force: true });
        await page.waitForTimeout(200); 
      }
      
      await page.getByRole('gridcell', { name: /^8$/ }).first().click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');


    const positionSelect = page.getByTestId('position-select');
    await positionSelect.click();

    await page.getByRole('option', { name: 'Hétfő' }).click();

    await expect(positionSelect).toContainText('Hétfő');
    // Save
    await page.getByRole('button', { name: 'Mentés' }).first().click();
    
    // Verify added date in table
    const currentYear = new Date().getFullYear();
    await expect(page.getByText(`2025. 02. 08.`)).toBeVisible();
    
   
  });



//   test('should add a Saturday teaching day', async ({ page }) => {
//     await page.getByRole('button', { name: 'Új nap hozzáadás' }).nth(1).click();
    
//     // Select a date in the dialog
//     await page.getByRole('button', { name: 'CalendarIcon' }).first().click();
//     await page.getByRole('gridcell', { name: '20' }).first().click();
    
//     // Select a weekday to replace
//     await page.getByRole('combobox').click();
//     await page.getByRole('option', { name: 'Hétfő' }).click();
    
//     await page.getByRole('button', { name: 'Mentés' }).click();
    
//     // Verify the new item appears in the table
//     await expect(page.getByText('2024. szeptember 20.')).toBeVisible();
//     await expect(page.getByText('Hétfő')).toBeVisible();
//   });





//   test('should add a school break', async ({ page }) => {
//     await page.getByRole('button', { name: 'Új szünet hozzáadás' }).click();
    
//     // Fill in the break name
//     await page.getByLabel('Név').fill('Téli szünet');
    
//     // Select date range
//     await page.getByRole('button', { name: 'CalendarIcon' }).click();
//     await page.getByRole('gridcell', { name: '20' }).first().click();
//     await page.getByRole('gridcell', { name: '25' }).first().click();
    
//     await page.getByRole('button', { name: 'Mentés' }).click();
    
//     // Verify the new break appears in the table
//     await expect(page.getByText('Téli szünet')).toBeVisible();
//     await expect(page.getByText('2024. december 20. - 2024. december 25.')).toBeVisible();
//   });





//   test('should delete items from tables', async ({ page }) => {
//     // First add an item to delete (mock API will handle this)
//     await page.getByRole('button', { name: 'Új nap hozzáadás' }).first().click();
//     await page.getByRole('button', { name: 'CalendarIcon' }).first().click();
//     await page.getByRole('gridcell', { name: '15' }).first().click();
//     await page.getByRole('button', { name: 'Mentés' }).click();
    
//     // Click delete button and confirm
//     await page.getByRole('button', { name: 'Trash2' }).first().click();
//     await page.getByRole('button', { name: 'Véglegesítés' }).click();
    
//     // Verify the item was removed
//     await expect(page.getByText('Nincs megjelenítendő tanítási nélküli munkanap')).toBeVisible();
//   });
});