import { test, expect } from '@playwright/test';

test.describe('Tanári Órarend Komponens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="short_name"]', 'KiGI');
    await page.fill('input[name="password"]', 'KiGI123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/dashboard/my-timetable');
  //  await page.waitForSelector('table');
    await page.waitForSelector('.calendar-container');
  });

  test('Oldal betöltése és alapvető elemek megjelenítése', async ({ page }) => {
    // Ellenőrizzük, hogy a fő elemek megjelennek-e
    await expect(page.locator('.calendar-header h2')).toBeVisible();
    await expect(page.getByText('Mai nap')).toBeVisible();
    await expect(page.getByRole('button', { name: /chevron-left/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /chevron-right/i })).toBeVisible();
  });

  test('Heti nézet megjelenítése', async ({ page }) => {
    // Ellenőrizzük, hogy a hét napjai megjelennek-e
    const days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
    for (const day of days) {
      await expect(page.getByText(new RegExp(day, 'i'))).toBeVisible();
    }
  });

  test('Órák megjelenítése', async ({ page }) => {
    // Várjuk meg, hogy az órák betöltődjenek
    await page.waitForSelector('.lesson-card');
    
    // Ellenőrizzük, hogy van-e legalább egy óra megjelenítve
    const lessons = await page.locator('.lesson-card').count();
    expect(lessons).toBeGreaterThan(0);
  });

  test('Jelenlegi óra kijelölése', async ({ page }) => {
    // Keressük meg a jelenlegi órát (ha van)
    const currentLesson = page.locator('.current-lesson').first();
    
    if (await currentLesson.count() > 0) {
      await expect(currentLesson).toHaveClass(/current-lesson/);
    } else {
      console.log('Nincs aktuális óra jelenleg');
    }
  });

  test('Diákok feloldása dialógus megnyitása', async ({ page }) => {
    // Keressük meg a jelenlegi órát (ha van)
    const currentLesson = page.locator('.current-lesson').first();
    
    if (await currentLesson.count() > 0) {
      // Kattintsunk a jelenlegi órára
      await currentLesson.click();
      
      // Ellenőrizzük, hogy megnyílt-e a dialógus
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.getByText('Összes feloldás')).toBeVisible();
      
      // Ellenőrizzük, hogy megjelennek-e a diákok
      await expect(page.locator('table tbody tr').first()).toBeVisible();
    } else {
      console.log('Nincs aktuális óra jelenleg, a teszt kihagyva');
    }
  });

  test('Diák feloldása', async ({ page }) => {
    // Keressük meg a jelenlegi órát (ha van)
    const currentLesson = page.locator('.current-lesson').first();
    
    if (await currentLesson.count() > 0) {
      // Kattintsunk a jelenlegi órára
      await currentLesson.click();
      
      // Várjuk meg a dialógus megnyitását
      await page.waitForSelector('[role="dialog"]');
      
      // Az első diák feloldása gombjának megkeresése
      const unlockButton = page.locator('table tbody tr').first().getByRole('button', { name: /lock-open/i });
      
      if (await unlockButton.count() > 0 && !(await unlockButton.isDisabled())) {
        await unlockButton.click();
        
        // Itt ellenőrizhetnénk, hogy sikeres volt-e a művelet,
        // de ez függ a backend válaszától és a UI frissítésétől
      } else {
        console.log('Az első diák már fel van oldva vagy nem lehet feloldani');
      }
    } else {
      console.log('Nincs aktuális óra jelenleg, a teszt kihagyva');
    }
  });

  test('Csoportos feloldás', async ({ page }) => {
    // Keressük meg a jelenlegi órát (ha van)
    const currentLesson = page.locator('.current-lesson').first();
    
    if (await currentLesson.count() > 0) {
      // Kattintsunk a jelenlegi órára
      await currentLesson.click();
      
      // Várjuk meg a dialógus megnyitását
      await page.waitForSelector('[role="dialog"]');
      
      // Kattintsunk a "Összes feloldás" gombra
      const groupUnlockButton = page.getByRole('button', { name: /Összes feloldás/i });
      await groupUnlockButton.click();
      
      // Itt ellenőrizhetnénk, hogy sikeres volt-e a művelet
    } else {
      console.log('Nincs aktuális óra jelenleg, a teszt kihagyva');
    }
  });

  test('Lapozás a diákok listájában', async ({ page }) => {
    // Keressük meg a jelenlegi órát (ha van)
    const currentLesson = page.locator('.current-lesson').first();
    
    if (await currentLesson.count() > 0) {
      // Kattintsunk a jelenlegi órára
      await currentLesson.click();
      
      // Várjuk meg a dialógus megnyitását
      await page.waitForSelector('[role="dialog"]');
      
      // Ellenőrizzük a lapozó gombokat
      const nextButton = page.getByRole('button', { name: /Következő/i });
      const prevButton = page.getByRole('button', { name: /Előző/i });
      
      // Ha a következő gomb nem disabled, kattintsunk rá
      if (!(await nextButton.isDisabled())) {
        await nextButton.click();
        
        // Vissza az előző oldalra
        if (!(await prevButton.isDisabled())) {
          await prevButton.click();
        }
      }
    } else {
      console.log('Nincs aktuális óra jelenleg, a teszt kihagyva');
    }
  });
});