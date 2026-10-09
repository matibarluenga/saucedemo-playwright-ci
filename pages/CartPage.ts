import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.cartItems = page.getByTestId("inventory-item");
    this.checkoutButton = page.getByTestId("checkout");
    this.continueShoppingButton = page.getByTestId("continue-shopping");
  }

  async goto() {
    await this.page.goto("/cart.html");
  }

  item(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  itemPrice(name: string): Locator {
    return this.item(name).getByTestId("inventory-item-price");
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
