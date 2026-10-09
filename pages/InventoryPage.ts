import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }
}
