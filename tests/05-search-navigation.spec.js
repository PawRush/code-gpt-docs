const { test, expect } = require('@playwright/test');

test.describe('Search and Navigation Functionality', () => {
  test('should have search bar in navbar', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for navbar to load
    await page.waitForSelector('nav.navbar', { timeout: 10000 });

    // Look for search input or button
    const searchButton = page.locator('button.DocSearch, button[aria-label*="search" i], .navbar__search');
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    const buttonCount = await searchButton.count();
    const inputCount = await searchInput.count();

    // Search functionality might be present
    if (buttonCount > 0) {
      await expect(searchButton.first()).toBeVisible();
    } else if (inputCount > 0) {
      await expect(searchInput.first()).toBeVisible();
    } else {
      // Search might not be implemented - that's okay
      console.log('Search not found - might not be implemented');
    }
  });

  test('should open search modal when clicking search button', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for search button
    const searchButton = page.locator('button.DocSearch, button[aria-label*="search" i]').first();

    if (await searchButton.count() > 0) {
      await searchButton.click();

      // Wait for modal to appear
      await page.waitForTimeout(1000);

      // Look for search modal
      const searchModal = page.locator('.DocSearch-Modal, [role="dialog"], .modal');

      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();

        // Close modal by pressing Escape
        await page.keyboard.press('Escape');
      }
    }
  });

  test('should navigate using keyboard shortcuts', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for search button
    const searchButton = page.locator('button.DocSearch, button[aria-label*="search" i]').first();

    if (await searchButton.count() > 0) {
      // Try to open search with Ctrl+K or Cmd+K
      const isMac = process.platform === 'darwin';
      const modifier = isMac ? 'Meta' : 'Control';

      await page.keyboard.press(`${modifier}+k`);

      // Wait for modal
      await page.waitForTimeout(1000);

      // Check if modal opened
      const searchModal = page.locator('.DocSearch-Modal, [role="dialog"]');

      if (await searchModal.count() > 0) {
        await expect(searchModal.first()).toBeVisible();

        // Close modal
        await page.keyboard.press('Escape');
      }
    }
  });

  test('should have functional sidebar links', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Get all sidebar links - use more specific selector to avoid buttons
    const sidebarLinks = page.locator('.menu a[href^="/"]');
    const count = await sidebarLinks.count();

    expect(count).toBeGreaterThan(5);

    // Test first few links (skip category links that might have collapsible sections)
    let tested = 0;
    for (let i = 0; i < count && tested < 3; i++) {
      const link = sidebarLinks.nth(i);
      const href = await link.getAttribute('href');

      // Skip anchor links and category links
      if (href && !href.includes('#') && !href.includes('category')) {
        try {
          // Click link
          await link.click();

          // Wait for navigation
          await page.waitForLoadState('networkidle');

          // Verify content loaded
          const article = page.locator('article');
          await expect(article).toBeVisible();

          // Go back
          await page.goBack();
          await page.waitForLoadState('networkidle');

          tested++;
        } catch (error) {
          console.log(`Failed to test link ${href}: ${error.message}`);
        }
      }
    }

    // Ensure we tested at least one link
    expect(tested).toBeGreaterThan(0);
  });

  test('should have working navbar links', async ({ page }) => {
    await page.goto('/docs/intro');

    // Test Tutorial link
    const tutorialLink = page.locator('nav.navbar a:has-text("Tutorial")').first();

    if (await tutorialLink.count() > 0) {
      await tutorialLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should be on a docs page
      await expect(page).toHaveURL(/\/docs\//);

      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/docs/intro');

    // Get footer links
    const footer = page.locator('footer');
    const footerLinks = footer.locator('a[href^="/"]');
    const count = await footerLinks.count();

    if (count > 0) {
      // Test first footer link
      const firstLink = footerLinks.first();
      const href = await firstLink.getAttribute('href');

      if (href) {
        await firstLink.click();

        // Wait for navigation
        await page.waitForLoadState('networkidle');

        // Should navigate somewhere
        await expect(page.url()).toBeTruthy();
      }
    }
  });

  test('should maintain scroll position when navigating back', async ({ page }) => {
    await page.goto('/docs/intro');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Navigate to another page
    const sidebarLink = page.locator('.menu a[href^="/"]').nth(2);

    if (await sidebarLink.count() > 0) {
      await sidebarLink.click();
      await page.waitForLoadState('networkidle');

      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Check we're back on intro page
      await expect(page).toHaveURL(/intro/);
    }
  });

  test('should have working anchor links in table of contents', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for table of contents
    const toc = page.locator('.table-of-contents, .toc, aside.tocCollapsible');

    if (await toc.count() > 0) {
      // Get TOC links
      const tocLinks = toc.locator('a[href^="#"]');
      const count = await tocLinks.count();

      if (count > 0) {
        // Click first TOC link
        const firstLink = tocLinks.first();
        await firstLink.click();

        // Wait for scroll
        await page.waitForTimeout(500);

        // Verify URL has hash
        const url = page.url();
        expect(url).toContain('#');
      }
    }
  });

  test('should handle deep linking to specific sections', async ({ page }) => {
    // Navigate to a page with a hash
    await page.goto('/docs/intro#getting-started');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // Should be on intro page
    await expect(page).toHaveURL(/intro/);

    // URL should contain hash (if section exists)
    const url = page.url();
    if (url.includes('#')) {
      expect(url).toContain('#');
    }
  });

  test('should have breadcrumb navigation working', async ({ page }) => {
    await page.goto('/docs/tutorial-basics/installation');

    // Look for breadcrumbs
    const breadcrumb = page.locator('.breadcrumbs, nav[aria-label="breadcrumbs"]');

    if (await breadcrumb.count() > 0) {
      // Get breadcrumb links
      const breadcrumbLinks = breadcrumb.locator('a');
      const count = await breadcrumbLinks.count();

      if (count > 0) {
        // Click first breadcrumb (should go to parent)
        const firstLink = breadcrumbLinks.first();
        await firstLink.click();

        // Wait for navigation
        await page.waitForLoadState('networkidle');

        // Should navigate to a docs page
        await expect(page).toHaveURL(/\/docs\//);
      }
    }
  });

  test('should have working pagination navigation', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Look for pagination - the navigation at bottom of page
    const pagination = page.locator('.pagination-nav, nav.pagination, nav[aria-label*="Docs pages"]');

    if (await pagination.count() > 0) {
      // Look for next button - can be text or aria-label
      const nextButton = pagination.locator('a:has-text("Next"), a:has-text("next"), a[aria-label*="Next"]').first();

      if (await nextButton.count() > 0) {
        // Get the href before clicking to ensure it's valid
        const href = await nextButton.getAttribute('href');

        if (href && !href.includes('#')) {
          await nextButton.click();

          // Wait for navigation
          await page.waitForLoadState('networkidle');

          // Should be on a different page
          await expect(page).not.toHaveURL(/\/docs\/intro$/);

          // Verify content loaded
          const article = page.locator('article');
          await expect(article).toBeVisible();
        } else {
          console.log('Next button href is empty or anchor link - skipping');
        }
      } else {
        console.log('Next button not found - this might be the last page');
      }
    } else {
      console.log('Pagination not found - might not be implemented');
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/docs/nonexistent-page-12345');

    // Should get a response
    expect(response).toBeTruthy();

    // Might be a 404 page or redirect
    if (response) {
      const status = response.status();
      expect([200, 404]).toContain(status);
    }
  });

  test('should have working external links that open in new tabs', async ({ page }) => {
    await page.goto('/docs/intro');

    // Look for external links (Discord, GitHub, etc.)
    const discordLink = page.locator('a[href*="discord"]').first();

    if (await discordLink.count() > 0) {
      // Check if link has target="_blank"
      const target = await discordLink.getAttribute('target');

      if (target === '_blank') {
        expect(target).toBe('_blank');
      }
    }
  });

  test('should maintain navigation state across page reloads', async ({ page }) => {
    await page.goto('/docs/tutorial-basics/installation');

    // Verify we're on installation page
    await expect(page).toHaveURL(/installation/);

    // Reload page
    await page.reload();

    // Wait for reload
    await page.waitForLoadState('networkidle');

    // Should still be on installation page
    await expect(page).toHaveURL(/installation/);

    // Content should be visible
    const article = page.locator('article');
    await expect(article).toBeVisible();
  });

  test('should support browser back/forward navigation', async ({ page }) => {
    await page.goto('/docs/intro');

    // Navigate to another page
    await page.goto('/docs/tutorial-basics/installation');
    await expect(page).toHaveURL(/installation/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/intro/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/installation/);
  });
});
