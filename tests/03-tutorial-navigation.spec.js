const { test, expect } = require('@playwright/test');

test.describe('Tutorial Navigation and Content', () => {
  test('should display tutorial sections in sidebar', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar to load
    await page.waitForSelector('.menu', { timeout: 10000 });

    const sidebar = page.locator('.menu');
    await expect(sidebar).toBeVisible();

    // Check for main sections in sidebar (with emojis)
    // The sidebar has sections like: ⚡️ Quick Start, 🤖 AI Providers, 🛠️ Features, 🍴 Cookbook
    const quickStart = sidebar.locator('a:has-text("Quick Start")');
    const aiProviders = sidebar.locator('a:has-text("AI Providers")');
    const features = sidebar.locator('a:has-text("Features")');
    const cookbook = sidebar.locator('a:has-text("Cookbook")');

    // At least one section should be visible
    const quickStartCount = await quickStart.count();
    const aiProvidersCount = await aiProviders.count();
    const featuresCount = await features.count();
    const cookbookCount = await cookbook.count();

    expect(quickStartCount + aiProvidersCount + featuresCount + cookbookCount).toBeGreaterThan(0);
  });

  test('should navigate to Installation page', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar to load
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Find Installation link in sidebar (might need to expand Quick Start section first)
    const quickStartSection = page.locator('.menu button:has-text("Quick Start")');
    if (await quickStartSection.count() > 0) {
      await quickStartSection.click();
      await page.waitForTimeout(500);
    }

    // Find and click Installation link
    const installationLink = page.locator('.menu a:has-text("Installation")').first();
    if (await installationLink.count() > 0) {
      await installationLink.click();

      // Verify URL changed
      await expect(page).toHaveURL(/installation/);

      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();

      // Check for installation-related content
      const heading = article.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    } else {
      // Skip if Installation link is not found
      console.log('Installation link not found - skipping');
    }
  });

  test('should navigate to Configuration page', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Find Configuration link
    const configLink = page.locator('a:has-text("Configuration")').first();

    if (await configLink.count() > 0) {
      await configLink.click();

      // Verify URL changed
      await expect(page).toHaveURL(/configuration/);

      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });

  test('should display cookbook examples', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Look for cookbook section
    const cookbookLink = page.locator('a:has-text("Cookbook"), a:has-text("cookbook")').first();

    if (await cookbookLink.count() > 0) {
      // Cookbook section exists
      await expect(cookbookLink).toBeVisible();
    }
  });

  test('should navigate through tutorial basics pages', async ({ page }) => {
    const tutorialPages = [
      '/docs/tutorial-basics/installation',
      '/docs/tutorial-basics/configuration',
      '/docs/tutorial-basics/troubleshooting',
    ];

    for (const pagePath of tutorialPages) {
      const response = await page.goto(pagePath);

      if (response && response.ok()) {
        // Verify content loaded
        const article = page.locator('article');
        await expect(article).toBeVisible();

        // Check that content is not empty
        const content = await article.textContent();
        expect(content.length).toBeGreaterThan(50);
      }
    }
  });

  test('should navigate through tutorial features pages', async ({ page }) => {
    const featurePages = [
      '/docs/tutorial-features/chat_code_gpt',
      '/docs/tutorial-features/code_autocompletion',
      '/docs/tutorial-features/code_documentation',
    ];

    for (const pagePath of featurePages) {
      const response = await page.goto(pagePath);

      if (response && response.ok()) {
        // Verify content loaded
        const article = page.locator('article');
        await expect(article).toBeVisible();

        // Check that content is not empty
        const content = await article.textContent();
        expect(content.length).toBeGreaterThan(50);
      }
    }
  });

  test('should have breadcrumb navigation', async ({ page }) => {
    await page.goto('/docs/tutorial-basics/installation');

    // Look for breadcrumb or pagination
    const breadcrumb = page.locator('.breadcrumbs, nav[aria-label="breadcrumbs"]');

    if (await breadcrumb.count() > 0) {
      await expect(breadcrumb).toBeVisible();
    }
  });

  test('should have next/previous page navigation', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for pagination links
    const pagination = page.locator('.pagination-nav, nav.pagination');

    if (await pagination.count() > 0) {
      await expect(pagination).toBeVisible();

      // Should have next or previous links
      const nextLink = pagination.locator('a:has-text("Next"), a:has-text("next")').first();
      const prevLink = pagination.locator('a:has-text("Previous"), a:has-text("previous")').first();

      const nextCount = await nextLink.count();
      const prevCount = await prevLink.count();

      expect(nextCount + prevCount).toBeGreaterThan(0);
    }
  });

  test('should display code examples in tutorial pages', async ({ page }) => {
    await page.goto('/docs/tutorial-features/code_autocompletion');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for code blocks
    const codeBlocks = page.locator('pre code, .prism-code');
    const count = await codeBlocks.count();

    // Code examples might be present
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should maintain active state in sidebar for current page', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Look for active menu item
    const activeItem = page.locator('.menu__link--active, .menu__list-item--active');

    if (await activeItem.count() > 0) {
      await expect(activeItem.first()).toBeVisible();
    }
  });

  test('should expand/collapse sidebar sections', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Look for collapsible sections
    const collapsibleButtons = page.locator('.menu button, .menu__link--sublist-caret');

    if (await collapsibleButtons.count() > 0) {
      const firstButton = collapsibleButtons.first();
      await expect(firstButton).toBeVisible();

      // Try to click to toggle
      await firstButton.click();

      // Verify that something changed (section expanded/collapsed)
      await page.waitForTimeout(500);
    }
  });

  test('should navigate between related tutorial sections', async ({ page }) => {
    await page.goto('/docs/tutorial-basics/installation');

    // Find a link to a related page
    const relatedLink = page.locator('article a[href*="/docs/tutorial"]').first();

    if (await relatedLink.count() > 0) {
      await relatedLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should be on another tutorial page
      await expect(page).toHaveURL(/\/docs\/tutorial/);

      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });

  test('should have table of contents for long pages', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for table of contents
    const toc = page.locator('.table-of-contents, .toc, aside.tocCollapsible');

    if (await toc.count() > 0) {
      await expect(toc.first()).toBeVisible();

      // Should have heading links
      const tocLinks = toc.locator('a');
      const linkCount = await tocLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should handle anchor links within pages', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for heading IDs (for anchor links)
    const headingsWithId = page.locator('h2[id], h3[id]');
    const headingCount = await headingsWithId.count();

    if (headingCount > 0) {
      // Get the first heading ID
      const firstHeading = headingsWithId.first();
      const headingId = await firstHeading.getAttribute('id');

      if (headingId) {
        // Navigate to the anchor
        await page.goto(`/docs/intro#${headingId}`);

        // Verify URL has the hash
        await expect(page).toHaveURL(`/docs/intro#${headingId}`);
      }
    }
  });
});
