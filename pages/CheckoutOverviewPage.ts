import { Page, Locator } from "@playwright/test";

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly paymentInfoLabel: Locator;
  readonly shippingInfoLabel: Locator;
  readonly totalInfoLabel: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.cartItems = page.getByTestId("inventory-item");
    this.paymentInfoLabel = page.getByTestId("payment-info-label");
    this.shippingInfoLabel = page.getByTestId("shipping-info-label");
    this.totalInfoLabel = page.getByTestId("total-info-label");
    this.subtotalLabel = page.getByTestId("subtotal-label");
    this.taxLabel = page.getByTestId("tax-label");
    this.totalLabel = page.getByTestId("total-label");
    this.finishButton = page.getByTestId("finish");
    this.cancelButton = page.getByTestId("cancel");
  }

  item(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  itemPrice(name: string): Locator {
    return this.item(name).getByTestId("inventory-item-price");
  }

  async finish() {
    await this.finishButton.click();
  }
}
