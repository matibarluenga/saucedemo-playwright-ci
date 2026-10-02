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

  await expect(page).not.toHaveURL("/inventory.html");
  await expect(page.getByTestId("error")).toContainText("do not match");
});
