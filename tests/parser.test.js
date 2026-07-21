import { describe, expect, it } from "vitest";
import { parseCommand } from "../src/parser.js";

describe("parseCommand", () => {
  it("parses an operation with a positive quantity", () => {
    expect(parseCommand("12345 5")).toEqual({
      type: "operation",
      productId: "12345",
      quantityDelta: 5
    });
  });

  it("parses an operation with a negative quantity", () => {
    expect(parseCommand("12345 -5")).toEqual({
      type: "operation",
      productId: "12345",
      quantityDelta: -5
    });
  });

  it("preserves leading zeroes in product IDs", () => {
    expect(parseCommand("00042 10")).toEqual({
      type: "operation",
      productId: "00042",
      quantityDelta: 10
    });
  });

  it("accepts surrounding and repeated whitespace", () => {
    expect(parseCommand("  12345   -2  ")).toEqual({
      type: "operation",
      productId: "12345",
      quantityDelta: -2
    });
  });

  it("accepts an explicit plus sign", () => {
    expect(parseCommand("12345 +5")).toEqual({
      type: "operation",
      productId: "12345",
      quantityDelta: 5
    });
  });

  it.each(["bye", "BYE", " Bye "])("recognizes the exit command %j", (input) => {
    expect(parseCommand(input)).toEqual({ type: "exit" });
  });

  it.each(["", "   ", "12345", "12345 5 extra"])(
    "rejects input with an invalid structure: %j",
    (input) => {
      expect(parseCommand(input)).toEqual({
        type: "invalid",
        reason: "INVALID_FORMAT"
      });
    }
  );

  it.each(["abc 5", "12-3 5", "12.3 5", "-123 5", "bye now"])(
    "rejects an invalid product ID: %j",
    (input) => {
      expect(parseCommand(input)).toEqual({
        type: "invalid",
        reason: "INVALID_PRODUCT_ID"
      });
    }
  );

  it.each([
    "12345 0",
    "12345 -0",
    "12345 2.5",
    "12345 five",
    "12345 1e3",
    "12345 0x10",
    `12345 ${Number.MAX_SAFE_INTEGER + 1}`
  ])("rejects an invalid quantity: %j", (input) => {
    expect(parseCommand(input)).toEqual({
      type: "invalid",
      reason: "INVALID_QUANTITY"
    });
  });

  it.each([null, undefined, 12345, {}, []])(
    "rejects a non-string input: %j",
    (input) => {
      expect(parseCommand(input)).toEqual({
        type: "invalid",
        reason: "INVALID_FORMAT"
      });
    }
  );
});
