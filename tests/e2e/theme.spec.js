const { test, expect } = require('@playwright/test');

test.describe('Theme System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure consistent initial state
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('dark theme applies dark background', async ({ page }) => {
    await page.goto('/index.html');
    const body = page.locator('body');
    const bgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    // Dark theme: #0a0a0a = rgb(10, 10, 10)
    expect(bgColor).toBe('rgb(10, 10, 10)');
  });

  test('light theme applies light background', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(400); // wait for transition
    const body = page.locator('body');
    const bgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    // Light theme: #f8f8f8 = rgb(248, 248, 248)
    expect(bgColor).toBe('rgb(248, 248, 248)');
  });

  test('theme toggle button works', async ({ page }) => {
    await page.goto('/index.html');
    // Check initial dark theme
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(initialTheme).toBe('dark');

    // Click the theme toggle button
    const toggleBtn = page.locator('#themeBtn');
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveText('Light Mode');
    await toggleBtn.click();
    await page.waitForTimeout(400);
    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(newTheme).toBe('light');
    await expect(toggleBtn).toHaveText('Dark Mode');
  });

  test('theme toggle persists via button click cycle', async ({ page }) => {
    await page.goto('/index.html');
    const toggleBtn = page.locator('#themeBtn');

    // Switch to light
    await toggleBtn.click();
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('light');

    // Switch back to dark
    await toggleBtn.click();
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('dark');
    await expect(toggleBtn).toHaveText('Light Mode');
  });

  test('CSS variables are defined on :root for dark theme', async ({ page }) => {
    await page.goto('/index.html');
    const vars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        bgPrimary: style.getPropertyValue('--noir-bg-primary').trim(),
        accent: style.getPropertyValue('--noir-accent').trim(),
        textPrimary: style.getPropertyValue('--noir-text-primary').trim(),
      };
    });
    expect(vars.bgPrimary).toBe('#0a0a0a');
    expect(vars.accent).toBe('#e84545');
    expect(vars.textPrimary).toBe('#f0f0f0');
  });

  test('CSS variables change for light theme', async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await page.waitForTimeout(400);
    const vars = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        bgPrimary: style.getPropertyValue('--noir-bg-primary').trim(),
        accent: style.getPropertyValue('--noir-accent').trim(),
        textPrimary: style.getPropertyValue('--noir-text-primary').trim(),
      };
    });
    expect(vars.bgPrimary).toBe('#f8f8f8');
    expect(vars.accent).toBe('#d63031');
    expect(vars.textPrimary).toBe('#1a1a1a');
  });
});

