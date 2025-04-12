import { test, expect } from '@playwright/test';

test.describe('Saját órák', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'PaZo');
    await page.fill('input[name="password"]', 'PaZo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/my-timetable');
    await page.waitForSelector('.calendar-container');
  });

  test('Oldal betöltése és alapvető elemek megjelenítése', async ({ page }) => {
    await expect(page.locator('.calendar-header')).toBeVisible();
    await expect(page.getByText('Mai nap')).toBeVisible();

    const prevButton = await page.locator('[data-testid="prev-button"]');
    await expect(prevButton).toBeVisible();

    const nextButton = await page.locator('[data-testid="next-button"]');
    await expect(nextButton).toBeVisible();
  });

  test('Órák megjelenítése', async ({ page }) => {
    await page.waitForSelector('.lesson-card');

    const lessons = await page.locator('.lesson-card').count();
    expect(lessons).toBeGreaterThan(0);
  });

  test('Jelenlegi óra kijelölése', async ({ page }) => {
    const currentLesson = page.locator('.current-lesson').first();

    if (await currentLesson.count() > 0) {
      await expect(currentLesson).toHaveClass(/current-lesson/);
    } else {
      test.skip();
    }

  });

  test('Tanuló nyitás engedélyezése', async ({ page }) => {
    const currentLesson = page.locator('.current-lesson').first();

    if (await currentLesson.count() > 0) {
      await currentLesson.click();

      await page.waitForSelector('[role="dialog"]');

      const unlockButton = page.locator('table tbody tr').first().getByTestId('unlock-button');

      await unlockButton.click();

    } else {
      test.skip();
    }
  });

  test('Osztály/csoport nyitás negedélyezése', async ({ page }) => {
    const currentLesson = page.locator('.current-lesson').first();

    if (await currentLesson.count() > 0) {
      await currentLesson.click();

      await page.waitForSelector('[role="dialog"]');

      const groupUnlockButton = page.getByRole('button', { name: /Nyitás engedélyezése/i }); ///////
      await groupUnlockButton.click();

    } else {
      test.skip();
    }
  });

  test('Lapozás', async ({ page }) => {
    const currentLesson = page.locator('.current-lesson').first();

    if (await currentLesson.count() > 0) {
      await currentLesson.click();

      await page.waitForSelector('[role="dialog"]');

      const nextButton = page.getByRole('button', { name: /Következő/i });
      const prevButton = page.getByRole('button', { name: /Előző/i });

      if (!(await nextButton.isDisabled())) {
        await nextButton.click();

        if (!(await prevButton.isDisabled())) {
          await prevButton.click();
        }
      }
    } else {
      test.skip();
    }
  });
});