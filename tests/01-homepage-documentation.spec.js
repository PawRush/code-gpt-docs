const { test, expect } = require('@playwright/test');

test.describe('Homepage and Main Documentation', () => {
  test('should load homepage and redirect to docs', async ({ page }) => {
    await page.goto('/');

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Should redirect to /docs/intro
    await expect(page).toHaveURL(/\/docs\/intro/);

    // Verify page title
    await expect(page).toHaveTitle(/CodeGPT/);
  });

  test('should display main navigation elements', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for navbar to load
    await page.waitForLoadState('networkidle');

    // Check navbar elements
    const navbar = page.locator('nav.navbar');
    await expect(navbar).toBeVisible();

    // Check for Tutorial link - may be exact text match required
    const tutorialLink = page.locator('nav.navbar a:has-text("Tutorial")');
    await expect(tutorialLink).toBeVisible();

    // Check for Extension link
    const extensionLink = page.locator('nav.navbar a:has-text("Extension")');
    await expect(extensionLink).toBeVisible();

    // Check for Discord link
    const discordLink = page.locator('nav.navbar a:has-text("Discord")');
    await expect(discordLink).toBeVisible();

    // Check for Login link
    const loginLink = page.locator('nav.navbar a:has-text("Login")');
    await expect(loginLink).toBeVisible();
  });

  test('should display intro documentation content', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for content to load
    await page.waitForSelector('article', { timeout: 10000 });

    // Check main content area
    const article = page.locator('article');
    await expect(article).toBeVisible();

    // Verify header is present
    const heading = article.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Check that content is not empty
    const content = await article.textContent();
    expect(content.length).toBeGreaterThan(100);
  });

  test('should have functional sidebar navigation', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar to be visible
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Check sidebar is present
    const sidebar = page.locator('.menu');
    await expect(sidebar).toBeVisible();

    // Verify sidebar has links
    const sidebarLinks = sidebar.locator('a');
    const count = await sidebarLinks.count();
    expect(count).toBeGreaterThan(5);
  });

  test('should display footer with correct links', async ({ page }) => {
    await page.goto('/docs/intro');

    // Check footer is present
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify footer has links
    await expect(footer.getByText(/docs/i)).toBeVisible();
    await expect(footer.getByText(/community/i)).toBeVisible();

    // Check copyright
    await expect(footer.getByText(/copyright/i)).toBeVisible();
  });

  test('should have working logo link', async ({ page }) => {
    await page.goto('/docs/intro');

    // Find logo link
    const logoLink = page.locator('a.navbar__brand');
    await expect(logoLink).toBeVisible();

    // Verify logo image
    const logoImg = logoLink.locator('img');
    await expect(logoImg).toBeVisible();
    await expect(logoImg).toHaveAttribute('alt', 'CodeGPT');
  });

  test('should display documentation content in multiple sections', async ({ page }) => {
    await page.goto('/docs/intro');

    // Check that the page has structured content
    const article = page.locator('article');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Verify paragraphs exist
    const paragraphs = article.locator('p');
    const pCount = await paragraphs.count();
    expect(pCount).toBeGreaterThan(0);
  });

  test('should have mobile responsive navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/docs/intro');

    // On mobile, there should be a navbar toggle
    const navbarToggle = page.locator('.navbar__toggle');

    // Check if toggle exists (it should on mobile)
    const toggleCount = await navbarToggle.count();
    expect(toggleCount).toBeGreaterThan(0);
  });

  test('should navigate to installation page from sidebar', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Find and click installation link
    const installLink = page.locator('.menu a:has-text("Installation")').first();
    if (await installLink.count() > 0) {
      await installLink.click();

      // Verify URL changed
      await expect(page).toHaveURL(/installation/);

      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/docs/intro');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);

    // Check og:title
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    }
  });
});
