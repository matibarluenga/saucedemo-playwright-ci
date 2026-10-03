# SauceDemo – Playwright E2E Test Suite

[![Playwright Tests](https://github.com/matibarluenga/saucedemo-playwright-ci/actions/workflows/playwright.yml/badge.svg)](https://github.com/matibarluenga/saucedemo-playwright-ci/actions/workflows/playwright.yml)

**[View the latest test report](https://matibarluenga.github.io/saucedemo-playwright-ci/)**: HTML report of the last run on `main`, published to GitHub Pages.

End-to-end UI test automation for [SauceDemo](https://www.saucedemo.com), a demo e-commerce site by Sauce Labs. The suite covers authentication and the full purchase flow, and runs automatically on GitHub Actions on every push and pull request.

## Tech stack

- [Playwright](https://playwright.dev) with TypeScript
- GitHub Actions for continuous integration
- Chromium (Desktop Chrome profile)

## Test coverage

**8 tests** across two feature files.

### Login – `tests/ui/login.spec.ts`

| Scenario                     | Expected result                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| Successful login             | Redirects to the inventory page and shows the "Products" title                        |
| Invalid password             | Stays on the login page with a "do not match any user" error                          |
| Empty password               | Stays on the login page with "Password is required"                                   |
| Empty username               | Stays on the login page with "Username is required"                                   |
| Non-existent username        | Stays on the login page with a "do not match any user" error                          |
| Locked out user              | Stays on the login page with "Sorry, this user has been locked out."                  |
| Protected page without login | Accessing `/inventory.html` directly redirects to the login page with an access error |

The locked out scenario uses the user's valid password on purpose: SauceDemo validates credentials before checking the lockout, so an invalid password would return a credentials error and the lockout would never be tested.

### Purchase flow – `tests/ui/checkout.spec.ts`

A single end-to-end test that goes from login to order confirmation:

1. Logs in and verifies the cart starts empty
2. Stores the product price from the inventory and adds the product to the cart
3. Verifies the cart badge, the "Remove" button, and that the product and price appear in the cart
4. Completes the checkout information form
5. Verifies on the overview page that the price still matches the inventory, the payment, shipping and total sections are shown, and the item total includes the product price
6. Finishes the purchase and verifies the confirmation page and the "Thank you for your order!" message

The price is captured once and compared across the inventory, cart and overview pages to detect inconsistencies between screens.

## Project structure

```
.
├── .github/workflows/playwright.yml   # CI pipeline
├── tests/
│   └── ui/
│       ├── login.spec.ts              # Authentication scenarios
│       └── checkout.spec.ts           # End-to-end purchase flow
├── playwright.config.ts               # Base URL, test id attribute, browsers, retries
├── .gitattributes                     # Line ending normalization (LF)
└── tsconfig.json
```

Tests are grouped by type in folders (`ui/`) and by feature in files (`<feature>.spec.ts`), so new test types such as API tests can be added in their own folder.

## Test design decisions

- **Locators:** elements are located with `getByTestId`, mapped to SauceDemo's `data-test` attributes in `playwright.config.ts`. A CSS class is used only where the site does not expose a `data-test` attribute (the cart item container).
- **Assertions:** negative login tests assert that the user stays on the login page and that the exact error message is displayed. The error message is the assertion that proves the login was rejected.
- **Isolation:** each test runs in a fresh browser context, so tests do not share session or cart state and can run in any order.

## Running locally

Requirements: Node.js (LTS) and npm.

```bash
git clone https://github.com/matibarluenga/saucedemo-playwright-ci.git
cd saucedemo-playwright-ci
npm ci
npx playwright install chromium
npx playwright test
```

Open the HTML report of the last run:

```bash
npx playwright show-report
```

## Continuous integration

The workflow in `.github/workflows/playwright.yml` runs on every push and pull request to `main`, and can also be started manually from the Actions tab (**Run workflow**).

The pipeline:

1. Runs on a pinned `ubuntu-24.04` runner for reproducible builds
2. Installs dependencies with `npm ci` and the Chromium browser
3. Runs the full test suite (with up to 2 retries on CI, so flaky tests become visible in the report)
4. Reports failures as annotations on the run page
5. Uploads the HTML report as the `playwright-report` artifact, kept for 30 days
6. On `main`, publishes the same report to [GitHub Pages](https://matibarluenga.github.io/saucedemo-playwright-ci/), so the latest results can be viewed without downloading anything

## Roadmap

- [ ] Refactor to the Page Object Model
- [ ] Data-driven tests for the negative login scenarios
- [ ] Cross-browser execution (Firefox and WebKit)
- [ ] Environment variables for credentials with dotenv
