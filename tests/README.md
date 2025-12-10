# Playwright Test Suite for CodeGPT Docs

## Overview

This is a comprehensive Playwright test suite for the CodeGPT documentation site (Docusaurus 2). The test suite covers multilingual functionality, navigation, AI provider guides, search, and dark mode consistency.

## Test Structure

The test suite is organized into 6 main test files:

### 1. Homepage and Documentation Tests (`01-homepage-documentation.spec.js`)
- **10 tests** covering:
  - Homepage loading and redirection
  - Navigation elements (navbar, sidebar, footer)
  - Content display and structure
  - Logo and branding
  - Mobile responsiveness
  - SEO meta tags

### 2. Language Switching Tests (`02-language-switching.spec.js`)
- **12 tests** covering:
  - Language dropdown functionality
  - Switching between 5+ languages (en, es, pt, zh-Hans, fr, ko)
  - Language persistence across navigation
  - Localized content verification
  - Sidebar navigation in different languages
  - Content structure consistency across languages

### 3. Tutorial Navigation Tests (`03-tutorial-navigation.spec.js`)
- **13 tests** covering:
  - Sidebar tutorial sections
  - Navigation to Installation, Configuration, Troubleshooting pages
  - Cookbook examples
  - Tutorial basics and features pages
  - Breadcrumb navigation
  - Next/Previous pagination
  - Code examples display
  - Active state in sidebar
  - Collapsible sections
  - Table of contents
  - Anchor links

### 4. AI Provider Configuration Tests (`04-ai-provider-guides.spec.js`)
- **13 tests** covering:
  - AI providers section in sidebar
  - Individual provider guides (OpenAI, Anthropic, Azure, Mistral, Ollama, etc.)
  - API key configuration instructions
  - Provider-specific setup instructions
  - Code examples in provider guides
  - Navigation between provider pages
  - Consistent structure across provider guides
  - External documentation links
  - Local/Docker AI providers
  - Custom provider configuration

### 5. Search and Navigation Tests (`05-search-navigation.spec.js`)
- **15 tests** covering:
  - Search bar presence and functionality
  - Search modal interaction
  - Keyboard shortcuts (Ctrl+K / Cmd+K)
  - Sidebar link functionality
  - Navbar link functionality
  - Footer link functionality
  - Scroll position maintenance
  - Anchor links in table of contents
  - Deep linking to sections
  - Breadcrumb navigation
  - Pagination navigation
  - 404 page handling
  - External links
  - Browser back/forward navigation

### 6. Dark Mode Tests (`06-dark-mode.spec.js`)
- **16 tests** covering:
  - Default dark mode setting
  - Dark background colors
  - Light text on dark background
  - Color mode switch visibility
  - Dark mode persistence across navigation
  - Dark theme on navbar, sidebar, footer
  - Dark theme on code blocks
  - Contrast ratios for accessibility
  - Dark theme on links
  - Dark theme across different languages
  - Consistent dark theme on all pages
  - Dracula theme for syntax highlighting

## Total Test Coverage

- **79 total tests** across 6 test suites
- Covers all major functionality of the documentation site
- Tests multilingual support for 5+ languages
- Validates dark mode consistency throughout the site
- Ensures navigation and search work correctly
- Verifies AI provider documentation pages

## Running the Tests

### Prerequisites

```bash
npm install
```

### Run all tests (headless)

```bash
npm test
```

### Run tests with browser visible (headed mode)

```bash
npm run test:headed
```

### Run tests with UI mode (interactive)

```bash
npm run test:ui
```

### Run specific test file

```bash
npx playwright test tests/01-homepage-documentation.spec.js
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

## Configuration

The Playwright configuration is defined in `playwright.config.js`:

- **Base URL**: http://localhost:3000
- **Test Directory**: ./tests
- **Browser**: Chromium (Desktop Chrome)
- **Screenshots**: Captured on failure
- **Trace**: Captured on first retry
- **Web Server**: Automatically starts `npm start` before tests

## Test Results

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

## Test Approach

### Resilient Selectors
Tests use multiple selector strategies to handle variations in the Docusaurus structure:
- Role-based selectors (preferred for accessibility)
- Text content selectors
- CSS class selectors
- Attribute selectors

### Graceful Degradation
Tests include conditional checks for optional features:
- Search functionality (might not be configured)
- Breadcrumbs (might not be visible on all pages)
- Table of contents (depends on page structure)
- Language dropdowns (might have different implementations)

### Comprehensive Coverage
Tests verify both:
- **Positive cases**: Expected functionality works
- **Edge cases**: Handling of missing or optional elements
- **Accessibility**: Proper contrast ratios and color schemes
- **Multilingual**: Content structure preserved across languages

## Maintenance

### Updating Tests
When the documentation site structure changes:
1. Update selectors in the affected test files
2. Re-run tests to verify changes
3. Update this README if test scope changes

### Adding New Tests
To add new tests:
1. Create a new `.spec.js` file in the `tests/` directory
2. Follow the naming convention: `XX-feature-name.spec.js`
3. Use descriptive test names and group related tests in `describe` blocks
4. Update this README to document the new tests

## Common Issues

### Test Timeouts
If tests timeout, increase the timeout in `playwright.config.js` or individual test files:
```javascript
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Selector Not Found
If selectors change, update them in the test files. Use Playwright's codegen tool to generate new selectors:
```bash
npx playwright codegen http://localhost:3000
```

### Dev Server Issues
If the dev server doesn't start, manually start it before running tests:
```bash
npm start
# In another terminal:
npm test
```

## CI/CD Integration

These tests are designed to run in CI/CD pipelines. Example GitHub Actions workflow:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Contributing

When contributing new tests:
1. Ensure tests are independent and can run in any order
2. Clean up any test data or state after tests complete
3. Use meaningful test descriptions
4. Include comments for complex test logic
5. Follow the existing test patterns and structure

## Support

For issues with the test suite:
1. Check the Playwright documentation: https://playwright.dev
2. Review test failures in the HTML report
3. Run tests in debug mode to investigate failures
4. Check the CodeGPT documentation: https://docs.codegpt.co

## License

This test suite is part of the CodeGPT documentation project.
