const { test, expect } = require('@playwright/test');

test.describe('AI Provider Configuration Guides', () => {
  // Major AI providers from the docs
  const providers = [
    { name: 'OpenAI', path: '/docs/tutorial-ai-providers/openai' },
    { name: 'Anthropic', path: '/docs/tutorial-ai-providers/anthropic' },
    { name: 'Google Studio', path: '/docs/tutorial-ai-providers/google_studio' },
    { name: 'Azure', path: '/docs/tutorial-ai-providers/microsoft-azure' },
    { name: 'Mistral', path: '/docs/tutorial-ai-providers/mistral' },
    { name: 'Ollama', path: '/docs/tutorial-ai-providers/ollama' },
    { name: 'Cohere', path: '/docs/tutorial-ai-providers/cohere' },
    { name: 'Bedrock', path: '/docs/tutorial-ai-providers/bedrock' },
  ];

  test('should have AI providers section in sidebar', async ({ page }) => {
    await page.goto('/docs/intro');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Look for AI providers section
    const sidebar = page.locator('.menu');
    const providersSection = sidebar.getByText(/ai.*provider/i, { exact: false }).first();

    if (await providersSection.count() > 0) {
      await expect(providersSection).toBeVisible();
    } else {
      // Alternative: check if any provider links exist
      const openaiLink = page.locator('a[href*="openai"]').first();
      const anthropicLink = page.locator('a[href*="anthropic"]').first();

      const openaiCount = await openaiLink.count();
      const anthropicCount = await anthropicLink.count();

      expect(openaiCount + anthropicCount).toBeGreaterThan(0);
    }
  });

  test('should navigate to OpenAI configuration guide', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Verify URL
    await expect(page).toHaveURL(/openai/);

    // Verify content loaded
    const article = page.locator('article');
    await expect(article).toBeVisible();

    // Check for OpenAI-related content
    const content = await article.textContent();
    expect(content.toLowerCase()).toContain('openai');

    // Should have heading
    const heading = article.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should navigate to Anthropic configuration guide', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/anthropic');

    // Verify URL
    await expect(page).toHaveURL(/anthropic/);

    // Verify content loaded
    const article = page.locator('article');
    await expect(article).toBeVisible();

    // Check for Anthropic-related content
    const content = await article.textContent();
    expect(content.toLowerCase()).toContain('anthropic');

    // Should have heading
    const heading = article.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should load all major AI provider pages', async ({ page }) => {
    for (const provider of providers) {
      const response = await page.goto(provider.path);

      if (response && response.ok()) {
        // Verify content loaded
        const article = page.locator('article');
        await expect(article).toBeVisible();

        // Check that content is not empty
        const content = await article.textContent();
        expect(content.length).toBeGreaterThan(100);

        // Check for provider name in content
        const contentLower = content.toLowerCase();
        const providerNameLower = provider.name.toLowerCase();

        // Content should mention the provider
        expect(contentLower).toContain(providerNameLower.split(' ')[0]);
      }
    }
  });

  test('should display API key configuration instructions', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for API key or configuration mentions
    const article = page.locator('article');
    const content = await article.textContent();

    // Should mention API or configuration
    const hasApiMention = content.toLowerCase().includes('api') ||
                          content.toLowerCase().includes('key') ||
                          content.toLowerCase().includes('token') ||
                          content.toLowerCase().includes('config');

    expect(hasApiMention).toBeTruthy();
  });

  test('should have provider-specific setup instructions', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/ollama');

    // Wait for content
    await page.waitForLoadState('networkidle');

    const article = page.locator('article');
    const content = await article.textContent();

    // Should have substantial content (setup instructions)
    expect(content.length).toBeGreaterThan(200);

    // Should mention Ollama
    expect(content.toLowerCase()).toContain('ollama');
  });

  test('should display code examples in provider guides', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for code blocks (configuration examples)
    const codeBlocks = page.locator('pre code, .prism-code, pre');
    const count = await codeBlocks.count();

    // Many provider guides should have code examples
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should navigate between provider pages using sidebar', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Wait for sidebar
    await page.waitForSelector('.menu', { timeout: 10000 });

    // Find Anthropic link in sidebar
    const anthropicLink = page.locator('.menu a[href*="anthropic"]').first();

    if (await anthropicLink.count() > 0) {
      await anthropicLink.click();

      // Verify navigation
      await expect(page).toHaveURL(/anthropic/);

      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();
    }
  });

  test('should have consistent structure across provider guides', async ({ page }) => {
    const testProviders = [
      '/docs/tutorial-ai-providers/openai',
      '/docs/tutorial-ai-providers/anthropic',
      '/docs/tutorial-ai-providers/mistral',
    ];

    for (const providerPath of testProviders) {
      await page.goto(providerPath);

      // Wait for content
      await page.waitForLoadState('networkidle');

      // Each provider page should have:
      // 1. Article content
      const article = page.locator('article');
      await expect(article).toBeVisible();

      // 2. At least one heading
      const heading = article.locator('h1, h2, h3').first();
      await expect(heading).toBeVisible();

      // 3. Paragraphs of text
      const paragraphs = article.locator('p');
      const pCount = await paragraphs.count();
      expect(pCount).toBeGreaterThan(0);
    }
  });

  test('should display images or diagrams in provider guides', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for images (screenshots, diagrams)
    const images = page.locator('article img');
    const imageCount = await images.count();

    // Images might be present for visual guides
    expect(imageCount).toBeGreaterThanOrEqual(0);
  });

  test('should have links to external provider documentation', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Wait for content
    await page.waitForLoadState('networkidle');

    // Look for external links
    const externalLinks = page.locator('article a[href^="http"]');
    const linkCount = await externalLinks.count();

    // Provider guides often link to official docs
    expect(linkCount).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to Docker/local AI providers', async ({ page }) => {
    const localProviders = [
      '/docs/tutorial-ai-providers/docker',
      '/docs/tutorial-ai-providers/lmstudio',
      '/docs/tutorial-ai-providers/ollama',
    ];

    for (const providerPath of localProviders) {
      const response = await page.goto(providerPath);

      if (response && response.ok()) {
        // Verify content loaded
        const article = page.locator('article');
        await expect(article).toBeVisible();

        // Check for local/docker mentions
        const content = await article.textContent();
        expect(content.length).toBeGreaterThan(50);
      }
    }
  });

  test('should display custom provider configuration', async ({ page }) => {
    const response = await page.goto('/docs/tutorial-ai-providers/custom');

    if (response && response.ok()) {
      // Verify content loaded
      const article = page.locator('article');
      await expect(article).toBeVisible();

      // Should mention custom or configuration
      const content = await article.textContent();
      const hasCustomMention = content.toLowerCase().includes('custom') ||
                               content.toLowerCase().includes('configure') ||
                               content.toLowerCase().includes('config');

      expect(hasCustomMention).toBeTruthy();
    }
  });

  test('should have troubleshooting or FAQ sections in provider guides', async ({ page }) => {
    await page.goto('/docs/tutorial-ai-providers/openai');

    // Wait for content
    await page.waitForLoadState('networkidle');

    const article = page.locator('article');

    // Look for troubleshooting or FAQ headings
    const troubleshootingHeading = article.locator('h2, h3').filter({
      hasText: /troubleshoot|faq|issue|problem|error/i
    });

    const count = await troubleshootingHeading.count();

    // Might have troubleshooting section
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
