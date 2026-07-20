const EXIT_COMMAND = "bye";
const PRODUCT_ID_PATTERN = /^\d+$/;
const INTEGER_PATTERN = /^[+-]?\d+$/;

/**
 * Converts raw terminal input into a structured command.
 *
 * @param {unknown} input Raw value received from the user.
 * @returns {{ type: "exit" } |
 *   { type: "operation", productId: string, quantityDelta: number } |
 *   { type: "invalid", reason: string }}
 */
export function parseCommand(input) {
  if (typeof input !== "string") {
    return invalid("INVALID_FORMAT");
  }

  const normalizedInput = input.trim();

  if (normalizedInput.toLowerCase() === EXIT_COMMAND) {
    return { type: "exit" };
  }

  const parts = normalizedInput === "" ? [] : normalizedInput.split(/\s+/);

  if (parts.length !== 2) {
    return invalid("INVALID_FORMAT");
  }

  const [productId, quantityText] = parts;

  if (!PRODUCT_ID_PATTERN.test(productId)) {
    return invalid("INVALID_PRODUCT_ID");
  }

  if (!INTEGER_PATTERN.test(quantityText)) {
    return invalid("INVALID_QUANTITY");
  }

  const quantityDelta = Number(quantityText);

  if (!Number.isSafeInteger(quantityDelta) || quantityDelta === 0) {
    return invalid("INVALID_QUANTITY");
  }

  return {
    type: "operation",
    productId,
    quantityDelta
  };
}

function invalid(reason) {
  return { type: "invalid", reason };
}
