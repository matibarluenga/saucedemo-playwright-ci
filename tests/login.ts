import { test, expect } from "@playwright/test";

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

//saucedemo tests

//1.successful login
//2.try to login with invalid password

test("successful login", async ({ page }) => {
  await page.goto("");
  await page.getByPlaceholder("username").fill("standard_user");
  await page.getByPlaceholder("password").fill("secret_sauce");
  await page.locator("#login-button").click();
  await expect(page).toHaveURL("/inventory.html");
});