test.describe('Component Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('buttons render with correct styles', async ({ page }) => {
    await page.goto('/index.html');
    const btn = page.locator('.btn-primary').first();
    await expect(btn).toBeVisible();
    const bgColor = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    // #e84545 = rgb(232, 69, 69)
    expect(bgColor).toBe('rgb(232, 69, 69)');
  });

  test('secondary button has transparent background and border', async ({ page }) => {
    await page.goto('/index.html');
    const btn = page.locator('button.btn.btn-secondary').first();
    await expect(btn).toBeVisible();
    const bgColor = await btn.evaluate(el => getComputedStyle(el).backgroundColor);
    // transparent = rgba(0, 0, 0, 0)
    expect(bgColor).toBe('rgba(0, 0, 0, 0)');
    const borderStyle = await btn.evaluate(el => getComputedStyle(el).borderStyle);
    expect(borderStyle).toBe('solid');
  });

  test('cards are visible with rounded corners', async ({ page }) => {
    await page.goto('/index.html');
    const card = page.locator('.card').first();
    await expect(card).toBeVisible();
    const borderRadius = await card.evaluate(el => getComputedStyle(el).borderRadius);
    // --noir-radius-lg = 0.75rem = 12px
    expect(borderRadius).toBe('12px');
  });

  test('container has correct max-width', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/index.html');
    const container = page.locator('.container').first();
    const maxWidth = await container.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('1280px');
  });

  test('grid layout renders with grid display', async ({ page }) => {
    await page.goto('/index.html');
    const grid = page.locator('.grid').first();
    await expect(grid).toBeVisible();
    const display = await grid.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('badges are visible and styled', async ({ page }) => {
    await page.goto('/index.html');
    const badge = page.locator('.badge').first();
    await expect(badge).toBeVisible();
    const display = await badge.evaluate(el => getComputedStyle(el).display);
    // inline-flex becomes flex when inside a flex container
    expect(['inline-flex', 'flex']).toContain(display);
  });

  test('input fields have correct styles', async ({ page }) => {
    await page.goto('/index.html');
    const input = page.locator('.input').first();
    await expect(input).toBeVisible();
    const borderColor = await input.evaluate(el => getComputedStyle(el).borderColor);
    expect(borderColor).not.toBe('');
    const borderRadius = await input.evaluate(el => getComputedStyle(el).borderRadius);
    // --noir-radius-md = 0.5rem = 8px
    expect(borderRadius).toBe('8px');
  });

  test('alerts are visible with left border', async ({ page }) => {
    await page.goto('/index.html');
    const alert = page.locator('.alert').first();
    await expect(alert).toBeVisible();
    const borderLeft = await alert.evaluate(el => getComputedStyle(el).borderLeftWidth);
    expect(borderLeft).toBe('3px');
  });

  test('disabled buttons have reduced opacity', async ({ page }) => {
    await page.goto('/index.html');
    const disabledBtn = page.locator('.btn[disabled]').first();
    await expect(disabledBtn).toBeVisible();
    const opacity = await disabledBtn.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('0.5');
  });

  test('button group renders inline-flex', async ({ page }) => {
    await page.goto('/index.html');
    const btnGroup = page.locator('.btn-group');
    await expect(btnGroup).toBeVisible();
    const display = await btnGroup.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('inline-flex');
  });

  test('progress bars are visible', async ({ page }) => {
    await page.goto('/index.html');
    const progress = page.locator('.progress').first();
    await expect(progress).toBeVisible();
    const height = await progress.evaluate(el => getComputedStyle(el).height);
    expect(height).toBe('6px');
  });

  test('avatars render with correct size', async ({ page }) => {
    await page.goto('/index.html');
    // First .avatar in the page (inside a card) has default size: 2.5rem = 40px
    const avatar = page.locator('.avatar').first();
    await expect(avatar).toBeVisible();
    const width = await avatar.evaluate(el => getComputedStyle(el).width);
    expect(width).toBe('40px');
  });
});

test.describe('Dialog Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('modal dialog exists in DOM', async ({ page }) => {
    await page.goto('/index.html');
    const dialog = page.locator('dialog.modal');
    await expect(dialog).toHaveCount(1);
  });

  test('modal opens via Open Modal button', async ({ page }) => {
    await page.goto('/index.html');
    const openBtn = page.locator('button:has-text("Open Modal")');
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    const dialog = page.locator('dialog.modal[open]');
    await expect(dialog).toBeVisible();
  });

  test('modal closes via close button', async ({ page }) => {
    await page.goto('/index.html');
    const openBtn = page.locator('button:has-text("Open Modal")');
    await openBtn.click();
    await page.waitForTimeout(300);
    // Click close button (the x button with aria-label="Close")
    const closeBtn = page.locator('dialog.modal button[aria-label="Close"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await page.waitForTimeout(300);
    const dialog = page.locator('dialog.modal[open]');
    await expect(dialog).toHaveCount(0);
  });

  test('modal closes via Escape key', async ({ page }) => {
    await page.goto('/index.html');
    const openBtn = page.locator('button:has-text("Open Modal")');
    await openBtn.click();
    await page.waitForTimeout(300);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const dialog = page.locator('dialog.modal[open]');
    await expect(dialog).toHaveCount(0);
  });

  test('modal closes via Cancel button', async ({ page }) => {
    await page.goto('/index.html');
    const openBtn = page.locator('button:has-text("Open Modal")');
    await openBtn.click();
    await page.waitForTimeout(300);
    const cancelBtn = page.locator('dialog.modal button:has-text("Cancel")');
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
    await page.waitForTimeout(300);
    const dialog = page.locator('dialog.modal[open]');
    await expect(dialog).toHaveCount(0);
  });

  test('modal has aria-labelledby', async ({ page }) => {
    await page.goto('/index.html');
    const dialog = page.locator('dialog.modal');
    const labelledby = await dialog.getAttribute('aria-labelledby');
    expect(labelledby).toBe('modal-title');
  });

  test('modal has correct title', async ({ page }) => {
    await page.goto('/index.html');
    const openBtn = page.locator('button:has-text("Open Modal")');
    await openBtn.click();
    await page.waitForTimeout(300);
    const title = page.locator('#modal-title');
    await expect(title).toHaveText('Modal Title');
  });
});

