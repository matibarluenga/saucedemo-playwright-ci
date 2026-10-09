import { Page, Locator } from "@playwright/test";

export class CheckoutCompletePage {
  readonly page: Page;
  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.completeHeader = page.getByTestId("complete-header");
    this.completeText = page.getByTestId("complete-text");
    this.backHomeButton = page.getByTestId("back-to-products");
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
