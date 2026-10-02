import { test, expect } from "@playwright/test";

test("e2e purchase flow: login, add to cart and complete checkout", async ({
  page,
}) => {
  const cartBadge = page.getByTestId("shopping-cart-badge");

  // login
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();
  await expect(page).toHaveURL("/inventory.html");
  await expect(page.getByTestId("title")).toHaveText("Products");

  // fresh browser context → cart starts empty
  await expect(cartBadge).toHaveCount(0);

  // remember the price and add a product to the cart
  const priceSauceLabsBackpack = await page
    .getByTestId("inventory-item")
    .filter({ hasText: "Sauce Labs Backpack" })
    .getByTestId("inventory-item-price")
    .textContent();
  expect(priceSauceLabsBackpack).not.toBeNull();

  await page.getByTestId("add-to-cart-sauce-labs-backpack").click();
  await expect(page.getByTestId("remove-sauce-labs-backpack")).toBeVisible();
  await expect(cartBadge).toHaveText("1");

  // go to the cart and verify we landed there
  await page.getByTestId("shopping-cart-link").click();
  await expect(page).toHaveURL("/cart.html");
  await expect(page.getByTestId("title")).toHaveText("Your Cart");

  // verify the product is in the cart and its price matches the inventory
  const backpackInCart = page
    .getByTestId("inventory-item")
    .filter({ hasText: "Sauce Labs Backpack" });

  await expect(backpackInCart).toBeVisible();
  await expect(backpackInCart.getByTestId("inventory-item-price")).toHaveText(
    priceSauceLabsBackpack!,
  );

  // checkout the product - step 1
  await page.getByTestId("checkout").click();
  await expect(page).toHaveURL("/checkout-step-one.html");
  await expect(page.getByTestId("title")).toContainText("Checkout");
  await page.getByTestId("firstName").fill("Testname");
  await page.getByTestId("lastName").fill("Testlastname");
  await page.getByTestId("postalCode").fill("1234");
  await page.getByTestId("continue").click();

  // checkout the product - step 2 (overview)
  await expect(page).toHaveURL("/checkout-step-two.html");

  // verify the price in the summary still matches the inventory price
  const backpackInSummary = page
    .locator(".cart_item")
    .filter({ hasText: "Sauce Labs Backpack" });

  await expect(
    backpackInSummary.getByTestId("inventory-item-price"),
  ).toHaveText(priceSauceLabsBackpack!);

  // verify the summary shows the expected sections
  await expect(page.locator(".summary_info")).toContainText(
    "Payment Information",
  );
  await expect(page.locator(".summary_info")).toContainText(
    "Shipping Information",
  );
  await expect(page.locator(".summary_info")).toContainText("Total");

  // verify the item total matches the product price
  await expect(page.getByTestId("subtotal-label")).toContainText(
    priceSauceLabsBackpack!,
  );

  // finish the purchase and verify confirmation
  await page.getByTestId("finish").click();
  await expect(page).toHaveURL("/checkout-complete.html");
  await expect(page.getByTestId("complete-header")).toHaveText(
    "Thank you for your order!",
  );
});