test.describe('Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('navbar toggle hidden on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('/index.html');
    const toggle = page.locator('.navbar-toggle');
    // On desktop (>= 768px), navbar-toggle has display: none
    const display = await toggle.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('none');
  });

  test('navbar toggle visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    const toggle = page.locator('.navbar-toggle');
    // On mobile (< 768px), navbar-toggle has display: flex
    const display = await toggle.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('container width adapts to viewport', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 });
    await page.goto('/index.html');
    const container = page.locator('.container').first();
    const width = await container.evaluate(el => el.getBoundingClientRect().width);
    expect(width).toBeLessThanOrEqual(500);
  });

  test('navbar-nav is off-screen on mobile by default', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    const nav = page.locator('.navbar-nav');
    // On mobile, navbar-nav is positioned off-screen (right: -280px)
    const right = await nav.evaluate(el => getComputedStyle(el).right);
    expect(right).toBe('-280px');
  });

  test('navbar-nav opens on mobile when toggle is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    const toggle = page.locator('.navbar-toggle');
    await toggle.click();
    await page.waitForTimeout(300);
    const nav = page.locator('.navbar-nav');
    const right = await nav.evaluate(el => getComputedStyle(el).right);
    expect(right).toBe('0px');
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('page has lang attribute', async ({ page }) => {
    await page.goto('/index.html');
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');
  });

  test('page has data-theme attribute', async ({ page }) => {
    await page.goto('/index.html');
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
  });

  test('all images have alt or are decorative', async ({ page }) => {
    await page.goto('/index.html');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      const ariaHidden = await img.getAttribute('aria-hidden');
      // Either has alt, or is marked decorative
      expect(alt !== null || role === 'presentation' || ariaHidden === 'true').toBe(true);
    }
  });

  test('form inputs with id have associated labels', async ({ page }) => {
    await page.goto('/index.html');
    // Check only the main form inputs that have explicit for/id label association
    const labeledInputIds = ['email', 'password', 'demo-select', 'message', 'range'];
    for (const id of labeledInputIds) {
      const input = page.locator(`#${id}`);
      const count = await input.count();
      if (count > 0) {
        const label = page.locator(`label[for="${id}"]`);
        const labelCount = await label.count();
        expect(labelCount).toBeGreaterThan(0);
      }
    }
  });

  test('interactive elements are keyboard focusable', async ({ page }) => {
    await page.goto('/index.html');
    const firstBtn = page.locator('.btn').first();
    await firstBtn.focus();
    const isFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active && active.classList.contains('btn');
    });
    expect(isFocused).toBe(true);
  });

  test('alerts have role=alert attribute', async ({ page }) => {
    await page.goto('/index.html');
    const alerts = page.locator('.alert[role="alert"]');
    const count = await alerts.count();
    expect(count).toBe(4); // success, warning, error, info
  });

  test('dropdown button has aria-haspopup', async ({ page }) => {
    await page.goto('/index.html');
    const dropdownBtn = page.locator('.dropdown button[aria-haspopup="true"]');
    await expect(dropdownBtn).toHaveCount(1);
  });

  test('breadcrumb nav has aria-label', async ({ page }) => {
    await page.goto('/index.html');
    const breadcrumb = page.locator('nav.breadcrumb[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toHaveCount(1);
  });

  test('GitHub link has aria-label', async ({ page }) => {
    await page.goto('/index.html');
    const ghLink = page.locator('a[aria-label="GitHub"]');
    await expect(ghLink).toHaveCount(1);
  });
});

