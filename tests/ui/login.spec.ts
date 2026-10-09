import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  await loginPage.goto();
});

test("successful login", async ({ page }) => {
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL("/inventory.html");
  await expect(inventoryPage.title).toHaveText("Products");
});

test("invalid password", async ({ page }) => {
  await loginPage.login("standard_user", "incorrectPass123");

  await expect(page).toHaveURL("/");
  await expect(loginPage.errorMessage).toContainText(
    "Username and password do not match any user in this service",
  );
});

test("empty password", async ({ page }) => {
  await loginPage.login("standard_user", "");

  await expect(page).toHaveURL("/");
  await expect(loginPage.errorMessage).toContainText("Password is required");
});

test("empty username", async ({ page }) => {
  await loginPage.login("", "secret_sauce");

  await expect(page).toHaveURL("/");
  await expect(loginPage.errorMessage).toContainText("Username is required");
});

test("non-existent username", async ({ page }) => {
  await loginPage.login("non_existent_user", "secret_sauce");

  await expect(page).toHaveURL("/");
  await expect(loginPage.errorMessage).toContainText(
    "Username and password do not match any user in this service",
  );
});

test("locked out user", async ({ page }) => {
  await loginPage.login("locked_out_user", "secret_sauce");

  await expect(page).toHaveURL("/");
  await expect(loginPage.errorMessage).toContainText(
    "Sorry, this user has been locked out.",
  );
});

test("protected page redirects to login when not logged in", async ({
  page,
}) => {
  await inventoryPage.goto();

  await expect(page).toHaveURL("/");
  await expect(loginPage.errorMessage).toContainText(
    "You can only access '/inventory.html' when you are logged in.",
  );
});
