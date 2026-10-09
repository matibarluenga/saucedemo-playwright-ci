import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutInfoPage } from "../../pages/CheckoutInfoPage";
import { CheckoutOverviewPage } from "../../pages/CheckoutOverviewPage";
import { CheckoutCompletePage } from "../../pages/CheckoutCompletePage";

const PRODUCT = "Sauce Labs Backpack";

test("e2e purchase flow: login, add to cart and complete checkout", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutInfoPage = new CheckoutInfoPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);

  // login
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL("/inventory.html");
  await expect(inventoryPage.title).toHaveText("Products");

  // fresh browser context → cart starts empty
  await expect(inventoryPage.cartBadge).toHaveCount(0);

  // remember the price and add the product to the cart
  const price = await inventoryPage.getPrice(PRODUCT);
  await inventoryPage.addToCart(PRODUCT);
  await expect(inventoryPage.removeButton(PRODUCT)).toBeVisible();
  await expect(inventoryPage.cartBadge).toHaveText("1");

  // cart: product is there and its price matches the inventory
  await inventoryPage.goToCart();
  await expect(page).toHaveURL("/cart.html");
  await expect(cartPage.title).toHaveText("Your Cart");
  await expect(cartPage.item(PRODUCT)).toBeVisible();
  await expect(cartPage.itemPrice(PRODUCT)).toHaveText(price);

  // checkout step 1: customer info
  await cartPage.checkout();
  await expect(page).toHaveURL("/checkout-step-one.html");
  await expect(checkoutInfoPage.title).toContainText("Checkout");
  await checkoutInfoPage.fillInfo("Testname", "Testlastname", "1234");
  await checkoutInfoPage.continue();

  // checkout step 2: overview
  await expect(page).toHaveURL("/checkout-step-two.html");
  await expect(checkoutOverviewPage.itemPrice(PRODUCT)).toHaveText(price);
  await expect(checkoutOverviewPage.paymentInfoLabel).toBeVisible();
  await expect(checkoutOverviewPage.shippingInfoLabel).toBeVisible();
  await expect(checkoutOverviewPage.totalLabel).toBeVisible();
  await expect(checkoutOverviewPage.subtotalLabel).toContainText(price);

  // finish and verify confirmation
  await checkoutOverviewPage.finish();
  await expect(page).toHaveURL("/checkout-complete.html");
  await expect(checkoutCompletePage.completeHeader).toHaveText(
    "Thank you for your order!",
  );
});