test.describe('Navigation Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('tabs render with correct display', async ({ page }) => {
    await page.goto('/index.html');
    const tabs = page.locator('.tabs').first();
    await expect(tabs).toBeVisible();
    const display = await tabs.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('active tab has accent color', async ({ page }) => {
    await page.goto('/index.html');
    const activeTab = page.locator('.tabs .tab.active').first();
    await expect(activeTab).toBeVisible();
    const color = await activeTab.evaluate(el => getComputedStyle(el).color);
    // #e84545 = rgb(232, 69, 69)
    expect(color).toBe('rgb(232, 69, 69)');
  });

  test('breadcrumb renders correctly', async ({ page }) => {
    await page.goto('/index.html');
    const breadcrumb = page.locator('.breadcrumb');
    await expect(breadcrumb).toBeVisible();
    const items = page.locator('.breadcrumb-item');
    const count = await items.count();
    expect(count).toBe(3); // Home, Components, Navigation
  });

  test('pagination renders correctly', async ({ page }) => {
    await page.goto('/index.html');
    const pagination = page.locator('.pagination');
    await expect(pagination).toBeVisible();
    const links = page.locator('.page-link');
    const count = await links.count();
    expect(count).toBe(6); // <<, 1, 2, 3, 4, >>
  });

  test('active pagination link has accent background', async ({ page }) => {
    await page.goto('/index.html');
    const activeLink = page.locator('.page-link.active');
    await expect(activeLink).toBeVisible();
    const bgColor = await activeLink.evaluate(el => getComputedStyle(el).backgroundColor);
    // #e84545 = rgb(232, 69, 69)
    expect(bgColor).toBe('rgb(232, 69, 69)');
  });

  test('dropdown menu is hidden by default', async ({ page }) => {
    await page.goto('/index.html');
    const menu = page.locator('.dropdown-menu');
    const opacity = await menu.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('0');
  });

  test('dropdown opens on button click', async ({ page }) => {
    await page.goto('/index.html');
    const dropdownBtn = page.locator('.dropdown button');
    await dropdownBtn.click();
    await page.waitForTimeout(200);
    const menu = page.locator('.dropdown-menu');
    const opacity = await menu.evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});

test.describe('Visual Styles', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('noir-theme'));
  });

  test('navbar has sticky positioning', async ({ page }) => {
    await page.goto('/index.html');
    const navbar = page.locator('.navbar');
    const position = await navbar.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('sticky');
  });

  test('card-hover class has transition', async ({ page }) => {
    await page.goto('/index.html');
    const card = page.locator('.card-hover').first();
    await expect(card).toBeVisible();
    const transition = await card.evaluate(el => getComputedStyle(el).transition);
    expect(transition).not.toBe('');
    expect(transition).not.toBe('none');
  });

  test('code block has monospace font', async ({ page }) => {
    await page.goto('/index.html');
    const codeBlock = page.locator('.code-block');
    await expect(codeBlock).toBeVisible();
    const fontFamily = await codeBlock.evaluate(el => getComputedStyle(el).fontFamily);
    expect(fontFamily.toLowerCase()).toContain('mono');
  });

  test('skeleton has animation', async ({ page }) => {
    await page.goto('/index.html');
    const skeleton = page.locator('.skeleton').first();
    await expect(skeleton).toBeVisible();
    const animation = await skeleton.evaluate(el => getComputedStyle(el).animationName);
    expect(animation).toBe('skeleton-shimmer');
  });

  test('toast container has correct styles', async ({ page }) => {
    await page.goto('/index.html');
    const toastContainer = page.locator('.toast-container');
    await expect(toastContainer).toBeVisible();
    const toasts = page.locator('.toast');
    const count = await toasts.count();
    expect(count).toBe(4); // success, error, warning, info
  });

  test('divider renders as 1px line', async ({ page }) => {
    await page.goto('/index.html');
    const divider = page.locator('.divider').first();
    await expect(divider).toBeVisible();
    const height = await divider.evaluate(el => getComputedStyle(el).height);
    expect(height).toBe('1px');
  });
});
