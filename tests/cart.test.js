import { describe, expect, it } from "vitest";
import { Cart } from "../src/cart.js";

describe("Cart", () => {
  it("starts empty", () => {
    const cart = new Cart();

    expect(cart.isEmpty()).toBe(true);
    expect(cart.getItems()).toEqual([]);
  });

  it("adds a product that is not in the cart", () => {
    const cart = new Cart();

    const result = cart.update("12345", 5);

    expect(result).toEqual({
      success: true,
      action: "added",
      productId: "12345",
      quantity: 5
    });
    expect(cart.getItems()).toEqual([{ productId: "12345", quantity: 5 }]);
    expect(cart.isEmpty()).toBe(false);
  });

  it("increments the quantity of an existing product", () => {
    const cart = new Cart();
    cart.update("12345", 5);

    const result = cart.update("12345", 3);

    expect(result).toEqual({
      success: true,
      action: "updated",
      productId: "12345",
      quantity: 8
    });
    expect(cart.getItems()).toEqual([{ productId: "12345", quantity: 8 }]);
  });

  it("reduces a product without reaching zero", () => {
    const cart = new Cart();
    cart.update("12345", 5);

    const result = cart.update("12345", -2);

    expect(result).toEqual({
      success: true,
      action: "updated",
      productId: "12345",
      quantity: 3
    });
    expect(cart.getItems()).toEqual([{ productId: "12345", quantity: 3 }]);
  });

  it("removes a product when its quantity reaches zero", () => {
    const cart = new Cart();
    cart.update("12345", 5);

    const result = cart.update("12345", -5);

    expect(result).toEqual({
      success: true,
      action: "removed",
      productId: "12345",
      quantity: 0
    });
    expect(cart.getItems()).toEqual([]);
    expect(cart.isEmpty()).toBe(true);
  });

  it("rejects reducing a product that does not exist", () => {
    const cart = new Cart();

    const result = cart.update("12345", -5);

    expect(result).toEqual({
      success: false,
      reason: "PRODUCT_NOT_FOUND",
      productId: "12345"
    });
    expect(cart.getItems()).toEqual([]);
  });

  it("rejects reducing more units than are available without changing state", () => {
    const cart = new Cart();
    cart.update("12345", 5);

    const result = cart.update("12345", -6);

    expect(result).toEqual({
      success: false,
      reason: "INSUFFICIENT_QUANTITY",
      productId: "12345",
      requested: 6,
      available: 5
    });
    expect(cart.getItems()).toEqual([{ productId: "12345", quantity: 5 }]);
  });

  it("preserves insertion order and moves a re-added product to the end", () => {
    const cart = new Cart();
    cart.update("100", 1);
    cart.update("200", 2);
    cart.update("100", -1);

    cart.update("100", 3);

    expect(cart.getItems()).toEqual([
      { productId: "200", quantity: 2 },
      { productId: "100", quantity: 3 }
    ]);
  });

  it("returns snapshots that cannot mutate the cart", () => {
    const cart = new Cart();
    cart.update("12345", 5);
    const items = cart.getItems();

    items[0].quantity = 99;
    items.push({ productId: "999", quantity: 1 });

    expect(cart.getItems()).toEqual([{ productId: "12345", quantity: 5 }]);
  });

  it.each(["", "abc", "12-3", " 123", 123, null, undefined])(
    "rejects invalid product ID %j",
    (productId) => {
      const cart = new Cart();

      expect(() => cart.update(productId, 1)).toThrow(TypeError);
      expect(cart.getItems()).toEqual([]);
    }
  );

  it.each([0, 1.5, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid quantity %j",
    (quantity) => {
      const cart = new Cart();

      expect(() => cart.update("12345", quantity)).toThrow(RangeError);
      expect(cart.getItems()).toEqual([]);
    }
  );

  it("rejects an increment that would exceed the safe integer range", () => {
    const cart = new Cart();
    cart.update("12345", Number.MAX_SAFE_INTEGER);

    const result = cart.update("12345", 1);

    expect(result).toEqual({
      success: false,
      reason: "QUANTITY_OVERFLOW",
      productId: "12345"
    });
    expect(cart.getItems()).toEqual([
      { productId: "12345", quantity: Number.MAX_SAFE_INTEGER }
    ]);
  });
});
