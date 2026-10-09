import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.inventoryItems = page.getByTestId("inventory-item");
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }

  item(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  itemPrice(name: string): Locator {
    return this.item(name).getByTestId("inventory-item-price");
  }

  async getPrice(name: string): Promise<string> {
    const price = await this.itemPrice(name).textContent();
    if (price === null) throw new Error(`No price found for "${name}"`);
    return price;
  }

  async addToCart(name: string) {
    await this.item(name).getByRole("button", { name: "Add to cart" }).click();
  }

  removeButton(name: string): Locator {
    return this.item(name).getByRole("button", { name: "Remove" });
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
