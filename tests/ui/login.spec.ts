import { test, expect } from "@playwright/test";

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

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("error")).toContainText(
    "Username and password do not match any user in this service",
  );
});

//test empty password
test("empty password", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("username").fill("standard_user");
  await page.getByTestId("password").fill("");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("error")).toContainText("Password is required");
});

test("empty username", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("error")).toContainText("Username is required");
});

test("non-existent username", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("username").fill("non_existent_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("error")).toContainText(
    "Username and password do not match any user in this service",
  );
});

test("locked out user", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("username").fill("locked_out_user");
  await page.getByTestId("password").fill("secret_sauce");
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("error")).toContainText(
    "Sorry, this user has been locked out.",
  );
});

test("protected page redirects to login when not logged in", async ({
  page,
}) => {
  await page.goto("/inventory.html");

  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("error")).toContainText(
    "You can only access '/inventory.html' when you are logged in.",
  );
});
