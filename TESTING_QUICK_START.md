# Playwright Testing Quick Start Guide

## CodeGPT Docs Test Suite

This guide will help you quickly run the Playwright test suite for the CodeGPT documentation site.

---

## Prerequisites

Make sure you have:
- Node.js 16.14 or higher
- npm installed

---

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

This installs all project dependencies including Playwright.

### 2. Install Browser

```bash
npx playwright install chromium
```

This downloads the Chromium browser for testing.

### 3. Run Tests

```bash
npm test
```

Tests will run automatically. The dev server will start automatically if not already running.

---

## Viewing Test Results

After tests complete, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive HTML report in your browser showing:
- Test results (passed/failed)
- Screenshots of failures
- Test execution traces
- Detailed error messages

---

## Common Commands

### Run all tests (headless)
```bash
npm test
```

### Run tests with browser visible
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run specific test file
```bash
npx playwright test tests/01-homepage-documentation.spec.js
```

### Run tests matching a pattern
```bash
npx playwright test --grep "dark mode"
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Generate code for new tests
```bash
npx playwright codegen http://localhost:3000
```

---

## Test Suites Overview

| Suite | File | Tests | Coverage |
|-------|------|-------|----------|
| Homepage | `01-homepage-documentation.spec.js` | 10 | Homepage, navigation, SEO |
| Languages | `02-language-switching.spec.js` | 12 | 5+ languages (en, es, pt, zh-Hans, fr, ko) |
| Tutorials | `03-tutorial-navigation.spec.js` | 13 | Tutorial pages, navigation |
| AI Providers | `04-ai-provider-guides.spec.js` | 13 | 15+ provider guides |
| Search | `05-search-navigation.spec.js` | 15 | Search, navigation, links |
| Dark Mode | `06-dark-mode.spec.js` | 16 | Dark theme consistency |
| **TOTAL** | **6 files** | **79** | **Complete coverage** |

---

## Troubleshooting

### Dev Server Not Starting

If tests fail because the dev server won't start:

```bash
# Terminal 1: Start dev server manually
npm start

# Terminal 2: Run tests
npm test
```

### Browser Not Installed

If you see "browser not found" error:

```bash
npx playwright install chromium
```

### Test Timeouts

If tests timeout, you can increase timeout in individual tests or config:

```javascript
// In test file
test.setTimeout(60000); // 60 seconds
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Then run tests
npm test
```

### Selector Not Found Errors

If tests fail due to selectors not found:

1. Open the page manually: http://localhost:3000
2. Use Playwright Inspector to find correct selectors:
   ```bash
   npx playwright codegen http://localhost:3000
   ```
3. Update the selector in the test file

---

## Running Specific Test Categories

### Run only homepage tests
```bash
npx playwright test tests/01-homepage-documentation.spec.js
```

### Run only language tests
```bash
npx playwright test tests/02-language-switching.spec.js
```

### Run only dark mode tests
```bash
npx playwright test tests/06-dark-mode.spec.js
```

### Run tests by pattern
```bash
# Run all tests with "navigation" in the name
npx playwright test --grep navigation

# Run all tests with "Spanish" or "language"
npx playwright test --grep "Spanish|language"
```

---

## Understanding Test Results

### Test Output

```
Running 79 tests using 6 workers

  ✓ [chromium] › 01-homepage-documentation.spec.js:4:3 › should load homepage (2.1s)
  ✗ [chromium] › 02-language-switching.spec.js:14:3 › should switch to Spanish (3.4s)

  18 passed (2.5m)
  61 failed (2.5m)
```

- ✓ = Test passed
- ✗ = Test failed
- Time in parentheses = Test duration

### HTML Report

The HTML report shows:
- **Overview**: Summary of passed/failed tests
- **Test Details**: Click any test to see details
- **Screenshots**: Visual evidence of failures
- **Traces**: Step-by-step execution trace
- **Console Logs**: Browser console output

---

## Debugging Failed Tests

### Method 1: View HTML Report
```bash
npx playwright show-report
```
Click on failed test to see:
- Screenshot at failure point
- Error message
- Stack trace

### Method 2: Run in Debug Mode
```bash
npx playwright test --debug tests/01-homepage-documentation.spec.js
```
This opens Playwright Inspector where you can:
- Step through test execution
- Inspect page elements
- See network requests
- Pause and resume

### Method 3: Run in Headed Mode
```bash
npm run test:headed
```
Watch the browser execute tests in real-time.

### Method 4: Generate Code
```bash
npx playwright codegen http://localhost:3000
```
Record interactions to generate test code.

---

## Updating Tests

### When selectors change

1. Find the failing test in the HTML report
2. Note the selector that failed
3. Use codegen to find the new selector:
   ```bash
   npx playwright codegen http://localhost:3000
   ```
4. Update the selector in the test file
5. Re-run the test

### Adding new tests

1. Create new test file or add to existing file:
   ```javascript
   test('should verify new feature', async ({ page }) => {
     await page.goto('/docs/new-page');
     await expect(page.locator('.new-element')).toBeVisible();
   });
   ```
2. Run the new test:
   ```bash
   npx playwright test tests/your-file.spec.js
   ```

---

## CI/CD Integration

Tests are configured to run in GitHub Actions automatically on push/PR.

View the workflow file: `.github/workflows/playwright.yml`

To run tests locally as they would run in CI:
```bash
CI=true npm test
```

---

## Performance Tips

### Run tests in parallel (default)
```bash
npm test
```

### Run tests in serial (one at a time)
```bash
npx playwright test --workers=1
```

### Run only changed files
```bash
npx playwright test --only-changed
```

### Run tests with specific timeout
```bash
npx playwright test --timeout=10000
```

---

## Test Configuration

Configuration is in `playwright.config.js`:

```javascript
{
  baseURL: 'http://localhost:3000',
  testDir: './tests',
  workers: 6,                    // Parallel workers
  retries: 0,                    // Retry failed tests
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  }
}
```

---

## Next Steps

1. **Run the tests**: `npm test`
2. **View results**: `npx playwright show-report`
3. **Fix failures**: Update selectors as needed
4. **Add new tests**: For new features
5. **Integrate CI**: Tests run automatically on GitHub

---

## Getting Help

- **Playwright Docs**: https://playwright.dev
- **Test Suite README**: See `tests/README.md`
- **Full Summary**: See `PLAYWRIGHT_TESTS_SUMMARY.md`
- **CodeGPT Docs**: https://docs.codegpt.co

---

## Cheat Sheet

```bash
# Install
npm install

# Install browser
npx playwright install chromium

# Run tests
npm test                        # Headless (default)
npm run test:headed             # With browser visible
npm run test:ui                 # Interactive UI mode

# Debug
npx playwright test --debug     # Debug mode
npx playwright codegen          # Generate code
npx playwright show-report      # View HTML report

# Specific tests
npx playwright test tests/01-homepage-documentation.spec.js
npx playwright test --grep "dark mode"

# CI mode
CI=true npm test
```

---

**Quick Start Version**: 1.0
**Last Updated**: December 9, 2025

Happy Testing! 🎭
