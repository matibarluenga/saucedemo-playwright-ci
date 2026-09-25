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
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("/inventory.html");
  await expect(page.getByTestId("title")).toHaveText("Products");
});

test("invalid password", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("incorrectPass123");
  await page.getByTestId("login-button").click();

  await expect(page).not.toHaveURL("/inventory.html");
  await expect(page.getByTestId("error")).toContainText("do not match");
});

test("e2e login and complete a purchase", async ({ page }) => {
  //login
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();
  await expect(page).toHaveURL("/inventory.html");
  await expect(page.getByTestId("title")).toHaveText("Products");

  //validate that no product is in the cart
  const cartBadge = page.getByTestId("shopping-cart-badge");
  if ((await cartBadge.count()) > 0) {
    await page.getByTestId("shopping-cart-link").click();
    const removeButtons = page.locator(".cart_button");
    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click();
    }
    await page.getByTestId("continue-shopping").click();
  }
  await expect(cartBadge).toHaveCount(0);

  //add a product to the cart
  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await expect(
    page
      .getByTestId("inventory-item-description")
      .filter({ hasText: "Sauce Labs Backpack" })
      .getByTestId("remove-sauce-labs-backpack"),
  ).toBeVisible();

  //check the added products
});
