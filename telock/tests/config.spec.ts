import { test, expect } from '@playwright/test';

test.describe('SheetComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'AdAd');
    await page.fill('input[name="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    // Navigate to the page that includes the SheetComponent
    await page.goto('/dashboard/school/employees'); // Adjust the URL to your setup
  });

  test('should open the sheet when "Konfigurálás most" button is clicked', async ({ page }) => {
    await page.goto('/dashboard/school/employees');
    // Check if the button is visible and click it
    const configureButton = await page.locator('[data-testid="configure-button"]');
    await expect(configureButton).toBeVisible();
    await configureButton.click();

    // Check if the sheet is open by checking for its title
    const sheetTitle = await page.locator('text=Beállítási folyamat');
    await expect(sheetTitle).toBeVisible();
  });

  test('should display error message if no XML file is selected and "Mentés & Tovább" is clicked', async ({ page }) => {
    await page.locator('[data-testid="configure-button"]').click(); // Open sheet

    const nextButton = page.locator('button:has-text("Mentés & Tovább")');
    await nextButton.click(); // Try to proceed without selecting a file

    // Check for the error message about file selection
    const errorMessage = await page.locator('text=Nincs fájl kiválasztva');
    await expect(errorMessage).toBeVisible();
  });

  test('should show file name after selecting a valid XML file', async ({ page }) => {
    await page.locator('[data-testid="configure-button"]').click(); // Open sheet

    const fileInput = await page.locator('[data-testid="file-input"]');
    
    // Mock file selection
    const filePath = 'test-data/orarend.xml'; // Adjust the path to a real file on your system
    await fileInput.setInputFiles(filePath);

    // Check if the file name is displayed
    const fileName = await page.locator('text=file.xml'); // Adjust based on the file name
    await expect(fileName).toBeVisible();
  });

  test('should upload XML file and show success message', async ({ page }) => {
    await page.locator('[data-testid="configure-button"]').click(); // Open sheet

    const fileInput = await page.locator('[data-testid="file-input"]');

    // Mock file selection
    const filePath = 'test-data/orarend.xml'; // Adjust the path to a real file on your system
    await fileInput.setInputFiles(filePath);

    const nextButton = page.locator('button:has-text("Mentés & Tovább")');
    await nextButton.click(); // Proceed to upload

    // Wait for the success message after file upload
    const successMessage = await page.locator('text=Sikeres feltöltés');
    await expect(successMessage).toBeVisible();
  });

  test('should upload CSV file and show success message', async ({ page }) => {
    await page.locator('[data-testid="configure-button"]').click(); // Open sheet

    // Go to the second step
    await page.locator('text=2. Diákok feltöltése').click(); // Go to step 2

    const csvFileInput = await page.locator('[data-testid="csv-input"]');

    // Mock CSV file selection
    const csvFilePath = 'test-data/tanulok.csv'; // Adjust the path to a real file on your system
    await csvFileInput.setInputFiles(csvFilePath);

    const confirmButton = page.locator('button:has-text("Mentés & Megerősítés")');
    await confirmButton.click(); // Proceed to upload CSV

    // Wait for the success message after CSV upload
    const successMessage = await page.locator('text=File uploaded successfully!');
    await expect(successMessage).toBeVisible();
  });
});
