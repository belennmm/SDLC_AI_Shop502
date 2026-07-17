/**
 * In-memory shopping cart for a single anonymous user session.
 */
export class Cart {
  #items = new Map();

  /**
   * Applies a signed quantity change to a product.
   *
   * @param {string} productId Numeric product identifier.
   * @param {number} quantityDelta Non-zero safe integer to add to the cart.
   * @returns {{ success: boolean, [key: string]: string | number | boolean }}
   */
  update(productId, quantityDelta) {
    this.#validateProductId(productId);
    this.#validateQuantityDelta(quantityDelta);

    const currentQuantity = this.#items.get(productId);

    if (quantityDelta < 0 && currentQuantity === undefined) {
      return {
        success: false,
        reason: "PRODUCT_NOT_FOUND",
        productId
      };
    }

    const nextQuantity = (currentQuantity ?? 0) + quantityDelta;

    if (!Number.isSafeInteger(nextQuantity)) {
      return {
        success: false,
        reason: "QUANTITY_OVERFLOW",
        productId
      };
    }

    if (nextQuantity < 0) {
      return {
        success: false,
        reason: "INSUFFICIENT_QUANTITY",
        productId,
        requested: Math.abs(quantityDelta),
        available: currentQuantity
      };
    }

    if (nextQuantity === 0) {
      this.#items.delete(productId);

      return {
        success: true,
        action: "removed",
        productId,
        quantity: 0
      };
    }

    this.#items.set(productId, nextQuantity);

    return {
      success: true,
      action: currentQuantity === undefined ? "added" : "updated",
      productId,
      quantity: nextQuantity
    };
  }

  /**
   * Returns a snapshot of the cart in insertion order.
   *
   * @returns {{ productId: string, quantity: number }[]}
   */
  getItems() {
    return Array.from(this.#items, ([productId, quantity]) => ({
      productId,
      quantity
    }));
  }

  /**
   * @returns {boolean} Whether the cart contains no products.
   */
  isEmpty() {
    return this.#items.size === 0;
  }

  #validateProductId(productId) {
    if (typeof productId !== "string" || !/^\d+$/.test(productId)) {
      throw new TypeError("Product ID must contain only digits");
    }
  }

  #validateQuantityDelta(quantityDelta) {
    if (!Number.isSafeInteger(quantityDelta) || quantityDelta === 0) {
      throw new RangeError("Quantity must be a non-zero safe integer");
    }
  }
}
