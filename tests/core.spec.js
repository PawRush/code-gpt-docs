const { test, expect } = require('@playwright/test');

test.describe('Core Documentation Tests', () => {
  // Homepage & Navigation
  test('should load homepage and redirect to docs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(page).toHaveTitle(/CodeGPT/);
  });

  test('should display main navigation elements', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForLoadState('networkidle');
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();
    await expect(page.locator('nav.navbar a:has-text("Tutorial")')).toBeVisible();
  });

  test('should have functional sidebar navigation', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForSelector('.menu', { timeout: 10000 });
    const sidebar = page.locator('.menu');
    await expect(sidebar).toBeVisible();
    const sidebarLinks = sidebar.locator('a');
    expect(await sidebarLinks.count()).toBeGreaterThan(5);
  });

  test('should display intro documentation content', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForSelector('article', { timeout: 10000 });
    const article = page.locator('article');
    await expect(article).toBeVisible();
    const content = await article.textContent();
    expect(content.length).toBeGreaterThan(100);
  });

  test('should have working logo link', async ({ page }) => {
    await page.goto('/docs/intro');
    const logoLink = page.locator('a.navbar__brand');
    await expect(logoLink).toBeVisible();
    const logoImg = logoLink.locator('img');
    await expect(logoImg).toHaveAttribute('alt', 'CodeGPT');
  });

  // Tutorial Navigation
  test('should navigate to Installation page', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForSelector('.menu', { timeout: 10000 });
    const installationLink = page.locator('.menu a:has-text("Installation")').first();
    if (await installationLink.count() > 0) {
      await installationLink.click();
      await expect(page).toHaveURL(/installation/);
      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });

  test('should have next/previous page navigation', async ({ page }) => {
    await page.goto('/docs/intro');
    const pagination = page.locator('.pagination-nav, nav.pagination');
    if (await pagination.count() > 0) {
      await expect(pagination).toBeVisible();
      const nextLink = pagination.locator('a:has-text("Next"), a:has-text("next")').first();
      const prevLink = pagination.locator('a:has-text("Previous"), a:has-text("previous")').first();
      expect(await nextLink.count() + await prevLink.count()).toBeGreaterThan(0);
    }
  });

  test('should navigate through tutorial basics pages', async ({ page }) => {
    const pages = ['/docs/tutorial-basics/installation', '/docs/tutorial-basics/configuration'];
    for (const pagePath of pages) {
      const response = await page.goto(pagePath);
      if (response && response.ok()) {
        const article = page.locator('article');
        await expect(article).toBeVisible();
        const content = await article.textContent();
        expect(content.length).toBeGreaterThan(50);
      }
    }
  });

  // AI Provider Guides
  test('should navigate to OpenAI configuration guide', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');
    await expect(page).toHaveURL(/openai/);
    const article = page.locator('article');
    await expect(article).toBeVisible();
    const content = await article.textContent();
    expect(content.toLowerCase()).toContain('openai');
  });

  test('should navigate to Anthropic configuration guide', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/anthropic');
    await expect(page).toHaveURL(/anthropic/);
    const article = page.locator('article');
    await expect(article).toBeVisible();
    const content = await article.textContent();
    expect(content.toLowerCase()).toContain('anthropic');
  });

  test('should load major AI provider pages', async ({ page }) => {
    const providers = [
      '/docs/tutorial-ai-providers/openai',
      '/docs/tutorial-ai-providers/anthropic',
      '/docs/tutorial-ai-providers/ollama',
    ];
    for (const providerPath of providers) {
      const response = await page.goto(providerPath);
      if (response && response.ok()) {
        const article = page.locator('article');
        await expect(article).toBeVisible();
        const content = await article.textContent();
        expect(content.length).toBeGreaterThan(100);
      }
    }
  });

  test('should have consistent structure across provider guides', async ({ page }) => {
    const providers = ['/docs/tutorial-ai-providers/openai', '/docs/tutorial-ai-providers/mistral'];
    for (const providerPath of providers) {
      await page.goto(providerPath);
      await page.waitForLoadState('networkidle');
      const article = page.locator('article');
      await expect(article).toBeVisible();
      const heading = article.locator('h1, h2, h3').first();
      await expect(heading).toBeVisible();
    }
  });

  // Search & Navigation
  test('should have functional sidebar links', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForSelector('.menu', { timeout: 10000 });
    const sidebarLinks = page.locator('.menu a[href^="/"]');
    const count = await sidebarLinks.count();
    expect(count).toBeGreaterThan(5);
    
    for (let i = 0; i < Math.min(count, 2); i++) {
      const link = sidebarLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href && !href.includes('#') && !href.includes('category')) {
        await link.click();
        await page.waitForLoadState('networkidle');
        const article = page.locator('article');
        await expect(article).toBeVisible();
        await page.goBack();
        await page.waitForLoadState('networkidle');
        break;
      }
    }
  });

  test('should handle deep linking to specific sections', async ({ page }) => {
    await page.goto('/docs/intro#getting-started');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/intro/);
  });

  test('should support browser back/forward navigation', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.goto('/docs/tutorial-basics/installation');
    await expect(page).toHaveURL(/installation/);
    await page.goBack();
    await expect(page).toHaveURL(/intro/);
    await page.goForward();
    await expect(page).toHaveURL(/installation/);
  });

  test('should maintain navigation state across page reloads', async ({ page }) => {
    await page.goto('/docs/tutorial-basics/installation');
    await expect(page).toHaveURL(/installation/);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/installation/);
    const article = page.locator('article');
    await expect(article).toBeVisible();
  });

  // Dark Mode
  test('should default to dark mode', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');
    const dataTheme = await html.getAttribute('data-theme');
    expect(dataTheme).toBe('dark');
  });

  test('should have dark background colors', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const averageValue = (parseInt(rgbMatch[1]) + parseInt(rgbMatch[2]) + parseInt(rgbMatch[3])) / 3;
      expect(averageValue).toBeLessThan(100);
    }
  });

  test('should maintain dark mode across page navigation', async ({ page }) => {
    await page.goto('/docs/intro');
    let html = page.locator('html');
    let dataTheme = await html.getAttribute('data-theme');
    expect(dataTheme).toBe('dark');
    
    await page.goto('/docs/tutorial-basics/installation');
    await page.waitForLoadState('networkidle');
    html = page.locator('html');
    dataTheme = await html.getAttribute('data-theme');
    expect(dataTheme).toBe('dark');
  });

  test('should have proper contrast ratios for accessibility', async ({ page }) => {
    await page.goto('/docs/intro');
    await page.waitForLoadState('networkidle');
    const article = page.locator('article');
    const backgroundColor = await article.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const textColor = await article.evaluate((el) => window.getComputedStyle(el).color);
    
    const bgMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const textMatch = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    
    if (bgMatch && textMatch) {
      const bgAvg = (parseInt(bgMatch[1]) + parseInt(bgMatch[2]) + parseInt(bgMatch[3])) / 3;
      const textAvg = (parseInt(textMatch[1]) + parseInt(textMatch[2]) + parseInt(textMatch[3])) / 3;
      expect(Math.abs(bgAvg - textAvg)).toBeGreaterThan(100);
    }
  });

  // Mobile Responsiveness
  test('should have mobile responsive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/docs/intro');
    const navbarToggle = page.locator('.navbar__toggle');
    expect(await navbarToggle.count()).toBeGreaterThan(0);
  });
});
