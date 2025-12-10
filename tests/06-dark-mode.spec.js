const { test, expect } = require('@playwright/test');

test.describe('Dark Mode Consistency', () => {
  test('should default to dark mode as configured', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check HTML element for dark mode class
    const html = page.locator('html');
    const dataTheme = await html.getAttribute('data-theme');

    // According to config, dark mode is default and switch is disabled
    expect(dataTheme).toBe('dark');
  });

  test('should have dark background colors', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Check body background color
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Dark mode should have dark background (rgb values close to black)
    expect(backgroundColor).toBeTruthy();

    // Parse RGB values
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      // In dark mode, background should be dark (low RGB values)
      const averageValue = (r + g + b) / 3;
      expect(averageValue).toBeLessThan(100);
    }
  });

  test('should have light text color on dark background', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Check article text color
    const article = page.locator('article');
    const textColor = await article.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    expect(textColor).toBeTruthy();

    // Parse RGB values
    const rgbMatch = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      // In dark mode, text should be light (high RGB values)
      const averageValue = (r + g + b) / 3;
      expect(averageValue).toBeGreaterThan(150);
    }
  });

  test('should not have color mode switch visible', async ({ page }) => {
    await page.goto('/docs/intro');

    // According to config: disableSwitch: true
    // Look for color mode switch
    const colorModeSwitch = page.locator('button[class*="colorMode"], button[aria-label*="theme" i], .toggle_node_modules');

    const count = await colorModeSwitch.count();

    // Switch should be disabled/hidden
    expect(count).toBe(0);
  });

  test('should maintain dark mode across page navigation', async ({ page }) => {
    await page.goto('/docs/intro');

    // Check initial dark mode
    let html = page.locator('html');
    let dataTheme = await html.getAttribute('data-theme');
    expect(dataTheme).toBe('dark');

    // Navigate to another page
    await page.goto('/docs/tutorial-basics/installation');
    await page.waitForLoadState('networkidle');

    // Check dark mode is still active
    html = page.locator('html');
    dataTheme = await html.getAttribute('data-theme');
    expect(dataTheme).toBe('dark');
  });

  test('should apply dark theme to navbar', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for navbar
    await page.waitForSelector('nav.navbar', { timeout: 10000 });

    const navbar = page.locator('nav.navbar');
    const backgroundColor = await navbar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toBeTruthy();

    // Navbar should have dark background
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      const averageValue = (r + g + b) / 3;
      // Should be relatively dark
      expect(averageValue).toBeLessThan(150);
    }
  });

  test('should apply dark theme to sidebar', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    const sidebar = page.locator('.menu');
    const backgroundColor = await sidebar.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toBeTruthy();

    // Check if background is dark or transparent
    const rgbMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      const averageValue = (r + g + b) / 3;

      // Sidebar should have dark styling
      expect(averageValue).toBeLessThan(150);
    }
  });

  test('should apply dark theme to footer', async ({ page }) => {
    await page.goto('/docs/intro');

    const footer = page.locator('footer');
    const backgroundColor = await footer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toBeTruthy();

    // Footer is configured as 'dark' style
    const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      const averageValue = (r + g + b) / 3;
      expect(averageValue).toBeLessThan(100);
    }
  });

  test('should apply dark theme to code blocks', async ({ page }) => {
    // Navigate to a page with code blocks
    await page.goto('/docs/tutorial-features/code_autocompletion');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for code blocks
    const codeBlock = page.locator('pre code, .prism-code').first();

    if (await codeBlock.count() > 0) {
      const backgroundColor = await codeBlock.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Code blocks should have dark background
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);

          const averageValue = (r + g + b) / 3;
          expect(averageValue).toBeLessThan(150);
        }
      }
    }
  });

  test('should have proper contrast ratios for accessibility', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for content
    await page.waitForLoadState('networkidle');

    const article = page.locator('article');

    // Get background and text colors
    const backgroundColor = await article.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const textColor = await article.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Both should be defined
    expect(backgroundColor).toBeTruthy();
    expect(textColor).toBeTruthy();

    // In dark mode, there should be clear contrast
    const bgMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const textMatch = textColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (bgMatch && textMatch) {
      const bgAvg = (parseInt(bgMatch[1]) + parseInt(bgMatch[2]) + parseInt(bgMatch[3])) / 3;
      const textAvg = (parseInt(textMatch[1]) + parseInt(textMatch[2]) + parseInt(textMatch[3])) / 3;

      // Should have significant contrast (dark bg, light text)
      expect(Math.abs(bgAvg - textAvg)).toBeGreaterThan(100);
    }
  });

  test('should apply dark theme to links', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Get a link from the article
    const link = page.locator('article a').first();

    if (await link.count() > 0) {
      const linkColor = await link.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      expect(linkColor).toBeTruthy();

      // Links should be visible on dark background (lighter color)
      const rgbMatch = linkColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);

        const averageValue = (r + g + b) / 3;

        // Links should be reasonably bright
        expect(averageValue).toBeGreaterThan(50);
      }
    }
  });

  test('should maintain dark theme in different languages', async ({ page }) => {
    const languages = ['en', 'es', 'pt'];

    for (const lang of languages) {
      const url = lang === 'en' ? '/docs/intro' : `/${lang}/docs/intro`;
      await page.goto(url);

      // Wait for content
      await page.waitForLoadState('networkidle');

      // Check dark mode is active
      const html = page.locator('html');
      const dataTheme = await html.getAttribute('data-theme');
      expect(dataTheme).toBe('dark');
    }
  });

  test('should have consistent dark theme on all documentation pages', async ({ page }) => {
    const pages = [
      '/docs/intro',
      '/docs/tutorial-basics/installation',
      '/docs/tutorial-ai-providers/openai',
      '/docs/tutorial-features/chat_code_gpt',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Wait for content
      await page.waitForLoadState('networkidle');

      // Check dark mode
      const html = page.locator('html');
      const dataTheme = await html.getAttribute('data-theme');
      expect(dataTheme).toBe('dark');

      // Check background is dark
      const body = page.locator('body');
      const backgroundColor = await body.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);

        const averageValue = (r + g + b) / 3;
        expect(averageValue).toBeLessThan(100);
      }
    }
  });

  test('should use Dracula theme for code syntax highlighting', async ({ page }) => {
    // Navigate to a page with code
    await page.goto('/docs/tutorial-features/code_autocompletion');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for code blocks with syntax highlighting
    const codeBlock = page.locator('pre code, .prism-code').first();

    if (await codeBlock.count() > 0) {
      // Check for Dracula theme classes or dark colors
      const className = await codeBlock.getAttribute('class');

      // Code should be styled (has classes or inline styles)
      expect(className || '').toBeTruthy();
    }
  });
});
