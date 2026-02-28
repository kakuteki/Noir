const { test, expect } = require('@playwright/test');

// Visual regression tests compare screenshots to detect unintended CSS changes.
// On first run, screenshots are created as baselines.
// On subsequent runs, new screenshots are compared against baselines.

test.describe('Visual Regression - Dark Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/index.html');
    // Ensure dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(400);
  });

  test('hero section', async ({ page }) => {
    const hero = page.locator('.demo-section').first();
    await expect(hero).toHaveScreenshot('dark-hero.png', { maxDiffPixelRatio: 0.01 });
  });

  test('buttons section', async ({ page }) => {
    const section = page.locator('#buttons').first();
    if (await section.isVisible()) {
      await expect(section).toHaveScreenshot('dark-buttons.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('cards section', async ({ page }) => {
    const section = page.locator('#cards').first();
    if (await section.isVisible()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(section).toHaveScreenshot('dark-cards.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('forms section', async ({ page }) => {
    const section = page.locator('#forms').first();
    if (await section.isVisible()) {
      await expect(section).toHaveScreenshot('dark-forms.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('navigation components', async ({ page }) => {
    const section = page.locator('#navigation').first();
    if (await section.isVisible()) {
      await expect(section).toHaveScreenshot('dark-navigation.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('full page snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('dark-fullpage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe('Visual Regression - Light Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/index.html');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(400);
  });

  test('hero section', async ({ page }) => {
    const hero = page.locator('.demo-section').first();
    await expect(hero).toHaveScreenshot('light-hero.png', { maxDiffPixelRatio: 0.01 });
  });

  test('buttons section', async ({ page }) => {
    const section = page.locator('#buttons').first();
    if (await section.isVisible()) {
      await expect(section).toHaveScreenshot('light-buttons.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('cards section', async ({ page }) => {
    const section = page.locator('#cards').first();
    if (await section.isVisible()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(section).toHaveScreenshot('light-cards.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('forms section', async ({ page }) => {
    const section = page.locator('#forms').first();
    if (await section.isVisible()) {
      await expect(section).toHaveScreenshot('light-forms.png', { maxDiffPixelRatio: 0.01 });
    }
  });

  test('full page snapshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('light-fullpage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe('Visual Regression - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/index.html');
    await page.waitForTimeout(300);
  });

  test('mobile full page dark', async ({ page }) => {
    await expect(page).toHaveScreenshot('mobile-dark-fullpage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('mobile full page light', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot('mobile-light-fullpage.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});
